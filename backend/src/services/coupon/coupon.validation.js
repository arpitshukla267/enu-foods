import mongoose from "mongoose";

export const normalizeCouponCode = (code = "") => code.trim().toUpperCase();

export const validateObjectId = (value, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};

export const parsePositiveInt = (value, fallback, max) => {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return max ? Math.min(parsed, max) : parsed;
};

export const parseNonNegativeNumber = (value, label) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    const error = new Error(`${label} must be a non-negative number`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

export const parseOptionalNonNegativeNumber = (value, label) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return parseNonNegativeNumber(value, label);
};

export const parseDateValue = (value, label) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error(`${label} must be a valid date`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

export const parseObjectIdArray = (values = [], label = "IDs") => {
  if (values === undefined || values === null) {
    return [];
  }

  if (!Array.isArray(values)) {
    const error = new Error(`${label} must be an array`);
    error.statusCode = 400;
    throw error;
  }

  const uniqueValues = [...new Set(values.map((entry) => String(entry).trim()).filter(Boolean))];

  uniqueValues.forEach((entry) => {
    validateObjectId(entry, label);
  });

  return uniqueValues;
};

export const validateListQuery = (query = {}) => {
  const page = parsePositiveInt(query.page, 1, 100000);
  const limit = parsePositiveInt(query.limit, 20, 100);
  const search = String(query.search || "").trim();
  const status = String(query.status || "all").trim().toLowerCase();

  if (!["all", "active", "inactive", "expired", "scheduled"].includes(status)) {
    const error = new Error("Invalid status filter");
    error.statusCode = 400;
    throw error;
  }

  return { page, limit, search, status };
};

export const validateCouponPayload = (payload = {}, { isUpdate = false } = {}) => {
  const errors = [];

  const code = payload.code !== undefined ? normalizeCouponCode(payload.code) : undefined;
  if (!isUpdate && !code) {
    errors.push("code is required");
  } else if (code !== undefined && code.length < 2) {
    errors.push("code must be at least 2 characters");
  }

  const discountType = payload.discountType;
  if (!isUpdate && !discountType) {
    errors.push("discountType is required");
  } else if (discountType !== undefined && !["percentage", "fixed"].includes(discountType)) {
    errors.push("discountType must be percentage or fixed");
  }

  let discountValue;
  if (payload.discountValue !== undefined) {
    try {
      discountValue = parseNonNegativeNumber(payload.discountValue, "discountValue");
      const resolvedType = discountType || payload.existingDiscountType;
      if (resolvedType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
        errors.push("percentage discountValue must be between 1 and 100");
      }
      if (resolvedType === "fixed" && discountValue <= 0) {
        errors.push("fixed discountValue must be greater than 0");
      }
    } catch (error) {
      errors.push(error.message);
    }
  } else if (!isUpdate) {
    errors.push("discountValue is required");
  }

  let minimumCartValue;
  if (payload.minimumCartValue !== undefined) {
    try {
      minimumCartValue = parseNonNegativeNumber(payload.minimumCartValue, "minimumCartValue");
    } catch (error) {
      errors.push(error.message);
    }
  }

  let maximumDiscount;
  if (payload.maximumDiscount !== undefined) {
    try {
      maximumDiscount = parseNonNegativeNumber(payload.maximumDiscount, "maximumDiscount");
    } catch (error) {
      errors.push(error.message);
    }
  }

  let startDate;
  if (payload.startDate !== undefined) {
    try {
      startDate = parseDateValue(payload.startDate, "startDate");
    } catch (error) {
      errors.push(error.message);
    }
  } else if (!isUpdate) {
    errors.push("startDate is required");
  }

  let expiryDate;
  if (payload.expiryDate !== undefined) {
    try {
      expiryDate = parseDateValue(payload.expiryDate, "expiryDate");
    } catch (error) {
      errors.push(error.message);
    }
  } else if (!isUpdate) {
    errors.push("expiryDate is required");
  }

  if (startDate && expiryDate && startDate > expiryDate) {
    errors.push("startDate must be before expiryDate");
  }

  let usageLimit;
  if (payload.usageLimit !== undefined) {
    try {
      usageLimit = parseNonNegativeNumber(payload.usageLimit, "usageLimit");
    } catch (error) {
      errors.push(error.message);
    }
  }

  let perUserLimit;
  if (payload.perUserLimit !== undefined) {
    try {
      perUserLimit = parseNonNegativeNumber(payload.perUserLimit, "perUserLimit");
    } catch (error) {
      errors.push(error.message);
    }
  }

  let applicableProducts;
  if (payload.applicableProducts !== undefined) {
    try {
      applicableProducts = parseObjectIdArray(payload.applicableProducts, "applicableProducts");
    } catch (error) {
      errors.push(error.message);
    }
  }

  let applicableCategories;
  if (payload.applicableCategories !== undefined) {
    try {
      applicableCategories = parseObjectIdArray(
        payload.applicableCategories,
        "applicableCategories",
      );
    } catch (error) {
      errors.push(error.message);
    }
  }

  let isActive;
  if (payload.isActive !== undefined) {
    isActive = Boolean(payload.isActive);
  }

  if (errors.length) {
    const error = new Error(errors.join(". "));
    error.statusCode = 400;
    throw error;
  }

  const result = {};
  if (code !== undefined) result.code = code;
  if (payload.description !== undefined) result.description = String(payload.description || "").trim();
  if (discountType !== undefined) result.discountType = discountType;
  if (discountValue !== undefined) result.discountValue = discountValue;
  if (minimumCartValue !== undefined) result.minimumCartValue = minimumCartValue;
  if (maximumDiscount !== undefined) result.maximumDiscount = maximumDiscount;
  if (startDate !== undefined) result.startDate = startDate;
  if (expiryDate !== undefined) result.expiryDate = expiryDate;
  if (usageLimit !== undefined) result.usageLimit = usageLimit;
  if (perUserLimit !== undefined) result.perUserLimit = perUserLimit;
  if (applicableProducts !== undefined) result.applicableProducts = applicableProducts;
  if (applicableCategories !== undefined) result.applicableCategories = applicableCategories;
  if (isActive !== undefined) result.isActive = isActive;

  return result;
};

export const validateApplyCouponPayload = (payload = {}) => {
  const code = normalizeCouponCode(payload.code);
  if (!code) {
    const error = new Error("Coupon code is required");
    error.statusCode = 400;
    throw error;
  }

  return { code };
};

export const validateStatusPayload = (payload = {}) => {
  if (typeof payload.isActive !== "boolean") {
    const error = new Error("isActive must be a boolean");
    error.statusCode = 400;
    throw error;
  }

  return { isActive: payload.isActive };
};
