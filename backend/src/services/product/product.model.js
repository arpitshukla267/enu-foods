import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const weightVariantSchema = new mongoose.Schema(
  {
    weight: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    categorySlug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    subcategorySlug: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      index: true,
    },
    weightVariants: {
      type: [weightVariantSchema],
      default: [],
    },
    defaultWeight: {
      type: String,
      trim: true,
      default: "",
    },
    ingredients: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    bestFor: {
      type: [String],
      default: [],
    },
    storageInstructions: {
      type: String,
      trim: true,
      default: "",
    },
    aromaProfile: {
      type: String,
      trim: true,
      default: "",
    },
    spicinessLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ isActive: 1, createdAt: -1, _id: -1 });
productSchema.index({ category: 1, isActive: 1, createdAt: -1, _id: -1 });
productSchema.index({
  categorySlug: 1,
  subcategorySlug: 1,
  isActive: 1,
  createdAt: -1,
  _id: -1,
});
productSchema.index({ isFeatured: 1, isActive: 1, createdAt: -1 });
productSchema.index({ isBestSeller: 1, isActive: 1, createdAt: -1 });
productSchema.index({ isNewArrival: 1, isActive: 1, createdAt: -1 });
productSchema.index({ name: "text", shortDescription: "text", sku: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
