import { parsePositiveInt } from "../product/product.validation.js";

const STATUS_OPTIONS = new Set(["active", "draft", "archived"]);
const DIFFICULTY_OPTIONS = new Set(["Easy", "Medium", "Advanced"]);

export const validateRecipeStatus = (status) => {
  if (!status) {
    return undefined;
  }

  if (!STATUS_OPTIONS.has(status)) {
    const error = new Error("Invalid recipe status");
    error.statusCode = 400;
    throw error;
  }

  return status;
};

export const slugifyRecipeTitle = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
};

const normalizeRecipePayload = (payload = {}) => ({
  title: payload.title,
  subtitle: payload.subtitle,
  slug: payload.slug,
  prepTime: payload.prepTime,
  cookTime: payload.cookTime,
  difficulty: payload.difficulty,
  servings: payload.servings,
  image: payload.image,
  description: payload.description,
  enuSpicesUsed: payload.enuSpicesUsed,
  ingredientsList: payload.ingredientsList,
  instructions: payload.instructions,
  status: payload.status,
});

export const validateRecipePayload = (payload, { isUpdate = false } = {}) => {
  const normalized = normalizeRecipePayload(payload);
  const errors = [];

  if (!isUpdate || normalized.title !== undefined) {
    if (!normalized.title?.trim()) {
      errors.push("Recipe title is required");
    }
  }

  if (!isUpdate || normalized.description !== undefined) {
    if (!normalized.description?.trim()) {
      errors.push("Recipe description is required");
    }
  }

  if (!isUpdate || normalized.image !== undefined) {
    if (!normalized.image?.trim()) {
      errors.push("Recipe image is required");
    }
  }

  if (normalized.difficulty !== undefined && normalized.difficulty !== null && normalized.difficulty !== "") {
    if (!DIFFICULTY_OPTIONS.has(normalized.difficulty)) {
      errors.push("Difficulty must be Easy, Medium, or Advanced");
    }
  }

  if (normalized.status !== undefined) {
    validateRecipeStatus(normalized.status);
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(", "));
    error.statusCode = 400;
    throw error;
  }

  return {
    ...normalized,
    enuSpicesUsed: normalizeStringArray(normalized.enuSpicesUsed),
    ingredientsList: normalizeStringArray(normalized.ingredientsList),
    instructions: normalizeStringArray(normalized.instructions),
  };
};

export { parsePositiveInt };
