import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import User from "../user/user.model.js";
import Category from "../category/category.model.js";
import Coupon from "../coupon/coupon.model.js";
import { fromPaise } from "../../lib/money.js";
import { formatOrderForAdmin } from "../order/order.service.js";

const LOW_STOCK_THRESHOLD = 15;
const CATEGORY_COLORS = ["#173D2A", "#245A3F", "#D99B26", "#E2B04A", "#4A7C59", "#3E805E", "#8CB89C"];

const ORDER_STATUS_COLORS = {
  delivered: "#173D2A",
  shipped: "#245A3F",
  processing: "#D99B26",
  confirmed: "#4A7C59",
  pending_payment: "#E2B04A",
  cancelled: "#9E382B",
  payment_failed: "#9E382B",
};

const PAYMENT_STATUS_COLORS = {
  paid: "#173D2A",
  pending: "#D99B26",
  failed: "#9E382B",
  refunded: "#882B20",
};

const parseDateRange = (range = "30d") => {
  const allowed = ["7d", "30d", "3m", "12m"];
  const normalized = allowed.includes(range) ? range : "30d";
  const now = new Date();
  const start = new Date(now);

  if (normalized === "7d") {
    start.setDate(start.getDate() - 6);
  } else if (normalized === "30d") {
    start.setDate(start.getDate() - 29);
  } else if (normalized === "3m") {
    start.setDate(start.getDate() - 89);
  } else {
    start.setFullYear(start.getFullYear() - 1);
  }

  start.setHours(0, 0, 0, 0);
  return { range: normalized, start, end: now };
};

const getPreviousPeriodStart = (start, range) => {
  const previous = new Date(start);
  if (range === "7d") {
    previous.setDate(previous.getDate() - 7);
  } else if (range === "30d") {
    previous.setDate(previous.getDate() - 30);
  } else if (range === "3m") {
    previous.setDate(previous.getDate() - 90);
  } else {
    previous.setFullYear(previous.getFullYear() - 1);
  }
  return previous;
};

const formatChartLabel = (dateValue, range) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);

  if (range === "12m") {
    return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  }

  if (range === "3m") {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const getRevenueDateFormat = (range) => {
  if (range === "12m") return "%Y-%m";
  return "%Y-%m-%d";
};

const mapOrderStatusLabel = (status) => {
  if (status === "pending_payment") return "Pending Payment";
  if (status === "payment_failed") return "Payment Failed";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const mapPaymentStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

export const getDashboardSummary = async () => {
  const [
    pendingOrders,
    lowStock,
    totalOrders,
    paidRevenueAgg,
    productCount,
    customerCount,
  ] = await Promise.all([
    Order.countDocuments({
      orderStatus: {
        $in: ["pending_payment", "confirmed", "processing"],
      },
    }),
    Product.countDocuments({
      isActive: true,
      status: "active",
      weightVariants: { $elemMatch: { stock: { $lte: LOW_STOCK_THRESHOLD } } },
    }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalPaise: { $sum: "$totalPaise" } } },
    ]),
    Product.countDocuments({ isActive: true, status: "active" }),
    User.countDocuments({ role: "customer" }),
  ]);

  return {
    pendingOrders,
    lowStock,
    totalOrders,
    totalSales: fromPaise(paidRevenueAgg[0]?.totalPaise || 0),
    products: productCount,
    customers: customerCount,
  };
};

