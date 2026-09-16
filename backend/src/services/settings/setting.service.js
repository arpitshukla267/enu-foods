import Setting from "./setting.model.js";

const DEFAULT_SETTINGS = {
  storeName: "ENU Foods",
  currency: "₹",
  supportEmail: "care@enufoods.com",
  supportPhone: "+91 98765 43210",
  address: "Spice Processing Mill #14, Industrial Estate, Kochi, Kerala 682001",
  freeShippingThreshold: 999,
  standardShippingFee: 60,
  expressShippingFee: 49,
  taxRatePercent: 5,
  gstNumber: "32AABCE1234F1Z8",
};

export const getStoreSettings = async () => {
  let doc = await Setting.findOne();
  if (!doc) {
    doc = await Setting.create(DEFAULT_SETTINGS);
  }
  return {
    storeName: doc.storeName,
    currency: doc.currency,
    supportEmail: doc.supportEmail,
    supportPhone: doc.supportPhone,
    address: doc.address,
    freeShippingThreshold: doc.freeShippingThreshold,
    standardShippingFee: doc.standardShippingFee,
    expressShippingFee: doc.expressShippingFee ?? 49,
    taxRatePercent: doc.taxRatePercent,
    gstNumber: doc.gstNumber,
  };
};

export const updateStoreSettings = async (updates) => {
  let doc = await Setting.findOne();
  if (!doc) {
    doc = new Setting(DEFAULT_SETTINGS);
  }

  if (updates.storeName !== undefined) doc.storeName = String(updates.storeName).trim();
  if (updates.currency !== undefined) doc.currency = String(updates.currency).trim();
  if (updates.supportEmail !== undefined) doc.supportEmail = String(updates.supportEmail).trim();
  if (updates.supportPhone !== undefined) doc.supportPhone = String(updates.supportPhone).trim();
  if (updates.address !== undefined) doc.address = String(updates.address).trim();
  if (updates.freeShippingThreshold !== undefined)
    doc.freeShippingThreshold = Math.max(0, Number(updates.freeShippingThreshold) || 0);
  if (updates.standardShippingFee !== undefined)
    doc.standardShippingFee = Math.max(0, Number(updates.standardShippingFee) || 0);
  if (updates.expressShippingFee !== undefined)
    doc.expressShippingFee = Math.max(0, Number(updates.expressShippingFee) || 0);
  if (updates.taxRatePercent !== undefined)
    doc.taxRatePercent = Math.min(100, Math.max(0, Number(updates.taxRatePercent) || 0));
  if (updates.gstNumber !== undefined) doc.gstNumber = String(updates.gstNumber).trim();

  await doc.save();

  return {
    storeName: doc.storeName,
    currency: doc.currency,
    supportEmail: doc.supportEmail,
    supportPhone: doc.supportPhone,
    address: doc.address,
    freeShippingThreshold: doc.freeShippingThreshold,
    standardShippingFee: doc.standardShippingFee,
    expressShippingFee: doc.expressShippingFee ?? 49,
    taxRatePercent: doc.taxRatePercent,
    gstNumber: doc.gstNumber,
  };
};
