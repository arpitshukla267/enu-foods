import mongoose from "mongoose";

export const toPaise = (rupees) => Math.round(Number(rupees) * 100);

export const fromPaise = (paise) => paise / 100;

export const normalizeWeight = (weight = "") => weight.trim().toLowerCase();

export const validateObjectId = (value, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};

export const validateAddItemPayload = (payload = {}) => {
  const errors = [];

  if (!payload.productId?.trim()) {
    errors.push("productId is required");
  } else {
    try {
      validateObjectId(payload.productId, "productId");
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (!payload.weight?.trim()) {
    errors.push("weight is required");
  }

  const quantity = Number(payload.quantity ?? 1);
  if (!Number.isInteger(quantity) || quantity < 1) {
    errors.push("quantity must be a positive integer");
  }

  if (errors.length) {
    const error = new Error(errors.join(". "));
    error.statusCode = 400;
    throw error;
  }

  return {
    productId: payload.productId.trim(),
    weight: payload.weight.trim(),
    quantity,
  };
};

export const validateUpdateQuantityPayload = (payload = {}) => {
  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    const error = new Error("quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  return { quantity };
};

export const validateMergeItemsPayload = (payload = {}) => {
  if (!Array.isArray(payload.items)) {
    const error = new Error("items must be an array");
    error.statusCode = 400;
    throw error;
  }

  return payload.items.map((item, index) => {
    try {
      return validateAddItemPayload(item);
    } catch (error) {
      error.message = `Item ${index + 1}: ${error.message}`;
      throw error;
    }
  });
};
