-- Drop existing tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS historique_conges CASCADE;
DROP TABLE IF EXISTS conges CASCADE;
DROP TABLE IF EXISTS solde_conges CASCADE;
DROP TABLE IF EXISTS type_conges CASCADE;
DROP TABLE IF EXISTS jours_feries CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'rh', 'manager', 'employee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    poste VARCHAR(100),
    departement VARCHAR(100),
    date_embauche DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'quitté')),
    manager_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Leave Types table
CREATE TABLE type_conges (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    jours_default INTEGER DEFAULT 0,
    couleur VARCHAR(7),  -- For calendar display
    necessite_validation BOOLEAN DEFAULT true,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Leave Balances table
CREATE TABLE solde_conges (
    id SERIAL PRIMARY KEY,
    employe_id INTEGER REFERENCES employees(id),
    type_conge_id INTEGER REFERENCES type_conges(id),
    annee INTEGER NOT NULL,
    total_jours DECIMAL(5,2) NOT NULL,
    jours_pris DECIMAL(5,2) DEFAULT 0,
    jours_restants DECIMAL(5,2) GENERATED ALWAYS AS (total_jours - jours_pris) STORED,
    derniere_maj DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employe_id, type_conge_id, annee)
);

-- Create Leave Requests table
CREATE TABLE conges (
    id SERIAL PRIMARY KEY,
    employe_id INTEGER REFERENCES employees(id),
    type_conge_id INTEGER REFERENCES type_conges(id),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    total_jours DECIMAL(5,2) NOT NULL,
    motif TEXT,
    statut VARCHAR(20) DEFAULT 'en_attente' 
        CHECK (statut IN ('en_attente', 'approuvé', 'rejeté', 'annulé')),
    validé_par INTEGER REFERENCES employees(id),
    date_validation TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT dates_valides CHECK (date_fin >= date_debut)
);

-- Create Holidays table
CREATE TABLE jours_feries (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    recurrent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, recurrent)
);

-- Create Leave Request History table (for audit)
CREATE TABLE historique_conges (
    id SERIAL PRIMARY KEY,
    conge_id INTEGER REFERENCES conges(id),
    statut VARCHAR(20) NOT NULL,
    modifié_par INTEGER REFERENCES employees(id),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at triggers function
CREATE OR REPLACE FUNCTION maj_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at_column trigger to all relevant tables
CREATE TRIGGER maj_users_timestamp 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION maj_date_modification();

CREATE TRIGGER maj_employees_timestamp 
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION maj_date_modification();

CREATE TRIGGER maj_type_conges_timestamp 
    BEFORE UPDATE ON type_conges
    FOR EACH ROW EXECUTE FUNCTION maj_date_modification();

CREATE TRIGGER maj_solde_conges_timestamp 
    BEFORE UPDATE ON solde_conges
    FOR EACH ROW EXECUTE FUNCTION maj_date_modification();

CREATE TRIGGER maj_conges_timestamp 
    BEFORE UPDATE ON conges
    FOR EACH ROW EXECUTE FUNCTION maj_date_modification();

CREATE TRIGGER maj_jours_feries_timestamp 
    BEFORE UPDATE ON jours_feries
    FOR EACH ROW EXECUTE FUNCTION maj_date_modification();

-- Function to calculate working days between two dates
CREATE OR REPLACE FUNCTION calculer_jours_ouvrables(date_debut DATE, date_fin DATE)
RETURNS DECIMAL AS $$
DECLARE
    total_jours DECIMAL := 0;
    date_courante DATE := date_debut;
BEGIN
    WHILE date_courante <= date_fin LOOP
        -- Skip weekends
        IF EXTRACT(DOW FROM date_courante) NOT IN (0, 6) THEN
            -- Skip holidays
            IF NOT EXISTS (
                SELECT 1 FROM jours_feries 
                WHERE (date = date_courante OR (recurrent AND 
                    EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM date_courante) AND
                    EXTRACT(DAY FROM date) = EXTRACT(DAY FROM date_courante)))
            ) THEN
                total_jours := total_jours + 1;
            END IF;
        END IF;
        date_courante := date_courante + INTERVAL '1 day';
    END LOOP;
    RETURN total_jours;
END;
$$ LANGUAGE plpgsql;

-- Function to validate and process leave request
CREATE OR REPLACE FUNCTION traiter_demande_conge(
    p_employe_id INTEGER,
    p_type_conge_id INTEGER,
    p_date_debut DATE,
    p_date_fin DATE,
    p_motif TEXT
) RETURNS INTEGER AS $$
DECLARE
    v_total_jours DECIMAL;
    v_jours_restants DECIMAL;
    v_demande_id INTEGER;
    v_annee_courante INTEGER;
