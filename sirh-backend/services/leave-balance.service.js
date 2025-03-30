const LeaveBalanceModel = require("../models/leave-balance.model");

class LeaveBalanceService {
    // ✅ Get Employee Leave Balance
    static async getEmployeeBalance(employe_id, year) {
        try {
            const balance = await LeaveBalanceModel.getEmployeeBalance(employe_id, year);
            return { status: 200, data: balance };
        } catch (error) {
            console.error("❌ Error in LeaveBalanceService (getEmployeeBalance):", error);
            return { status: 500, message: "Erreur lors de la récupération du solde de congés." };
        }
    }

    // ✅ Deduct Leave Balance
    static async updateLeaveBalance(employe_id, type_conge_id, year, joursUtilises) {
        try {
            const updatedBalance = await LeaveBalanceModel.updateLeaveBalance(employe_id, type_conge_id, year, joursUtilises);
            if (!updatedBalance) {
                return { status: 400, message: "Solde de congés insuffisant" };
            }
            return { status: 200, data: updatedBalance };
        } catch (error) {
            console.error("❌ Error in LeaveBalanceService (updateLeaveBalance):", error);
            return { status: 500, message: "Erreur lors de la mise à jour du solde de congés." };
        }
    }

    // ✅ Initialize Yearly Leave Balance
    static async initializeYearlyBalance(year) {
        try {
            const message = await LeaveBalanceModel.initializeYearlyBalance(year);
            return { status: 200, message };
        } catch (error) {
            console.error("❌ Error in LeaveBalanceService (initializeYearlyBalance):", error);
            return { status: 500, message: "Erreur lors de l'initialisation du solde de congés." };
        }
    }

    // ✅ Get Leave Balance Report
    static async getLeaveBalanceReport(departement, annee) {
        try {
            const report = await LeaveBalanceModel.getLeaveBalanceReport(departement, annee);
            return { status: 200, data: report };
        } catch (error) {
            console.error("❌ Error in LeaveBalanceService (getLeaveBalanceReport):", error);
            return { status: 500, message: "Erreur lors de la génération du rapport de congés." };
        }
    }
}

module.exports = LeaveBalanceService;
