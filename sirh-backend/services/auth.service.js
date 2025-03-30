const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwt.util");
const EmployeeModel = require("../models/employee.model");


// ==========================
// 🔹 LOGIN
// ==========================
exports.login = async (employe_id, password) => {
    try {
      console.log("🔍 Checking login for:", employe_id);
  
      // Fetch employee by ID
      const user = await EmployeeModel.findByEmployeId(employe_id);
  
      if (!user) {
        console.error("❌ Employee not found:", employe_id);
        return { status: 401, message: "Employee ID incorrect." };
      }
  
      console.log("✅ Employee found:", user.employe_id);
  
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        console.error("❌ Incorrect password for:", employe_id);
        return { status: 401, message: "Incorrect password." };
      }
  
      console.log("✅ Password matched!");
  
      // Generate JWT token
      const token = jwtUtil.generateToken({ id: user.employe_id, role: user.role });
      console.log("🔑 Generated Token:", token); // Log token for debugging
  
      // If first login, return token but force password change
      if (user.first_login) {
        console.warn("⚠ First login detected, forcing password change for:", employe_id);
        return { 
          status: 403, 
          message: "Password change required.", 
          first_login: true, 
          token // ✅ Check if the token appears in the log
        };
      }
  
      console.log("✅ Login successful! Sending token.");
      return {
        status: 200,
        message: "Connexion réussie.",
        token,
        user: {
          id: user.employe_id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("❌ Error in AuthService (login):", error);
      return { status: 500, message: "Server error." };
    }
  };
  

// ==========================
// 🔹 CHANGE PASSWORD
// ==========================
exports.changePassword = async (employe_id, oldPassword, newPassword) => {
  try {
    console.log(`🔍 Checking password change for: ${employe_id}`);

    const user = await EmployeeModel.findByEmployeId(employe_id);
    if (!user) {
      console.error("❌ Employee not found:", employe_id);
      return { status: 404, message: "Employee not found." };
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!passwordMatch) {
      console.error("❌ Incorrect old password for:", employe_id);
      return { status: 401, message: "Incorrect old password." };
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password and mark first login as false
    await EmployeeModel.updatePassword(employe_id, newPasswordHash, false);

    console.log(`✅ Password updated for: ${employe_id}`);

    return { status: 200, message: "Password updated successfully." };
  } catch (error) {
    console.error("❌ Error in AuthService (changePassword):", error);
    return { status: 500, message: "Server error." };
  }
};


// ==========================
// 🔹 RESET PASSWORD (ADMIN ONLY)
// ==========================
exports.resetPassword = async (admin_id, employe_id) => {
  try {
    console.log(`🔧 Admin ${admin_id} is resetting password for: ${employe_id}`);

    // Check if the employee exists
    const employee = await EmployeeModel.findByEmployeId(employe_id);
    if (!employee) {
      console.error("❌ Employee not found:", employe_id);
      return { status: 404, message: "Employee not found." };
    }

    // Reset password to CIN
    const newPasswordHash = await bcrypt.hash(employee.cin, 10);

    // Update password in database
    await EmployeeModel.updatePassword(employe_id, newPasswordHash, true);

    console.log(`✅ Password reset successfully for: ${employe_id}`);

    return { 
      status: 200, 
      message: "Password reset successfully. Employee must change password on next login." 
    };
  } catch (error) {
    console.error("❌ Error in AuthService (resetPassword):", error);
    return { status: 500, message: "Server error." };
  }
};
