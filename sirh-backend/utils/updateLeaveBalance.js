const { pool } = require("../config/db.config");

const updateLeaveBalance = async () => {
  try {
    console.log("🔄 Running monthly leave balance update...");

    const query = `
      UPDATE employees
      SET solde_congé = solde_congé + COALESCE(
        custom_leave_increment,
        (SELECT leave_days_per_month FROM companies WHERE companies.id = employees.company_id),
        1.5
      ),
      date_modification = CURRENT_TIMESTAMP
    `;

    await pool.query(query);
    console.log("✅ Leave balances updated successfully!");
  } catch (error) {
    console.error("❌ Error updating leave balances:", error);
  }
};

module.exports = { updateLeaveBalance };
