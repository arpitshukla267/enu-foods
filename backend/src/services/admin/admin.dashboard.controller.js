import { getAdminDashboard, getDashboardSummary } from "./admin.dashboard.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const data = await getAdminDashboard(req.query);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const summary = await getDashboardSummary();

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};
