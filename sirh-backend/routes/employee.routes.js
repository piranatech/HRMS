const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employee.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, EmployeeController.getAll);
router.post("/", verifyToken, EmployeeController.create);
router.put("/:id", verifyToken, EmployeeController.update);
router.delete("/:id", verifyToken, EmployeeController.delete);

module.exports = router;
