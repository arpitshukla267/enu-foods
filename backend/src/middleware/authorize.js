import { findUserById } from "../services/user/user.service.js";

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await findUserById(req.user.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated",
        });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      req.authUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
