import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    prepTime: {
      type: String,
      trim: true,
      default: "",
    },
    cookTime: {
      type: String,
      trim: true,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Advanced"],
      default: "Easy",
    },
    servings: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    enuSpicesUsed: {
      type: [String],
      default: [],
    },
    ingredientsList: {
      type: [String],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

recipeSchema.index({ status: 1, createdAt: -1 });
recipeSchema.index({ title: "text", subtitle: "text", description: "text" });

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
