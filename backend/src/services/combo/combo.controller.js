import { listPublicCombos, getPublicComboBySlug } from "./combo.service.js";

export const getCombos = async (req, res, next) => {
  try {
    const result = await listPublicCombos(req.query);

    return res.status(200).json({
      success: true,
      message: "Combos fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getComboBySlug = async (req, res, next) => {
  try {
    const combo = await getPublicComboBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      message: "Combo fetched successfully",
      data: {
        combo,
      },
    });
  } catch (error) {
    next(error);
  }
};
