import { listPublicCategories } from "./category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await listPublicCategories();

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
