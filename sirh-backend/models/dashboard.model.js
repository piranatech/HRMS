const { pool } = require("../config/db.config");

exports.getDashboardStats = async () => {
  const employeeCount = await pool.query("SELECT COUNT(*) FROM employees");
  const congesCount = await pool.query("SELECT COUNT(*) FROM conges");

  const statutCounts = await pool.query(`
    SELECT statut, COUNT(*) 
    FROM conges 
    GROUP BY statut
  `);

  const statusMap = {
    en_attente: 0,
    approuvé: 0,
    rejeté: 0
  };

  statutCounts.rows.forEach(row => {
    statusMap[row.statut] = parseInt(row.count);
  });

  return {
    total_employees: parseInt(employeeCount.rows[0].count),
    total_conges: parseInt(congesCount.rows[0].count),
    ...statusMap
  };
};
