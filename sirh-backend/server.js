// ==========================
// 🔹 IMPORTS
// ==========================   
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");

// ==========================
// 🔹 ROUTES
// ==========================
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const congeRoutes = require("./routes/conge.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const leaveBalanceRoutes = require("./routes/leave-balance.routes");
const { updateLeaveBalance } = require("./utils/updateLeaveBalance");
const companyRoutes = require("./routes/company.routes");
// ==========================
// 🔹 APP
// ==========================
const app = express();
const PORT = process.env.PORT || 3001;

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Graceful shutdown
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    // Graceful shutdown
    process.exit(1);
});

// Configure CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/conges", congeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leave-balance", leaveBalanceRoutes);
app.use("/api/company", companyRoutes);

// Add a health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route non trouvée',
        path: req.path
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Non autorisé'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Erreur de validation',
            details: err.details
        });
    }

    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==========================
// 🔹 CRON JOB    ///Runs on the 1st of each month at 00:00
// ==========================
cron.schedule("0 0 1 * *", async () => {
    console.log("🕓 CRON JOB: Updating leave balances...");
    await updateLeaveBalance();
  });

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} est déjà utilisé`);
    } else {
        console.error('Erreur du serveur:', error);
    }
    process.exit(1);
});

//test cron job
/* async () => {
    await updateLeaveBalance();
  })();
*/
