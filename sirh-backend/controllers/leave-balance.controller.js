const LeaveBalanceService = require("../services/leave-balance.service");

class LeaveBalanceController {
    // ✅ Get Employee Leave Balance
    static async getEmployeeBalance(req, res) {
        try {
            const { employeeId } = req.params; // Employee ID is a STRING (e.g., "A0005")
            const year = parseInt(req.query.year) || new Date().getFullYear();

            if (!employeeId) {
                return res.status(400).json({ message: "Employee ID is required." });
            }

            const result = await LeaveBalanceService.getEmployeeBalance(employeeId, year);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error("❌ Error in LeaveBalanceController (getEmployeeBalance):", error);
            res.status(500).json({ message: "Erreur lors de la récupération du solde de congés." });
        }
    }

    // ✅ Initialize Yearly Leave Balance
    static async initializeYearlyBalance(req, res) {
        try {
            const year = parseInt(req.body.year) || new Date().getFullYear();
            if (!year || year < 2000 || year > 2100) {
                return res.status(400).json({ message: "Invalid year provided." });
            }

            const result = await LeaveBalanceService.initializeYearlyBalance(year);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error("❌ Error in LeaveBalanceController (initializeYearlyBalance):", error);
            res.status(500).json({ message: "Erreur lors de l'initialisation des soldes de congés." });
        }
    }

    // ✅ Get Leave Balance Report
    static async getLeaveBalanceReport(req, res) {
        try {
            const { departement } = req.query;
            const annee = parseInt(req.query.annee) || new Date().getFullYear();

            if (!annee || annee < 2000 || annee > 2100) {
                return res.status(400).json({ message: "Invalid year provided." });
            }

            const result = await LeaveBalanceService.getLeaveBalanceReport(departement, annee);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error("❌ Error in LeaveBalanceController (getLeaveBalanceReport):", error);
            res.status(500).json({ message: "Erreur lors de la génération du rapport des soldes." });
        }
    }
}

module.exports = LeaveBalanceController;