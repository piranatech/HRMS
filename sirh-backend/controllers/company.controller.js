const CompanyModel = require("../models/company.model");

exports.updateLeaveDays = async (req, res) => {
  try {
    const { company_id, leave_days_per_month } = req.body;

    if (!company_id || !leave_days_per_month) {
      return res.status(400).json({ message: "Company ID and leave days per month are required." });
    }

    await CompanyModel.updateLeaveDays(company_id, leave_days_per_month);

    res.status(200).json({ message: "Leave days per month updated successfully." });
  } catch (error) {
    console.error("❌ Error in CompanyController (updateLeaveDays):", error);
    res.status(500).json({ message: "Server error." });
  }
};