BEGIN
    -- Calculate working days
    v_total_jours := calculer_jours_ouvrables(p_date_debut, p_date_fin);
    v_annee_courante := EXTRACT(YEAR FROM p_date_debut);
    
    -- Check remaining balance
    SELECT jours_restants INTO v_jours_restants
    FROM solde_conges
    WHERE employe_id = p_employe_id 
    AND type_conge_id = p_type_conge_id 
    AND annee = v_annee_courante;

    IF v_jours_restants < v_total_jours THEN
        RAISE EXCEPTION 'Insufficient leave balance';
    END IF;

    -- Insert leave request
    INSERT INTO conges (
        employe_id, type_conge_id, date_debut, date_fin, 
        total_jours, motif, statut
    ) VALUES (
        p_employe_id, p_type_conge_id, p_date_debut, p_date_fin,
        v_total_jours, p_motif, 'en_attente'
    ) RETURNING id INTO v_demande_id;

    -- Record in history
    INSERT INTO historique_conges (
        conge_id, statut, modifié_par, commentaire
    ) VALUES (
        v_demande_id, 'en_attente', p_employe_id, 'Initial request'
    );

    RETURN v_demande_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default leave types
INSERT INTO type_conges (nom, description, jours_default, couleur, necessite_validation) VALUES
('Congés Annuels', 'Congés payés annuels', 30, '#2563eb', true),
('Congés Maladie', 'Congés pour raison médicale', 15, '#dc2626', true),
('Congés sans Solde', 'Congés non rémunérés', 0, '#9333ea', true),
('Télétravail', 'Journée de travail à distance', 0, '#16a34a', false)
ON CONFLICT DO NOTHING;

-- Insert default admin user
INSERT INTO users (email, password_hash, role) VALUES
('admin@sirh.com', '$2b$10$Ju5WdEeQGf7nf4Vnm2yXde8fMGDAMY85THxTyLkH/zCOuxCqcKJ96', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email_role ON users(email, role);

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_manager_id ON employees(manager_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_statut ON employees(statut);
CREATE INDEX idx_employees_departement ON employees(departement);
CREATE INDEX idx_employees_nom_prenom ON employees(nom, prenom);
CREATE INDEX idx_employees_date_embauche ON employees(date_embauche);

CREATE INDEX idx_type_conges_actif ON type_conges(actif);
CREATE INDEX idx_type_conges_nom ON type_conges(nom);

CREATE INDEX idx_solde_conges_employe_id ON solde_conges(employe_id);
CREATE INDEX idx_solde_conges_type_conge_id ON solde_conges(type_conge_id);
CREATE INDEX idx_solde_conges_annee ON solde_conges(annee);
CREATE INDEX idx_solde_conges_employe_annee ON solde_conges(employe_id, annee);
CREATE INDEX idx_solde_conges_employe_type ON solde_conges(employe_id, type_conge_id);
CREATE INDEX idx_solde_conges_jours_restants ON solde_conges(jours_restants);

CREATE INDEX idx_conges_employe_id ON conges(employe_id);
CREATE INDEX idx_conges_type_conge_id ON conges(type_conge_id);
CREATE INDEX idx_conges_statut ON conges(statut);
CREATE INDEX idx_conges_date_debut ON conges(date_debut);
CREATE INDEX idx_conges_date_fin ON conges(date_fin);
CREATE INDEX idx_conges_date_validation ON conges(date_validation);
CREATE INDEX idx_conges_valide_par ON conges(validé_par);
CREATE INDEX idx_conges_employe_dates ON conges(employe_id, date_debut, date_fin);
CREATE INDEX idx_conges_employe_statut ON conges(employe_id, statut);
CREATE INDEX idx_conges_dates ON conges(date_debut, date_fin);

CREATE INDEX idx_jours_feries_date ON jours_feries(date);
CREATE INDEX idx_jours_feries_recurrent ON jours_feries(recurrent);
CREATE INDEX idx_jours_feries_date_recurrent ON jours_feries(date, recurrent);

CREATE INDEX idx_historique_conges_conge_id ON historique_conges(conge_id);
CREATE INDEX idx_historique_conges_statut ON historique_conges(statut);
CREATE INDEX idx_historique_conges_modifie_par ON historique_conges(modifié_par);
CREATE INDEX idx_historique_conges_created_at ON historique_conges(created_at);

-- Create view for employee leave summary
CREATE OR REPLACE VIEW resume_conges_employes AS
SELECT 
    e.id as employe_id,
    e.nom,
    e.prenom,
    tc.nom as type_conge,
    sc.annee,
    sc.total_jours,
    sc.jours_pris,
    sc.jours_restants
FROM employees e
JOIN solde_conges sc ON e.id = sc.employe_id
JOIN type_conges tc ON sc.type_conge_id = tc.id
WHERE tc.actif = true; 