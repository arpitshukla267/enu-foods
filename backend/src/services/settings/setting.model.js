import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "ENU Foods",
      trim: true,
    },
    currency: {
      type: String,
      default: "₹",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "care@enufoods.com",
      trim: true,
      lowercase: true,
    },
    supportPhone: {
      type: String,
      default: "+91 98765 43210",
      trim: true,
    },
    address: {
      type: String,
      default: "Spice Processing Mill #14, Industrial Estate, Kochi, Kerala 682001",
      trim: true,
    },
    freeShippingThreshold: {
      type: Number,
      default: 999,
      min: 0,
    },
    standardShippingFee: {
      type: Number,
      default: 60,
      min: 0,
    },
    expressShippingFee: {
      type: Number,
      default: 49,
      min: 0,
    },
    taxRatePercent: {
      type: Number,
      default: 5,
      min: 0,
      max: 100,
    },
    gstNumber: {
      type: String,
      default: "32AABCE1234F1Z8",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
