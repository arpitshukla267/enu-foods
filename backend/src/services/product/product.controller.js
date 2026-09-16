import { listPublicProducts, getPublicProductBySlug } from "./product.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const result = await listPublicProducts(req.query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await getPublicProductBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};
