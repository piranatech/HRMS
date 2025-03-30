const DashboardService = require("../services/dashboard.service");

exports.getStats = async (req, res) => {
  try {
    const result = await DashboardService.getStats();
    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in DashboardController (getStats):", error);
    res.status(500).json({ message: "Server error." });
  }
};
