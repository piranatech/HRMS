const { pool } = require("../config/db.config");

exports.updateLeaveDays = async (company_id, leave_days_per_month) => {
  const query = `
    UPDATE companies
    SET leave_days_per_month = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  await pool.query(query, [leave_days_per_month, company_id]);
};
