import {
  getAdminOrderById,
  listAdminOrders,
  updateAdminOrderStatus,
} from "../order/order.service.js";

export const getOrders = async (req, res, next) => {
  try {
    const result = await listAdminOrders(req.query);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await getAdminOrderById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await updateAdminOrderStatus(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};
