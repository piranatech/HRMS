const { pool } = require("../config/db.config");
const bcrypt = require("bcrypt");

// Function to generate the next available Employee ID (A0001 → Z9999)
const generateNextEmployeeID = async () => {
    const query = `SELECT employe_id FROM employees ORDER BY employe_id DESC LIMIT 1`;
    const result = await pool.query(query);
    
    if (result.rows.length === 0) return "A0001"; // First employee

    let lastID = result.rows[0].employe_id; // Example: "A0123"
    let letter = lastID.charAt(0);  // Get "A"
    let number = parseInt(lastID.slice(1)); // Get "0123"

    number++; // Increment (A0123 → A0124)

    if (number > 9999) {  // If reaches A9999 → Move to B0001
        if (letter === "Z") throw new Error("Employee ID limit reached");
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
        number = 1;
    }

    return `${letter}${number.toString().padStart(4, "0")}`; // Format: "A0001"
};
exports.findByEmployeId = async (employe_id) => {
  try {
      const result = await pool.query("SELECT * FROM employees WHERE employe_id = $1", [employe_id]);
      return result.rows[0]; // Return the first employee found (or undefined)
  } catch (error) {
      console.error("❌ Error in EmployeeModel (findByEmployeId):", error);
      throw error;
  }
};
// ==========================
// 🔹 GET ALL EMPLOYEES
// ==========================
exports.getAllEmployees = async () => {
    const result = await pool.query("SELECT * FROM employees ORDER BY employe_id ASC");
    return result.rows;
};

// ==========================
// 🔹 CREATE A NEW EMPLOYEE
// ==========================
exports.createEmployee = async (employeeData) => {
    const {
        cin,
        nom,
        prenom,
        email,
        tel_mobile,
        poste,
        date_entree,
        statut = 'actif'
    } = employeeData;

    // Generate Employee ID (A0001 → Z9999)
    const employe_id = await generateNextEmployeeID();
    const hashedPassword = await bcrypt.hash(cin, 10); // Default password = CIN

    const query = `
        INSERT INTO employees 
        (employe_id, cin, nom, prenom, email, tel_mobile, poste, date_entree, statut, password_hash, first_login)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        RETURNING *
    `;

    const values = [employe_id, cin, nom, prenom, email, tel_mobile, poste, date_entree, statut, hashedPassword];

    const result = await pool.query(query, values);

    // ✅ Also initialize leave balance (set to 0)
    await pool.query(
        `INSERT INTO solde_conges (employe_id, solde_annuel, solde_restant, annee) VALUES ($1, 22, 0, EXTRACT(YEAR FROM CURRENT_DATE))`,
        [employe_id]
    );

    return result.rows[0];
};

// ==========================
// 🔹 UPDATE EXISTING EMPLOYEE
// ==========================
exports.updateEmployee = async (employe_id, employeeData) => {
    const {
        nom,
        prenom,
        email,
        tel_mobile,
        poste,
        date_entree,
        statut
    } = employeeData;

    const query = `
        UPDATE employees SET
            nom = $1,
            prenom = $2,
            email = $3,
            tel_mobile = $4,
            poste = $5,
            date_entree = $6,
            statut = $7
        WHERE employe_id = $8
        RETURNING *
    `;

    const values = [nom, prenom, email, tel_mobile, poste, date_entree, statut, employe_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// ==========================
// 🔹 DELETE AN EMPLOYEE
// ==========================
exports.deleteEmployee = async (employe_id) => {
    const query = "DELETE FROM employees WHERE employe_id = $1 RETURNING *";
    const result = await pool.query(query, [employe_id]);
    return result.rows[0]; // returns undefined if not found
};

// ==========================
// 🔹 UPDATE PASSWORD
// ==========================
exports.updatePassword = async (employe_id, newPasswordHash, firstLogin = false) => {
  try {
      const query = `
          UPDATE employees 
          SET password_hash = $1, first_login = $2, date_modification = CURRENT_TIMESTAMP 
          WHERE employe_id = $3
      `;
      await pool.query(query, [newPasswordHash, firstLogin, employe_id]);
      return true;
  } catch (error) {
      console.error("❌ Error updating password:", error);
      throw error;
  }
};

// ==========================
// 🔹 RESET PASSWORD
// ==========================

exports.updatePassword = async (employe_id, newPasswordHash, firstLogin = false) => {
  try {
      const query = `
          UPDATE employees 
          SET password_hash = $1, first_login = $2, date_modification = CURRENT_TIMESTAMP 
          WHERE employe_id = $3
      `;
      await pool.query(query, [newPasswordHash, firstLogin, employe_id]);
      return true;
  } catch (error) {
      console.error("❌ Error updating password:", error);
      throw error;
  }
};
