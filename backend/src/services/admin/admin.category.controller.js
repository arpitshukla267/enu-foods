import {
  listAdminCategories,
  getAdminCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../category/category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const { search } = req.query;
    const categories = await listAdminCategories({ search });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await getAdminCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategoryHandler = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryHandler = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryHandler = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createSubcategoryHandler = async (req, res, next) => {
  try {
    const category = await addSubcategory(req.params.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubcategoryHandler = async (req, res, next) => {
  try {
    const category = await updateSubcategory(
      req.params.id,
      req.params.subcategoryId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubcategoryHandler = async (req, res, next) => {
  try {
    const category = await deleteSubcategory(
      req.params.id,
      req.params.subcategoryId,
    );

    return res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};
