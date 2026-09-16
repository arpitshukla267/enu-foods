import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./user.model.js";

export const formatAdminUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.isActive ? "active" : "inactive",
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseSortOption = (sort) => {
  switch (sort) {
    case "name-asc":
      return { name: 1 };
    case "name-desc":
      return { name: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

export const findUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (includePassword) {
    query.select("+password");
  }

  return query;
};

export const findUserById = async (userId) => {
  return User.findById(userId).select("-password");
};

export const createUser = async ({ name, email, phone, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

export const listUsers = async ({
  page = 1,
  limit = 20,
  search = "",
  role = "",
  sort = "newest",
}) => {
  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (role && ["customer", "admin"].includes(role)) {
    filter.role = role;
  }

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  const sortOption = parseSortOption(sort);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users: users.map(formatAdminUser),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    },
  };
};

export const getAdminUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return formatAdminUser(user);
};

export const getUserStats = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, newUsers] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "customer", isActive: true }),
    User.countDocuments({
      role: "customer",
      createdAt: { $gte: thirtyDaysAgo },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    newUsers,
  };
};
