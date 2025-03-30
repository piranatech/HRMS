const { pool } = require("../config/db.config");

class LeaveBalanceModel {
    // ✅ Get Employee's Leave Balance
    static async getEmployeeBalance(employe_id, year) {
        const query = `
            SELECT 
                tc.type_nom AS type_conge,
                sc.solde_annuel,
                sc.solde_restant
            FROM solde_conges sc
            JOIN type_conges tc ON sc.type_conge_id = tc.id
            WHERE sc.employe_id = $1 
            AND sc.annee = $2;
        `;
        const result = await pool.query(query, [employe_id, year]);
        return result.rows;
    }

    // ✅ Deduct Leave Balance for an Employee
    static async updateLeaveBalance(employe_id, type_conge_id, year, joursUtilises) {
        const query = `
            UPDATE solde_conges
            SET solde_restant = solde_restant - $1, 
                updated_at = CURRENT_TIMESTAMP
            WHERE employe_id = $2 
            AND type_conge_id = $3 
            AND annee = $4
            AND solde_restant >= $1
            RETURNING *;
        `;
        const result = await pool.query(query, [
            joursUtilises,
            employe_id,
            type_conge_id,
            year
        ]);
        return result.rows[0];
    }

    // ✅ Initialize Yearly Leave Balance for All Employees
    static async initializeYearlyBalance(year) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Get all active employees
            const employeesQuery = `SELECT employe_id FROM employees WHERE actif = true;`;
            const employees = await client.query(employeesQuery);

            // Get all active leave types
            const typeCongesQuery = `SELECT id, jours_default FROM type_conges WHERE actif = true;`;
            const typeConges = await client.query(typeCongesQuery);

            for (const employee of employees.rows) {
                for (const typeConge of typeConges.rows) {
                    await client.query(`
                        INSERT INTO solde_conges (
                            employe_id, 
                            type_conge_id, 
                            annee, 
                            solde_annuel, 
                            solde_restant,
                            updated_at
                        ) VALUES ($1, $2, $3, $4, $4, NOW())
                        ON CONFLICT (employe_id, type_conge_id, annee) 
                        DO NOTHING;
                    `, [
                        employee.employe_id,
                        typeConge.id,
                        year,
                        typeConge.jours_default
                    ]);
                }
            }

            await client.query("COMMIT");
            return { message: "Soldes de congés initialisés avec succès" };
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    // ✅ Get Leave Balance Report
    static async getLeaveBalanceReport(departement, annee) {
        const query = `
            SELECT 
                e.nom,
                e.prenom,
                e.entite,
                tc.type_nom AS type_conge,
                sc.solde_annuel,
                sc.solde_restant,
                ROUND((sc.solde_restant::decimal / sc.solde_annuel * 100), 2) AS pourcentage_utilisation
            FROM employees e
            JOIN solde_conges sc ON e.employe_id = sc.employe_id
            JOIN type_conges tc ON sc.type_conge_id = tc.id
            WHERE e.actif = true
            AND sc.annee = $1
            ${departement ? "AND e.entite = $2" : ""}
            ORDER BY e.entite, e.nom, e.prenom, tc.type_nom;
        `;
        
        const params = departement ? [annee, departement] : [annee];
        const result = await pool.query(query, params);
        return result.rows;
    }
}

module.exports = LeaveBalanceModel;
