const express = require('express');
const router = express.Router();
const LeaveBalanceController = require('../controllers/leave-balance.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Get employee's leave balance
router.get('/employee/:employeeId', 
    verifyToken, 
    LeaveBalanceController.getEmployeeBalance
);

// Initialize yearly balance (admin only)
router.post('/initialize', 
    verifyToken, 
    checkRole('admin', 'rh'),
    LeaveBalanceController.initializeYearlyBalance
);

// Get leave balance report (managers and HR)
router.get('/report', 
    verifyToken,
    checkRole('admin', 'rh', 'manager'),
    LeaveBalanceController.getLeaveBalanceReport
);

module.exports = router; 