const jwt = require("jsonwebtoken");
const { pool } = require("../config/db.config");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token non fourni" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔍 Decoded JWT:", decoded);

    // Query PostgreSQL using employe_id (which is a string, not an integer)
    const result = await pool.query(
      "SELECT employe_id AS id, email, role FROM employees WHERE employe_id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      console.warn("❌ Utilisateur non trouvé dans la base de données:", decoded.id);
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    req.user = result.rows[0];

    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("❌ Erreur d'authentification:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expiré" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token invalide" });
    }

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (!roles.includes(req.user.role)) {
      console.warn("❌ Accès refusé pour", req.user.id, "- Rôle:", req.user.role);
      return res.status(403).json({ message: "Accès non autorisé pour ce rôle" });
    }

    console.log("✅ Role authorized:", req.user.role);
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
};
