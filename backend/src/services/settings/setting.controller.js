import { getStoreSettings, updateStoreSettings } from "./setting.service.js";

export const getSettings = async (req, res, next) => {
  try {
    const settings = await getStoreSettings();
    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await updateStoreSettings(req.body);
    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};
