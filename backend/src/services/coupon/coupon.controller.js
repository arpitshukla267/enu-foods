import {
  listAdminCoupons,
  getAdminCouponById,
  createCoupon,
  updateCoupon,
  updateCouponStatus,
  deleteCoupon,
} from "./coupon.service.js";
import {
  validateStatusPayload,
} from "./coupon.validation.js";

export const getCoupons = async (req, res, next) => {
  try {
    const result = await listAdminCoupons(req.query);

    return res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (req, res, next) => {
  try {
    const coupon = await getAdminCouponById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const createCouponHandler = async (req, res, next) => {
  try {
    const coupon = await createCoupon(req.body);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCouponHandler = async (req, res, next) => {
  try {
    const coupon = await updateCoupon(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCouponStatusHandler = async (req, res, next) => {
  try {
    const { isActive } = validateStatusPayload(req.body);
    const coupon = await updateCouponStatus(req.params.id, isActive);

    return res.status(200).json({
      success: true,
      message: "Coupon status updated successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCouponHandler = async (req, res, next) => {
  try {
    await deleteCoupon(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
