import {
  addItemToCart,
  clearCartForUser,
  getCartForUser,
  mergeGuestItems,
  removeCartItem,
  updateCartItemQuantity,
  applyCouponToCart,
  removeCouponFromCart,
} from "./cart.service.js";
import {
  validateAddItemPayload,
  validateMergeItemsPayload,
  validateUpdateQuantityPayload,
} from "./cart.validation.js";
import { validateApplyCouponPayload } from "../coupon/coupon.validation.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartForUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const addCartItem = async (req, res, next) => {
  try {
    const payload = validateAddItemPayload(req.body);
    const cart = await addItemToCart(req.user.id, payload);

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const payload = validateUpdateQuantityPayload(req.body);
    const cart = await updateCartItemQuantity(req.user.id, req.params.itemId, payload);

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const cart = await removeCartItem(req.user.id, req.params.itemId);

    return res.status(200).json({
      success: true,
      message: "Cart item removed",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await clearCartForUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const mergeCart = async (req, res, next) => {
  try {
    const guestItems = validateMergeItemsPayload(req.body);
    const result = await mergeGuestItems(req.user.id, guestItems);

    return res.status(200).json({
      success: true,
      message: "Guest cart merged successfully",
      data: {
        cart: {
          items: result.items,
          subtotal: result.subtotal,
          subtotalPaise: result.subtotalPaise,
          totalItems: result.totalItems,
          coupon: result.coupon || null,
          discount: result.discount || 0,
          discountPaise: result.discountPaise || 0,
          total: result.total ?? result.subtotal,
          totalPaise: result.totalPaise ?? result.subtotalPaise,
        },
        mergeWarnings: result.mergeWarnings || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const applyCartCoupon = async (req, res, next) => {
  try {
    const { code } = validateApplyCouponPayload(req.body);
    const cart = await applyCouponToCart(req.user.id, code);

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartCoupon = async (req, res, next) => {
  try {
    const cart = await removeCouponFromCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};
