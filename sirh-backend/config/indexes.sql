-- Drop existing indexes to avoid conflicts
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_email_role;

DROP INDEX IF EXISTS idx_employees_user_id;
DROP INDEX IF EXISTS idx_employees_manager_id;
DROP INDEX IF EXISTS idx_employees_email;
DROP INDEX IF EXISTS idx_employees_statut;
DROP INDEX IF EXISTS idx_employees_departement;
DROP INDEX IF EXISTS idx_employees_nom_prenom;
DROP INDEX IF EXISTS idx_employees_date_embauche;

DROP INDEX IF EXISTS idx_type_conges_actif;
DROP INDEX IF EXISTS idx_type_conges_nom;

DROP INDEX IF EXISTS idx_solde_conges_employe_id;
DROP INDEX IF EXISTS idx_solde_conges_type_conge_id;
DROP INDEX IF EXISTS idx_solde_conges_annee;
DROP INDEX IF EXISTS idx_solde_conges_employe_annee;
DROP INDEX IF EXISTS idx_solde_conges_employe_type;
DROP INDEX IF EXISTS idx_solde_conges_jours_restants;

DROP INDEX IF EXISTS idx_conges_employe_id;
DROP INDEX IF EXISTS idx_conges_type_conge_id;
DROP INDEX IF EXISTS idx_conges_statut;
DROP INDEX IF EXISTS idx_conges_date_debut;
DROP INDEX IF EXISTS idx_conges_date_fin;
DROP INDEX IF EXISTS idx_conges_date_validation;
DROP INDEX IF EXISTS idx_conges_valide_par;
DROP INDEX IF EXISTS idx_conges_employe_dates;
DROP INDEX IF EXISTS idx_conges_employe_statut;
DROP INDEX IF EXISTS idx_conges_dates;

DROP INDEX IF EXISTS idx_jours_feries_date;
DROP INDEX IF EXISTS idx_jours_feries_recurrent;
DROP INDEX IF EXISTS idx_jours_feries_date_recurrent;

DROP INDEX IF EXISTS idx_historique_conges_conge_id;
DROP INDEX IF EXISTS idx_historique_conges_statut;
DROP INDEX IF EXISTS idx_historique_conges_modifie_par;
DROP INDEX IF EXISTS idx_historique_conges_created_at;

-- Create indexes for better performance

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email_role ON users(email, role);

-- Employees table indexes
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_manager_id ON employees(manager_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_statut ON employees(statut);
CREATE INDEX idx_employees_departement ON employees(departement);
CREATE INDEX idx_employees_nom_prenom ON employees(nom, prenom);
CREATE INDEX idx_employees_date_embauche ON employees(date_embauche);

-- Leave types table indexes
CREATE INDEX idx_type_conges_actif ON type_conges(actif);
CREATE INDEX idx_type_conges_nom ON type_conges(nom);

-- Leave balances table indexes
CREATE INDEX idx_solde_conges_employe_id ON solde_conges(employe_id);
CREATE INDEX idx_solde_conges_type_conge_id ON solde_conges(type_conge_id);
CREATE INDEX idx_solde_conges_annee ON solde_conges(annee);
CREATE INDEX idx_solde_conges_employe_annee ON solde_conges(employe_id, annee);
CREATE INDEX idx_solde_conges_employe_type ON solde_conges(employe_id, type_conge_id);
CREATE INDEX idx_solde_conges_jours_restants ON solde_conges(jours_restants);

-- Leave requests table indexes
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

-- Holidays table indexes
CREATE INDEX idx_jours_feries_date ON jours_feries(date);
CREATE INDEX idx_jours_feries_recurrent ON jours_feries(recurrent);
CREATE INDEX idx_jours_feries_date_recurrent ON jours_feries(date, recurrent);

-- Leave history table indexes
CREATE INDEX idx_historique_conges_conge_id ON historique_conges(conge_id);
CREATE INDEX idx_historique_conges_statut ON historique_conges(statut);
CREATE INDEX idx_historique_conges_modifie_par ON historique_conges(modifié_par);
CREATE INDEX idx_historique_conges_created_at ON historique_conges(created_at); 