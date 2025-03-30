const EmployeeService = require("../services/employee.service");

// Get all employees
exports.getAll = async (req, res) => {
  try {
    const result = await EmployeeService.getEmployees();
    res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ Error in EmployeeController (getAll):", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Create a new employee
exports.create = async (req, res) => {
  try {
    const { id: createdBy } = req.user; // The authenticated user ID

    const result = await EmployeeService.createEmployee(req.body, createdBy);

    res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ Error in EmployeeController (create):", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Update an existing employee
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await EmployeeService.updateEmployee(id, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ Error in EmployeeController (update):", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Delete an employee
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await EmployeeService.deleteEmployee(id);
    res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ Error in EmployeeController (delete):", error);
    res.status(500).json({ message: "Server error." });
  }
};