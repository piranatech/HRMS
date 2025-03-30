const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware"); // Import token verification middleware

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.put("/change-password", verifyToken, AuthController.changePassword);
router.post("/reset-password", verifyToken, AuthController.resetPassword);

module.exports = router;
