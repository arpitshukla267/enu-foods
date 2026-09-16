import Coupon from "./coupon.model.js";
import CouponUsage from "./couponUsage.model.js";
import Product from "../product/product.model.js";
import Category from "../category/category.model.js";
import {
  normalizeCouponCode,
  parsePositiveInt,
  validateCouponPayload,
  validateListQuery,
  validateObjectId,
} from "./coupon.validation.js";
import { fromPaise, toPaise } from "../cart/cart.validation.js";

const formatAdminCoupon = (coupon) => ({
  id: coupon._id.toString(),
  code: coupon.code,
  description: coupon.description || "",
  discountType: coupon.discountType,
  discountValue: coupon.discountValue,
  minimumCartValue: coupon.minimumCartValue || 0,
  maximumDiscount: coupon.maximumDiscount || 0,
  startDate: coupon.startDate,
  expiryDate: coupon.expiryDate,
  usageLimit: coupon.usageLimit || 0,
  usedCount: coupon.usedCount || 0,
  perUserLimit: coupon.perUserLimit || 0,
  applicableProducts: (coupon.applicableProducts || []).map((entry) => entry.toString()),
  applicableCategories: (coupon.applicableCategories || []).map((entry) => entry.toString()),
  isActive: Boolean(coupon.isActive),
  createdAt: coupon.createdAt,
  updatedAt: coupon.updatedAt,
});

