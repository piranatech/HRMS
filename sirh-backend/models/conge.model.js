const { pool } = require("../config/db.config");

exports.createConge = async (data) => {
  const { employe_id, date_debut, date_fin, commentaire } = data;

  const query = `
    INSERT INTO conges (employe_id, date_debut, date_fin, commentaire)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [employe_id, date_debut, date_fin, commentaire];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Récupérer tous les congés
exports.getAllConges = async () => {
    const query = `
      SELECT c.*, e.nom, e.prenom, e.email
      FROM conges c
      JOIN employees e ON e.id = c.employe_id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  };

  // Mettre à jour le statut d'un congé
  exports.updateStatut = async (id, statut) => {
    const query = `
      UPDATE conges
      SET statut = $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [statut, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  };
  