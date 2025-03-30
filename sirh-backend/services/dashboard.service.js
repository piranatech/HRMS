const DashboardModel = require("../models/dashboard.model");

exports.getStats = async () => {
  const stats = await DashboardModel.getDashboardStats();
  return {
    status: 200,
    message: "Dashboard stats fetched successfully.",
    data: stats
  };
};