const buildAdminFilter = (query) => {
  const { search, status } = validateListQuery(query);
  const filter = {};
  const now = new Date();

  if (search) {
    filter.$or = [
      { code: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      { description: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    ];
  }

  if (status === "active") {
    filter.isActive = true;
    filter.startDate = { $lte: now };
    filter.expiryDate = { $gte: now };
  } else if (status === "inactive") {
    filter.isActive = false;
  } else if (status === "expired") {
    filter.expiryDate = { $lt: now };
  } else if (status === "scheduled") {
    filter.startDate = { $gt: now };
  }

  return filter;
};

const assertReferencedIdsExist = async (payload) => {
  if (payload.applicableProducts?.length) {
    const count = await Product.countDocuments({ _id: { $in: payload.applicableProducts } });
    if (count !== payload.applicableProducts.length) {
      const error = new Error("One or more applicable products were not found");
      error.statusCode = 400;
      throw error;
    }
  }

  if (payload.applicableCategories?.length) {
    const count = await Category.countDocuments({ _id: { $in: payload.applicableCategories } });
    if (count !== payload.applicableCategories.length) {
      const error = new Error("One or more applicable categories were not found");
      error.statusCode = 400;
      throw error;
    }
  }
};

export const listAdminCoupons = async (query = {}) => {
  const { page, limit } = validateListQuery(query);
  const skip = (page - 1) * limit;
  const filter = buildAdminFilter(query);

  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(filter),
  ]);

  return {
    coupons: coupons.map(formatAdminCoupon),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getAdminCouponById = async (couponId) => {
  validateObjectId(couponId, "coupon id");
  const coupon = await Coupon.findById(couponId).lean();

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return formatAdminCoupon(coupon);
};

export const createCoupon = async (payload) => {
  const parsed = validateCouponPayload(payload);
  await assertReferencedIdsExist(parsed);

  const existing = await Coupon.findOne({ code: parsed.code }).lean();
  if (existing) {
    const error = new Error("Coupon code already exists");
    error.statusCode = 409;
    throw error;
  }

  const coupon = await Coupon.create({
    ...parsed,
    description: parsed.description || "",
    minimumCartValue: parsed.minimumCartValue ?? 0,
    maximumDiscount: parsed.maximumDiscount ?? 0,
    usageLimit: parsed.usageLimit ?? 0,
    perUserLimit: parsed.perUserLimit ?? 0,
    applicableProducts: parsed.applicableProducts || [],
    applicableCategories: parsed.applicableCategories || [],
    isActive: parsed.isActive ?? true,
  });

  return formatAdminCoupon(coupon.toObject());
};

export const updateCoupon = async (couponId, payload) => {
  validateObjectId(couponId, "coupon id");

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  const parsed = validateCouponPayload(
    { ...payload, existingDiscountType: coupon.discountType },
    { isUpdate: true },
  );

  if (!Object.keys(parsed).length) {
    const error = new Error("No valid fields provided for update");
    error.statusCode = 400;
    throw error;
  }

  await assertReferencedIdsExist(parsed);

  if (parsed.code && parsed.code !== coupon.code) {
    const duplicate = await Coupon.findOne({ code: parsed.code, _id: { $ne: coupon._id } }).lean();
    if (duplicate) {
      const error = new Error("Coupon code already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  Object.assign(coupon, parsed);
  await coupon.save();

  return formatAdminCoupon(coupon.toObject());
};

export const updateCouponStatus = async (couponId, isActive) => {
  validateObjectId(couponId, "coupon id");

  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { isActive },
    { new: true, runValidators: true },
  ).lean();

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return formatAdminCoupon(coupon);
};

export const deleteCoupon = async (couponId) => {
  validateObjectId(couponId, "coupon id");

  const coupon = await Coupon.findByIdAndDelete(couponId).lean();
  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  await CouponUsage.deleteMany({ coupon: coupon._id });

  return { id: coupon._id.toString() };
};

export const getUserCouponUsageCount = async (couponId, userId) => {
  const usage = await CouponUsage.findOne({ coupon: couponId, user: userId }).lean();
  return usage?.usageCount || 0;
};

const isItemEligibleForCoupon = (item, coupon, productMap) => {
  if (!item.isAvailable) {
    return false;
  }

  const product = productMap[item.productId];
  const productId = item.productId;
  const categoryId = product?.category?.toString();

  const hasProductRestrictions = (coupon.applicableProducts || []).length > 0;
  const hasCategoryRestrictions = (coupon.applicableCategories || []).length > 0;

  if (!hasProductRestrictions && !hasCategoryRestrictions) {
    return true;
  }

  const productMatch =
    !hasProductRestrictions ||
    coupon.applicableProducts.some((entry) => entry.toString() === productId);

  const categoryMatch =
    !hasCategoryRestrictions ||
    (categoryId &&
      coupon.applicableCategories.some((entry) => entry.toString() === categoryId));

  return productMatch && categoryMatch;
};

const getEligibleSubtotalPaise = (formattedItems, coupon, productMap) =>
  formattedItems.reduce((total, item) => {
    if (!isItemEligibleForCoupon(item, coupon, productMap)) {
      return total;
    }
    return total + item.subtotalPaise;
  }, 0);

export const calculateCouponDiscountPaise = (coupon, eligibleSubtotalPaise) => {
  if (eligibleSubtotalPaise <= 0) {
    return 0;
  }

  let discountPaise = 0;

  if (coupon.discountType === "percentage") {
    discountPaise = Math.round((eligibleSubtotalPaise * coupon.discountValue) / 100);
    const maxDiscountPaise =
      coupon.maximumDiscount > 0 ? toPaise(coupon.maximumDiscount) : null;
    if (maxDiscountPaise !== null) {
      discountPaise = Math.min(discountPaise, maxDiscountPaise);
    }
  } else {
    discountPaise = toPaise(coupon.discountValue);
  }

  return Math.min(discountPaise, eligibleSubtotalPaise);
};

export const validateCouponForCart = async ({
  coupon,
  userId,
  formattedItems,
  productMap,
}) => {
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  const now = new Date();

  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is inactive" };
  }

  const startDate = new Date(coupon.startDate);
  startDate.setHours(0, 0, 0, 0);

  if (now < startDate) {
    return { valid: false, message: "This coupon is not active yet" };
  }

  const expiryDate = new Date(coupon.expiryDate);
  expiryDate.setHours(23, 59, 59, 999);

  if (now > expiryDate) {
    return { valid: false, message: "This coupon has expired" };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit" };
  }

  if (coupon.perUserLimit > 0) {
    const userUsageCount = await getUserCouponUsageCount(coupon._id, userId);
    if (userUsageCount >= coupon.perUserLimit) {
      return { valid: false, message: "You have already used this coupon" };
    }
  }

  const eligibleSubtotalPaise = getEligibleSubtotalPaise(formattedItems, coupon, productMap);
  const minimumCartValuePaise = toPaise(coupon.minimumCartValue || 0);

  if (eligibleSubtotalPaise < minimumCartValuePaise) {
    return {
      valid: false,
      message: `Minimum cart value of ₹${coupon.minimumCartValue || 0} required for this coupon`,
    };
  }

  const discountPaise = calculateCouponDiscountPaise(coupon, eligibleSubtotalPaise);

  if (discountPaise <= 0) {
    return { valid: false, message: "This coupon does not apply to your cart items" };
  }

  return {
    valid: true,
    discountPaise,
    eligibleSubtotalPaise,
  };
};

export const resolveCartCoupon = async ({
  appliedCouponCode,
  userId,
  formattedItems,
  productMap,
  cartSubtotalPaise,
}) => {
  const code = normalizeCouponCode(appliedCouponCode || "");

  if (!code) {
    return {
      coupon: null,
      discount: 0,
      discountPaise: 0,
      total: fromPaise(cartSubtotalPaise),
      totalPaise: cartSubtotalPaise,
      shouldClearCoupon: false,
    };
  }

  const coupon = await Coupon.findOne({ code }).lean();
  const validation = await validateCouponForCart({
    coupon,
    userId,
    formattedItems,
    productMap,
  });

  if (!validation.valid) {
    return {
      coupon: null,
      discount: 0,
      discountPaise: 0,
      total: fromPaise(cartSubtotalPaise),
      totalPaise: cartSubtotalPaise,
      shouldClearCoupon: true,
      invalidMessage: validation.message,
    };
  }

  const discountPaise = validation.discountPaise;
  const totalPaise = Math.max(0, cartSubtotalPaise - discountPaise);

  return {
    coupon: {
      code: coupon.code,
      discount: fromPaise(discountPaise),
    },
    discount: fromPaise(discountPaise),
    discountPaise,
    total: fromPaise(totalPaise),
    totalPaise,
    shouldClearCoupon: false,
  };
};

export const findCouponByCode = async (code) => {
  const normalizedCode = normalizeCouponCode(code);
  if (!normalizedCode) {
    return null;
  }

  return Coupon.findOne({ code: normalizedCode }).lean();
};

export const applyCouponCodeToCartDocument = async ({
  cart,
  userId,
  code,
  formattedItems,
  productMap,
  cartSubtotalPaise,
}) => {
  const normalizedCode = normalizeCouponCode(code);
  const coupon = await findCouponByCode(normalizedCode);

  if (!coupon) {
    const error = new Error("Invalid coupon code");
    error.statusCode = 404;
    throw error;
  }

  const validation = await validateCouponForCart({
    coupon,
    userId,
    formattedItems,
    productMap,
  });

  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  cart.appliedCouponCode = normalizedCode;
  await cart.save();

  const discountPaise = validation.discountPaise;
  const totalPaise = Math.max(0, cartSubtotalPaise - discountPaise);

  return {
    coupon: {
      code: coupon.code,
      discount: fromPaise(discountPaise),
    },
    discount: fromPaise(discountPaise),
    discountPaise,
    total: fromPaise(totalPaise),
    totalPaise,
    shouldClearCoupon: false,
  };
};

export const removeCouponFromCartDocument = async (cart) => {
  cart.appliedCouponCode = "";
  await cart.save();
};

export const recordCouponUsage = async (couponId, userId, incrementBy = 1, session = null) => {
  validateObjectId(couponId, "coupon id");
  validateObjectId(userId, "user id");

  await CouponUsage.findOneAndUpdate(
    { coupon: couponId, user: userId },
    { $inc: { usageCount: incrementBy } },
    { upsert: true, new: true, setDefaultsOnInsert: true, session },
  );

  await Coupon.findByIdAndUpdate(
    couponId,
    { $inc: { usedCount: incrementBy } },
    { session },
  );
};
