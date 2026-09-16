import {
  listAdminRecipes,
  getAdminRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../recipe/recipe.service.js";

export const getRecipes = async (req, res, next) => {
  try {
    const result = await listAdminRecipes(req.query);
    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await getAdminRecipeById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Recipe fetched successfully",
      data: { recipe },
    });
  } catch (error) {
    next(error);
  }
};

export const createRecipeHandler = async (req, res, next) => {
  try {
    const recipe = await createRecipe(req.body);
    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: { recipe },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecipeHandler = async (req, res, next) => {
  try {
    const recipe = await updateRecipe(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: { recipe },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecipeHandler = async (req, res, next) => {
  try {
    await deleteRecipe(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
