const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company.controller");
const auth = require("../middlewares/auth.middleware");

// 🔍 DEBUG: Check if CompanyController is loaded
console.log("🔍 CompanyController Loaded:", CompanyController);

// Try to access the function directly
console.log("🔍 updateLeaveDays exists?:", typeof CompanyController.updateLeaveDays);

// Add route
router.put("/update-leave-days", auth.verifyToken, auth.checkRole("admin"), CompanyController.updateLeaveDays);


module.exports = router;
