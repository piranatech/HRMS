const express = require("express");
const router = express.Router();
const CongeController = require("../controllers/conge.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, CongeController.create);
router.get("/", verifyToken, CongeController.getAll);
router.put("/:id", verifyToken, CongeController.updateStatut);

module.exports = router;
