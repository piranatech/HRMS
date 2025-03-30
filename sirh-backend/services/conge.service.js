const CongeModel = require("../models/conge.model");
// Créer un nouveau congé
exports.createConge = async (data) => {
  const conge = await CongeModel.createConge(data);
  return {
    status: 201,
    message: "Leave request submitted successfully.",
    data: conge
  };
};
// Récupérer tous les congés
exports.getAllConges = async () => {
    const conges = await CongeModel.getAllConges();
    return {
      status: 200,
      message: "Leave requests fetched successfully.",
      data: conges
    };
  };
// Mettre à jour le statut d'un congé
  exports.updateStatut = async (id, statut) => {
    const allowed = ["approuvé", "rejeté"];
    if (!allowed.includes(statut)) {
      return { status: 400, message: "Invalid status value." };
    }
  
    const updated = await CongeModel.updateStatut(id, statut);
    if (!updated) {
      return { status: 404, message: "Leave request not found." };
    }
  
    return {
      status: 200,
      message: `Leave request ${statut}.`,
      data: updated
    };
  };
  
  