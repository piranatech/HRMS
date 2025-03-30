const AuthService = require("../services/auth.service");

exports.login = async (req, res) => {
    try {
      console.log("🟢 Incoming login request:", req.body);
  
      const { employe_id, password } = req.body;
  
      if (!employe_id || !password) {
        return res.status(400).json({ message: "Employee ID and password are required." });
      }
  
      const result = await AuthService.login(employe_id, password);
  
      // 🔥 Ensure the token is included in response, even for first login
      if (result.first_login) {
        return res.status(403).json({
          message: "Password change required.",
          first_login: true,
          token: result.token || null // ✅ Now sending the token
        });
      }
  
      console.log("✅ Login successful:", result);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("❌ Error in AuthController (login):", error);
      return res.status(500).json({ message: "Server error." });
    }
  };

exports.register = async (req, res) => {
    try {
        const { cin, nom, prenom, email, tel_mobile, poste, date_entree, role } = req.body;

        if (!cin || !nom || !prenom || !email || !tel_mobile || !poste || !date_entree) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const result = await AuthService.register({ cin, nom, prenom, email, tel_mobile, poste, date_entree, role });

        res.status(result.status).json(result);
    } catch (error) {
        console.error("❌ Error in AuthController (register):", error);
        res.status(500).json({ message: "Server error." });
    }
};

// ✅ Change Password (For Employees)
exports.changePassword = async (req, res) => {
    try {
        console.log("🟢 Incoming password change request:", req.body);
        
        const { employe_id, oldPassword, newPassword } = req.body;

        if (!employe_id || !oldPassword || !newPassword) {
            console.error("❌ Missing required fields:", req.body);
            return res.status(400).json({ message: "Missing required fields." });
        }

        const result = await AuthService.changePassword(employe_id, oldPassword, newPassword);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("❌ Error in AuthController (changePassword):", error);
        return res.status(500).json({ message: "Server error." });
    }
};

// ✅ Reset Password (Admin Only)
exports.resetPassword = async (req, res) => {
  try {
      const admin_id = req.user.id;  // Get admin ID from JWT
      const { employe_id } = req.body;

      if (!employe_id) {
          return res.status(400).json({ message: "Employee ID is required." });
      }

      const result = await AuthService.resetPassword(admin_id, employe_id);
      return res.status(result.status).json(result);
  } catch (error) {
      console.error("❌ Error in AuthController (resetPassword):", error);
      return res.status(500).json({ message: "Server error." });
  }
};
