const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, DashboardController.getStats);

module.exports = router;
