const CongeService = require("../services/conge.service");
// Créer un nouveau congé
exports.create = async (req, res) => {
  try {
    const result = await CongeService.createConge(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in CongeController (create):", error);
    res.status(500).json({ message: "Server error." });
  }
};
// Récupérer tous les congés
exports.getAll = async (req, res) => {
    try {
      const result = await CongeService.getAllConges();
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error in CongeController (getAll):", error);
      res.status(500).json({ message: "Server error." });
    }
  };
// Mettre à jour le statut d'un congé
exports.updateStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
  
      const result = await CongeService.updateStatut(id, statut);
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error in CongeController (updateStatut):", error);
      res.status(500).json({ message: "Server error." });
    }
  };
