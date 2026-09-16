import mongoose from "mongoose";
import Recipe from "./recipe.model.js";
import {
  parsePositiveInt,
  slugifyRecipeTitle,
  validateRecipePayload,
  validateRecipeStatus,
} from "./recipe.validation.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatRecipe = (recipe) => ({
  id: recipe._id.toString(),
  title: recipe.title,
  subtitle: recipe.subtitle || "",
  slug: recipe.slug,
  prepTime: recipe.prepTime || "",
  cookTime: recipe.cookTime || "",
  difficulty: recipe.difficulty || "Easy",
  servings: recipe.servings || "",
  image: recipe.image,
  description: recipe.description,
  enuSpicesUsed: recipe.enuSpicesUsed || [],
  ingredientsList: recipe.ingredientsList || [],
  instructions: recipe.instructions || [],
  status: recipe.status,
  createdAt: recipe.createdAt,
  updatedAt: recipe.updatedAt,
});

export const formatAdminRecipe = formatRecipe;
export const formatPublicRecipe = formatRecipe;

const buildRecipeFilter = ({ search = "", status = "all" } = {}) => {
  const filter = {};
  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    filter.$or = [
      { title: searchRegex },
      { subtitle: searchRegex },
      { description: searchRegex },
      { enuSpicesUsed: searchRegex },
    ];
  }

  if (status && status !== "all") {
    filter.status = validateRecipeStatus(status);
  }

  return filter;
};

const buildUniqueSlug = async (title, slug, excludeId) => {
  const baseSlug = (slug?.trim() || slugifyRecipeTitle(title)).toLowerCase();

  if (!baseSlug) {
    const error = new Error("Unable to generate recipe slug");
    error.statusCode = 400;
    throw error;
  }

  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const filter = { slug: candidate };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await Recipe.findOne(filter).select("_id").lean();
    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const buildRecipeDocument = async (payload, { excludeId } = {}) => {
  const normalized = validateRecipePayload(payload, { isUpdate: Boolean(excludeId) });
  const slug = await buildUniqueSlug(normalized.title, normalized.slug, excludeId);
  const status = normalized.status || "active";

  return {
    title: normalized.title.trim(),
    subtitle: normalized.subtitle?.trim() || "",
    slug,
    prepTime: normalized.prepTime?.trim() || "",
    cookTime: normalized.cookTime?.trim() || "",
    difficulty: normalized.difficulty || "Easy",
    servings: normalized.servings?.trim() || "",
    image: normalized.image.trim(),
    description: normalized.description.trim(),
    enuSpicesUsed: normalized.enuSpicesUsed,
    ingredientsList: normalized.ingredientsList,
    instructions: normalized.instructions,
    status,
    isActive: status === "active",
  };
};

export const listAdminRecipes = async (query = {}) => {
  const page = parsePositiveInt(query.page, 1, 1000);
  const limit = parsePositiveInt(query.limit, 50, 100);
  const skip = (page - 1) * limit;
  const filter = buildRecipeFilter(query);

  const [recipes, total] = await Promise.all([
    Recipe.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    Recipe.countDocuments(filter),
  ]);

  return {
    recipes: recipes.map(formatAdminRecipe),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getAdminRecipeById = async (recipeId) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new Error("Invalid recipe ID");
    error.statusCode = 400;
    throw error;
  }

  const recipe = await Recipe.findById(recipeId).lean();
  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return formatAdminRecipe(recipe);
};

export const createRecipe = async (payload) => {
  const recipeData = await buildRecipeDocument(payload);
  const recipe = await Recipe.create(recipeData);
  return formatAdminRecipe(recipe.toObject());
};

export const updateRecipe = async (recipeId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new Error("Invalid recipe ID");
    error.statusCode = 400;
    throw error;
  }

  const existing = await Recipe.findById(recipeId);
  if (!existing) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  const recipeData = await buildRecipeDocument(payload, { excludeId: existing._id });
  Object.assign(existing, recipeData);
  await existing.save();

  return formatAdminRecipe(existing.toObject());
};

export const deleteRecipe = async (recipeId) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new Error("Invalid recipe ID");
    error.statusCode = 400;
    throw error;
  }

  const recipe = await Recipe.findByIdAndDelete(recipeId);
  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return true;
};

export const listPublicRecipes = async (query = {}) => {
  const limit = parsePositiveInt(query.limit, 20, 50);
  const filter = {
    isActive: true,
    status: "active",
  };

  const trimmedSearch = query.search?.trim();
  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    filter.$or = [
      { title: searchRegex },
      { subtitle: searchRegex },
      { description: searchRegex },
      { enuSpicesUsed: searchRegex },
      { ingredientsList: searchRegex },
    ];
  }

  const recipes = await Recipe.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .lean();

  return {
    recipes: recipes.map(formatPublicRecipe),
  };
};

export const getPublicRecipeBySlug = async (slug) => {
  const normalizedSlug = slug?.trim().toLowerCase();
  if (!normalizedSlug) {
    const error = new Error("Recipe slug is required");
    error.statusCode = 400;
    throw error;
  }

  const recipe = await Recipe.findOne({
    slug: normalizedSlug,
    isActive: true,
    status: "active",
  }).lean();

  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return formatPublicRecipe(recipe);
};
