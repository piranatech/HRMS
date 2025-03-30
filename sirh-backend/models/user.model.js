const { pool } = require("../config/db.config");

exports.findByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.createUser = async (email, passwordHash, role = 'rh') => {
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role
    `;
    const values = [email, passwordHash, role];
    const result = await pool.query(query, values);
    return result.rows[0];
};
