import {
  listUsers,
  getAdminUserById,
  getUserStats,
} from "../user/user.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, sort } = req.query;

    const result = await listUsers({
      page,
      limit,
      search,
      role,
      sort,
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getAdminUserById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersStats = async (req, res, next) => {
  try {
    const stats = await getUserStats();

    return res.status(200).json({
      success: true,
      message: "User statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