export const getAdminDashboard = async (query = {}) => {
  const { range, start, end } = parseDateRange(query.range);
  const previousStart = getPreviousPeriodStart(start, range);
  const dateFormat = getRevenueDateFormat(range);

  const [
    summaryCounts,
    periodRevenueAgg,
    previousRevenueAgg,
    periodOrdersCount,
    previousOrdersCount,
    revenueByDateRaw,
    orderStatusRaw,
    paymentStatusRaw,
    categoryRevenueRaw,
    recentOrdersRaw,
    topBuyersRaw,
    newUsersPeriod,
    newUsersPrevious,
    couponCount,
    categoryCount,
  ] = await Promise.all([
    Promise.all([
      Order.countDocuments(),
      Order.countDocuments({
        orderStatus: {
          $in: ["pending_payment", "confirmed", "processing"],
        },
      }),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true, status: "active" }),
      Product.countDocuments({
        isActive: true,
        status: "active",
        weightVariants: { $elemMatch: { stock: { $lte: LOW_STOCK_THRESHOLD } } },
      }),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalPaise: { $sum: "$totalPaise" }, count: { $sum: 1 } } },
      ]),
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "paid",
        },
      },
      { $group: { _id: null, totalPaise: { $sum: "$totalPaise" } } },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStart, $lt: start },
          paymentStatus: "paid",
        },
      },
      { $group: { _id: null, totalPaise: { $sum: "$totalPaise" } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Order.countDocuments({ createdAt: { $gte: previousStart, $lt: start } }),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt", timezone: "Asia/Kolkata" },
          },
          revenuePaise: { $sum: "$totalPaise" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$orderStatus", value: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$paymentStatus", value: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "paid",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          revenuePaise: { $sum: "$items.subtotalPaise" },
          quantity: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          revenuePaise: { $sum: "$revenuePaise" },
          orders: { $sum: "$quantity" },
        },
      },
      { $sort: { revenuePaise: -1 } },
      { $limit: 6 },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .lean(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: "$user",
          totalSpentPaise: { $sum: "$totalPaise" },
          totalOrders: { $sum: 1 },
          lastOrderAt: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpentPaise: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]),
    User.countDocuments({
      role: "customer",
      createdAt: { $gte: start, $lte: end },
    }),
    User.countDocuments({
      role: "customer",
      createdAt: { $gte: previousStart, $lt: start },
    }),
    Coupon.countDocuments({ isActive: true }),
    Category.countDocuments({ status: "active" }),
  ]);

  const [
    totalOrders,
    pendingOrdersCount,
    totalProducts,
    activeProducts,
    lowStockCount,
    totalUsers,
    completedOrdersCount,
    paidAllTimeAgg,
  ] = summaryCounts;

  const totalRevenuePaise = paidAllTimeAgg[0]?.totalPaise || 0;
  const paidOrderCount = paidAllTimeAgg[0]?.count || 0;
  const periodRevenuePaise = periodRevenueAgg[0]?.totalPaise || 0;
  const previousRevenuePaise = previousRevenueAgg[0]?.totalPaise || 0;

  const usersGrowth =
    newUsersPrevious > 0
      ? Math.round(((newUsersPeriod - newUsersPrevious) / newUsersPrevious) * 100)
      : newUsersPeriod > 0
        ? 100
        : 0;

  const revenueGrowth =
    previousRevenuePaise > 0
      ? Math.round(((periodRevenuePaise - previousRevenuePaise) / previousRevenuePaise) * 100)
      : periodRevenuePaise > 0
        ? 100
        : 0;

  const ordersGrowth =
    previousOrdersCount > 0
      ? Math.round(((periodOrdersCount - previousOrdersCount) / previousOrdersCount) * 100)
      : periodOrdersCount > 0
        ? 100
        : 0;

  let runningTotal = 0;
  const revenueByDate = revenueByDateRaw.map((entry) => {
    const revenue = fromPaise(entry.revenuePaise);
    runningTotal += revenue;
    return {
      date: formatChartLabel(entry._id, range),
      revenue,
      orders: entry.orders,
      cumulative: runningTotal,
    };
  });

  const categoryRevenue = categoryRevenueRaw.map((entry, index) => ({
    name: entry.name || "Uncategorized",
    revenue: fromPaise(entry.revenuePaise),
    orders: entry.orders,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const orderStatusDistribution = orderStatusRaw
    .filter((entry) => entry.value > 0)
    .map((entry) => ({
      name: mapOrderStatusLabel(entry._id),
      value: entry.value,
      color: ORDER_STATUS_COLORS[entry._id] || "#736854",
    }));

  const paymentDistribution = paymentStatusRaw
    .filter((entry) => entry.value > 0)
    .map((entry) => ({
      name: mapPaymentStatusLabel(entry._id),
      value: entry.value,
      color: PAYMENT_STATUS_COLORS[entry._id] || "#736854",
    }));

  const recentUserIds = [...new Set(recentOrdersRaw.map((order) => order.user.toString()))];
  const recentUsers = await User.find({ _id: { $in: recentUserIds } })
    .select("name email phone")
    .lean();
  const recentUserMap = Object.fromEntries(recentUsers.map((user) => [user._id.toString(), user]));

  const recentOrders = recentOrdersRaw.map((order) =>
    formatOrderForAdmin(order, recentUserMap[order.user.toString()]),
  );

  const topBuyers = topBuyersRaw
    .filter((entry) => entry.user)
    .map((entry) => ({
      id: entry.user._id.toString(),
      name: entry.user.name,
      email: entry.user.email,
      phone: entry.user.phone || "",
      status: entry.user.isActive ? "active" : "inactive",
      joinedDate: entry.user.createdAt,
      lastOrderDate: entry.lastOrderAt,
      totalOrders: entry.totalOrders,
      totalSpent: fromPaise(entry.totalSpentPaise),
      averageOrderValue:
        entry.totalOrders > 0 ? Math.round(fromPaise(entry.totalSpentPaise) / entry.totalOrders) : 0,
      addresses: [],
      activityHistory: [],
    }));

  const stats = {
    totalRevenue: fromPaise(totalRevenuePaise),
    revenueGrowth,
    totalOrders,
    ordersGrowth,
    totalProducts,
    activeProducts,
    totalUsers,
    usersGrowth,
    pendingOrdersCount,
    completedOrdersCount,
    averageOrderValue:
      paidOrderCount > 0 ? Math.round(fromPaise(totalRevenuePaise) / paidOrderCount) : 0,
    lowStockCount,
    revenueByDate,
    categoryRevenue,
    orderStatusDistribution,
    paymentDistribution,
  };

  return {
    summary: {
      totalSales: fromPaise(totalRevenuePaise),
      periodSales: fromPaise(periodRevenuePaise),
      totalOrders,
      pendingOrders: pendingOrdersCount,
      products: totalProducts,
      activeProducts,
      lowStock: lowStockCount,
      customers: totalUsers,
      activeCoupons: couponCount,
      categories: categoryCount,
      deliveredOrders: completedOrdersCount,
    },
    stats,
    recentOrders,
    topBuyers,
  };
};
