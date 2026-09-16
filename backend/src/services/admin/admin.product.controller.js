import {
  listAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../product/product.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const result = await listAdminProducts(req.query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getAdminProductById(req.params.id);

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

export const createProductHandler = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductStatusHandler = async (req, res, next) => {
  try {
    const product = await updateProductStatus(req.params.id, req.body.status);

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
