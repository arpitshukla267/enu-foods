import { listPublicRecipes, getPublicRecipeBySlug } from "./recipe.service.js";

export const getRecipes = async (req, res, next) => {
  try {
    const result = await listPublicRecipes(req.query);
    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeBySlug = async (req, res, next) => {
  try {
    const recipe = await getPublicRecipeBySlug(req.params.slug);
    return res.status(200).json({
      success: true,
      message: "Recipe fetched successfully",
      data: { recipe },
    });
  } catch (error) {
    next(error);
  }
};
