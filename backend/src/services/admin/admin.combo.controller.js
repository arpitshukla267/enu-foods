import {
  listAdminCombos,
  getAdminComboById,
  createCombo,
  updateCombo,
  deleteCombo,
} from "../combo/combo.service.js";

export const getCombos = async (req, res, next) => {
  try {
    const result = await listAdminCombos(req.query);

    return res.status(200).json({
      success: true,
      message: "Combos fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getComboById = async (req, res, next) => {
  try {
    const combo = await getAdminComboById(req.params.id);

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

export const createComboHandler = async (req, res, next) => {
  try {
    const combo = await createCombo(req.body);

    return res.status(201).json({
      success: true,
      message: "Combo created successfully",
      data: {
        combo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateComboHandler = async (req, res, next) => {
  try {
    const combo = await updateCombo(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Combo updated successfully",
      data: {
        combo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComboHandler = async (req, res, next) => {
  try {
    await deleteCombo(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Combo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
