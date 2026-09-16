import mongoose from "mongoose";
import Category from "./category.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const formatPublicSubcategory = (subcategory) => ({
  id: subcategory._id.toString(),
  name: subcategory.name,
  slug: subcategory.slug,
});

export const formatPublicCategory = (category) => ({
  id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image,
  subcategories: (category.subcategories || [])
    .filter((subcategory) => subcategory.status === "active")
    .map(formatPublicSubcategory),
});

export const formatAdminSubcategory = (subcategory, categoryId) => ({
  id: subcategory._id.toString(),
  name: subcategory.name,
  slug: subcategory.slug,
  categoryId,
  status: subcategory.status,
});

export const formatAdminCategory = (category) => ({
  id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image,
  status: category.status,
  productCount: category.productCount || 0,
  subcategories: (category.subcategories || []).map((subcategory) =>
    formatAdminSubcategory(subcategory, category._id.toString()),
  ),
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const listPublicCategories = async () => {
  const categories = await Category.find({ status: "active" })
    .sort({ name: 1 })
    .lean();

  return categories.map(formatPublicCategory);
};

export const listAdminCategories = async ({ search = "" } = {}) => {
  const filter = {};
  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  const categories = await Category.find(filter).sort({ name: 1 }).lean();
  return categories.map(formatAdminCategory);
};

export const getAdminCategoryById = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId).lean();

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return formatAdminCategory(category);
};

export const createCategory = async ({
  name,
  slug,
  description = "",
  image = "",
  status = "active",
}) => {
  const normalizedSlug = slug.trim().toLowerCase();

  const existingCategory = await Category.findOne({ slug: normalizedSlug });

  if (existingCategory) {
    const error = new Error("A category with this slug already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await Category.create({
    name: name.trim(),
    slug: normalizedSlug,
    description: description.trim(),
    image: image.trim(),
    status,
    subcategories: [],
  });

  return formatAdminCategory(category.toObject());
};

export const updateCategory = async (categoryId, updates) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.slug && updates.slug.trim().toLowerCase() !== category.slug) {
    const slugExists = await Category.findOne({
      slug: updates.slug.trim().toLowerCase(),
      _id: { $ne: category._id },
    });

    if (slugExists) {
      const error = new Error("A category with this slug already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  if (updates.name !== undefined) category.name = updates.name.trim();
  if (updates.slug !== undefined) category.slug = updates.slug.trim().toLowerCase();
  if (updates.description !== undefined) category.description = updates.description.trim();
  if (updates.image !== undefined) category.image = updates.image.trim();
  if (updates.status !== undefined) category.status = updates.status;

  await category.save();

  return formatAdminCategory(category.toObject());
};

export const deleteCategory = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return true;
};

export const addSubcategory = async (categoryId, { name, slug, status = "active" }) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const normalizedSlug = slug.trim().toLowerCase();
  const duplicateSlug = category.subcategories.some(
    (subcategory) => subcategory.slug === normalizedSlug,
  );

  if (duplicateSlug) {
    const error = new Error("A subcategory with this slug already exists in this category");
    error.statusCode = 409;
    throw error;
  }

  category.subcategories.push({
    name: name.trim(),
    slug: normalizedSlug,
    status,
  });

  await category.save();

  return formatAdminCategory(category.toObject());
};

export const updateSubcategory = async (
  categoryId,
  subcategoryId,
  updates,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(categoryId) ||
    !mongoose.Types.ObjectId.isValid(subcategoryId)
  ) {
    const error = new Error("Invalid category or subcategory ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const subcategory = category.subcategories.id(subcategoryId);

  if (!subcategory) {
    const error = new Error("Subcategory not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.slug && updates.slug.trim().toLowerCase() !== subcategory.slug) {
    const duplicateSlug = category.subcategories.some(
      (item) =>
        item._id.toString() !== subcategoryId &&
        item.slug === updates.slug.trim().toLowerCase(),
    );

    if (duplicateSlug) {
      const error = new Error("A subcategory with this slug already exists in this category");
      error.statusCode = 409;
      throw error;
    }
  }

  if (updates.name !== undefined) subcategory.name = updates.name.trim();
  if (updates.slug !== undefined) subcategory.slug = updates.slug.trim().toLowerCase();
  if (updates.status !== undefined) subcategory.status = updates.status;

  await category.save();

  return formatAdminCategory(category.toObject());
};

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  if (
    !mongoose.Types.ObjectId.isValid(categoryId) ||
    !mongoose.Types.ObjectId.isValid(subcategoryId)
  ) {
    const error = new Error("Invalid category or subcategory ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const subcategory = category.subcategories.id(subcategoryId);

  if (!subcategory) {
    const error = new Error("Subcategory not found");
    error.statusCode = 404;
    throw error;
  }

  subcategory.deleteOne();
  await category.save();

  return formatAdminCategory(category.toObject());
};
