import {
  createOrderFromCart,
  getOrderForUser,
  listOrdersForUser,
} from "./order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const result = await createOrderFromCart(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const result = await listOrdersForUser(req.user.id, req.query);

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
    const order = await getOrderForUser(req.user.id, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};
