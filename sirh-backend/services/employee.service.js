const EmployeeModel = require("../models/employee.model");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db.config");

// ✅ Function to generate the next Employee ID in sequence
const generateEmployeeId = async () => {
  try {
    // Fetch the last employee ID in the current range
    const result = await pool.query(
      `SELECT employe_id 
       FROM employees 
       WHERE employe_id SIMILAR TO '[A-Z][0-9]{4}'
       ORDER BY employe_id DESC 
       LIMIT 1`
    );

    let lastId = result.rows.length ? result.rows[0].employe_id : "A0000";

    // Extract letter and number
    let letter = lastId[0]; // First character (A, B, C...)
    let number = parseInt(lastId.slice(1), 10); // Convert "0001" to 1

    // Increment number
    number += 1;

    // If number exceeds 9999, move to next letter (A → B, B → C, etc.)
    if (number > 9999) {
      letter = String.fromCharCode(letter.charCodeAt(0) + 1); // Move to next letter
      number = 1; // Reset number to 0001
    }

    // Format new ID (A0001, A0002, ..., B0001, etc.)
    return `${letter}${number.toString().padStart(4, "0")}`;
  } catch (error) {
    console.error("❌ Error generating Employee ID:", error);
    throw new Error("Failed to generate Employee ID.");
  }
};

// ✅ Get all employees
exports.getEmployees = async () => {
  try {
    const employees = await EmployeeModel.getAllEmployees();
    return {
      status: 200,
      message: "Employees fetched successfully.",
      data: employees,
    };
  } catch (error) {
    console.error("❌ Error in EmployeeService (getEmployees):", error);
    return { status: 500, message: "Internal server error." };
  }
};

// ✅ Create a new employee
exports.createEmployee = async (employeeData, createdBy) => {
  try {
    // 🔹 Generate `employe_id` automatically
    const employe_id = await generateEmployeeId();

    const {
      cin,
      nom,
      prenom,
      sexe,
      date_naissance,
      situation_familiale,
      nationalite = "Marocaine",
      tel_mobile,
      email,
      adresse_personnelle,
      ville,
      type_contrat,
      poste,
      entite,
      direction_fonctionnelle,
      direction_hierarchique,
      chantier,
      filiale,
      population,
      csp,
      statut_employe,
      source_recrutement,
      cnss,
      cimr,
      mutuelle,
      rib,
      cv_interne,
      doc_csp,
      photo,
      contact_urgence_nom,
      contact_urgence_tel,
      contact_urgence_lien,
      role = "employee",
      date_entree,
      date_sortie = null,
      company_id = 1, // Default to company 1
    } = employeeData;

    // ✅ Hash CIN as the default password
    const hashedPassword = await bcrypt.hash(cin, 10);

    const query = `
      INSERT INTO employees 
        (employe_id, cin, nom, prenom, sexe, date_naissance, situation_familiale, nationalite, 
        tel_mobile, email, adresse_personnelle, ville, type_contrat, poste, entite, 
        direction_fonctionnelle, direction_hierarchique, chantier, filiale, population, 
        csp, statut_employe, source_recrutement, cnss, cimr, mutuelle, rib, cv_interne, 
        doc_csp, photo, contact_urgence_nom, contact_urgence_tel, contact_urgence_lien, 
        role, password_hash, first_login, solde_congé, actif, date_entree, date_sortie, 
        cree_par, company_id) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 
         $9, $10, $11, $12, $13, $14, $15, 
         $16, $17, $18, $19, $20, 
         $21, $22, $23, $24, $25, $26, $27, $28, 
         $29, $30, $31, $32, $33, 
         $34, $35, true, 0.0, true, $36, $37, 
         $38, $39)
      RETURNING employe_id, nom, prenom, email, role, cree_par;
    `;

    const values = [
      employe_id,
      cin,
      nom,
      prenom,
      sexe,
      date_naissance,
      situation_familiale,
      nationalite,
      tel_mobile,
      email,
      adresse_personnelle,
      ville,
      type_contrat,
      poste,
      entite,
      direction_fonctionnelle,
      direction_hierarchique,
      chantier,
      filiale,
      population,
      csp,
      statut_employe,
      source_recrutement,
      cnss,
      cimr,
      mutuelle,
      rib,
      cv_interne,
      doc_csp,
      photo,
      contact_urgence_nom,
      contact_urgence_tel,
      contact_urgence_lien,
      role,
      hashedPassword, // ✅ Password hash
      date_entree,
      date_sortie,
      createdBy, // ✅ Now it stores the user who created this employee
      company_id,
    ];

    const result = await pool.query(query, values);
    return {
      status: 201,
      message: "Employee created successfully.",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("❌ Error in EmployeeService (createEmployee):", error);
    return { status: 500, message: "Internal server error." };
  }
};

// ✅ Update an existing employee
exports.updateEmployee = async (id, employeeData) => {
  try {
    const updated = await EmployeeModel.updateEmployee(id, employeeData);
    if (!updated) {
      return { status: 404, message: "Employee not found." };
    }
    return {
      status: 200,
      message: "Employee updated successfully.",
      data: updated,
    };
  } catch (error) {
    console.error("❌ Error in EmployeeService (updateEmployee):", error);
    return { status: 500, message: "Internal server error." };
  }
};

// ✅ Delete an employee
exports.deleteEmployee = async (id) => {
  try {
    const deleted = await EmployeeModel.deleteEmployee(id);
    if (!deleted) {
      return { status: 404, message: "Employee not found." };
    }
    return {
      status: 200,
      message: "Employee deleted successfully.",
      data: deleted,
    };
  } catch (error) {
    console.error("❌ Error in EmployeeService (deleteEmployee):", error);
    return { status: 500, message: "Internal server error." };
  }
};
