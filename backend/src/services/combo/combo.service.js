import mongoose from "mongoose";
import Combo from "./combo.model.js";
import Product from "../product/product.model.js";
import Category from "../category/category.model.js";
import {
  parsePositiveInt,
  slugifyComboTitle,
  validateComboPayload,
  validateComboStatus,
} from "./combo.validation.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const formatAdminCombo = (combo) => ({
  id: combo._id.toString(),
  title: combo.title,
  subtitle: combo.subtitle || "",
  slug: combo.slug,
  category: combo.category,
  tag: combo.tag || "",
  badge: combo.badge || "",
  description: combo.description,
  fullStory: combo.fullStory || "",
  fullDescription: combo.fullStory || "",
  image: combo.image,
  secondaryImages: combo.secondaryImages || [],
  discountPercent: combo.discountPercent || 0,
  chefTip: combo.chefTip || "",
  customChefTip: combo.chefTip || "",
  highlights: combo.highlights || [],
  idealRecipes: combo.idealRecipes || [],
  status: combo.status,
  items: (combo.items || []).map((item) => ({
    productId: item.product?._id?.toString?.() || item.product?.toString?.() || item.product,
    productName: item.product?.name || "",
    weight: item.weight,
    role: item.role || "",
    description: item.description || "",
    keyNotes: item.keyNotes || [],
    quantity: item.quantity || 1,
  })),
  originalPrice: combo.originalPrice,
  discountedPrice: combo.discountedPrice,
  price: combo.discountedPrice,
  createdAt: combo.createdAt,
  updatedAt: combo.updatedAt,
});

const buildComboFilter = ({ search = "", status = "all" } = {}) => {
  const filter = {};
  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    filter.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { description: searchRegex },
      { tag: searchRegex },
    ];
  }

  if (status && status !== "all") {
    filter.status = validateComboStatus(status);
  }

  return filter;
};

const mapComboItems = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("At least one product item is required");
    error.statusCode = 400;
    throw error;
  }

  const seenLineKeys = new Set();
  const mappedItems = [];
  const productIds = items
    .map((item) => item?.productId?.trim())
    .filter((productId) => productId && mongoose.Types.ObjectId.isValid(productId));

  const products = await Product.find({ _id: { $in: productIds } })
    .select("name status isActive weightVariants")
    .lean();
  const productMap = Object.fromEntries(
    products.map((product) => [product._id.toString(), product]),
  );

  for (const [index, item] of items.entries()) {
    const productId = item?.productId?.trim();

    if (!productId) {
      const error = new Error(`Item ${index + 1}: productId is required`);
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error(`Invalid product ID: ${productId}`);
      error.statusCode = 400;
      throw error;
    }

    const weight = item.weight?.trim();
    if (!weight) {
      const error = new Error(`Item ${index + 1}: weight is required`);
      error.statusCode = 400;
      throw error;
    }

    const lineKey = `${productId}:${weight}`;
    if (seenLineKeys.has(lineKey)) {
      const error = new Error(
        `Duplicate product and weight combination for item ${index + 1}. Increase quantity instead.`,
      );
      error.statusCode = 400;
      throw error;
    }
    seenLineKeys.add(lineKey);

    const quantity =
      item.quantity !== undefined && item.quantity !== null && item.quantity !== ""
        ? Number(item.quantity)
        : 1;

    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error(`Item ${index + 1}: quantity must be a whole number of at least 1`);
      error.statusCode = 400;
      throw error;
    }

    const product = productMap[productId];

    if (!product) {
      const error = new Error(`Product not found: ${productId}`);
      error.statusCode = 404;
      throw error;
    }

    if (product.status !== "active" || !product.isActive) {
      const error = new Error(
        `Product "${product.name}" is not active and cannot be added to a combo`,
      );
      error.statusCode = 400;
      throw error;
    }

    const variant = (product.weightVariants || []).find((entry) => entry.weight === weight);

    if (!variant) {
      const error = new Error(`Invalid weight "${weight}" for product "${product.name}"`);
      error.statusCode = 400;
      throw error;
    }

    if (variant.stock <= 0) {
      const error = new Error(`Product "${product.name}" (${weight}) is out of stock`);
      error.statusCode = 400;
      throw error;
    }

    if (quantity > variant.stock) {
      const error = new Error(
        `Insufficient stock for "${product.name}" (${weight}). Available: ${variant.stock}`,
      );
      error.statusCode = 400;
      throw error;
    }

    mappedItems.push({
      product: product._id,
      weight,
      quantity,
      role: item.role?.trim() || "",
      description: item.description?.trim() || "",
      keyNotes: Array.isArray(item.keyNotes) ? item.keyNotes : [],
    });
  }

  return mappedItems;
};

const buildUniqueSlug = async (title, slug, excludeId) => {
  const baseSlug = (slug?.trim() || slugifyComboTitle(title)).toLowerCase();

  if (!baseSlug) {
    const error = new Error("Unable to generate combo slug");
    error.statusCode = 400;
    throw error;
  }

  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const filter = { slug: candidate };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await Combo.findOne(filter).select("_id").lean();
    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const buildComboDocument = async (payload, { excludeId } = {}) => {
  const normalized = validateComboPayload(payload);
  const items = await mapComboItems(normalized.items);
  const slug = await buildUniqueSlug(normalized.title, normalized.slug, excludeId);
  const status = normalized.status || "active";

  return {
    title: normalized.title.trim(),
    subtitle: normalized.subtitle?.trim() || "",
    slug,
    category: normalized.category.trim(),
    tag: normalized.tag?.trim() || "",
    badge: normalized.badge?.trim() || "",
    description: normalized.description.trim(),
    fullStory: normalized.fullStory?.trim() || "",
    image: normalized.image.trim(),
    secondaryImages: normalized.secondaryImages || [],
    discountPercent: Number(normalized.discountPercent) || 0,
    chefTip: normalized.chefTip?.trim() || "",
    highlights: normalized.highlights || [],
    idealRecipes: normalized.idealRecipes || [],
    status,
    isActive: status === "active",
    items,
    originalPrice: Number(normalized.originalPrice),
    discountedPrice: Number(normalized.discountedPrice),
  };
};

export const listAdminCombos = async (query = {}) => {
  const page = parsePositiveInt(query.page, 1, 1000);
  const limit = parsePositiveInt(query.limit, 50, 100);
  const skip = (page - 1) * limit;
  const filter = buildComboFilter(query);

  const [combos, total] = await Promise.all([
    Combo.find(filter)
      .populate("items.product", "name")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Combo.countDocuments(filter),
  ]);

  return {
    combos: combos.map(formatAdminCombo),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getAdminComboById = async (comboId) => {
  if (!mongoose.Types.ObjectId.isValid(comboId)) {
    const error = new Error("Invalid combo ID");
    error.statusCode = 400;
    throw error;
  }

  const combo = await Combo.findById(comboId).populate("items.product", "name").lean();

  if (!combo) {
    const error = new Error("Combo not found");
    error.statusCode = 404;
    throw error;
  }

  return formatAdminCombo(combo);
};

export const createCombo = async (payload) => {
  const comboData = await buildComboDocument(payload);
  const combo = await Combo.create(comboData);
  return formatAdminCombo(combo.toObject());
};

export const updateCombo = async (comboId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(comboId)) {
    const error = new Error("Invalid combo ID");
    error.statusCode = 400;
    throw error;
  }

  const existing = await Combo.findById(comboId);

  if (!existing) {
    const error = new Error("Combo not found");
    error.statusCode = 404;
    throw error;
  }

  const comboData = await buildComboDocument(payload, {
    excludeId: existing._id,
    isUpdate: true,
  });

  Object.assign(existing, comboData);
  await existing.save();

  return formatAdminCombo(existing.toObject());
};

export const deleteCombo = async (comboId) => {
  if (!mongoose.Types.ObjectId.isValid(comboId)) {
    const error = new Error("Invalid combo ID");
    error.statusCode = 400;
    throw error;
  }

  const combo = await Combo.findByIdAndDelete(comboId);

  if (!combo) {
    const error = new Error("Combo not found");
    error.statusCode = 404;
    throw error;
  }

  return true;
};

const COMBO_PRODUCT_SELECT =
  "name slug shortDescription price compareAtPrice stock sku category categorySlug images defaultWeight weightVariants isFeatured isBestSeller isNewArrival";

const loadComboProductMap = async (productIds = []) => {
  if (!productIds.length) {
    return {};
  }

  const uniqueIds = [...new Set(productIds.map((id) => id.toString()))];
  const products = await Product.find({
    _id: { $in: uniqueIds },
    isActive: true,
    status: "active",
  })
    .select(COMBO_PRODUCT_SELECT)
    .lean();

  const categoryIds = [...new Set(products.map((product) => product.category.toString()))];
  const categories = await Category.find({ _id: { $in: categoryIds } })
    .select("name slug")
    .lean();
  const categoryMap = Object.fromEntries(
    categories.map((category) => [category._id.toString(), category]),
  );

  return Object.fromEntries(
    products.map((product) => [
      product._id.toString(),
      formatComboEmbeddedProduct(
        product,
        categoryMap[product.category.toString()] || {},
      ),
    ]),
  );
};

const formatComboEmbeddedProduct = (product, categoryMeta = {}) => {
  const weightVariants = (product.weightVariants || []).map((variant) => ({
    weight: variant.weight,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice || 0,
    inStock: Number(variant.stock) > 0,
  }));

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: categoryMeta.name || "",
    categorySlug: product.categorySlug || categoryMeta.slug || "",
    weightVariants,
    weightOptions: weightVariants.map((variant) => variant.weight),
    defaultWeight: product.defaultWeight,
    price: product.price,
    originalPrice: product.compareAtPrice || product.price,
    shortDescription: product.shortDescription,
    fullDescription: product.shortDescription,
    image: product.images?.[0]?.url || "",
    secondaryImages: [],
    ingredients: [],
    benefits: [],
    storageInstructions: "",
    aromaProfile: "",
    spicinessLevel: 3,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    bestFor: [],
    inStock: product.stock > 0,
  };
};

const formatPublicCombo = (combo, productMap = {}) => ({
  id: combo._id.toString(),
  slug: combo.slug,
  title: combo.title,
  subtitle: combo.subtitle || "",
  category: combo.category,
  tag: combo.tag || "",
  badge: combo.badge || "",
  description: combo.description,
  fullStory: combo.fullStory || "",
  image: combo.image,
  secondaryImages: combo.secondaryImages || [],
  discountPercent: combo.discountPercent || 0,
  chefTip: combo.chefTip || "",
  highlights: combo.highlights || [],
  idealRecipes: combo.idealRecipes || [],
  originalPrice: combo.originalPrice,
  discountedPrice: combo.discountedPrice,
  items: (combo.items || []).map((item) => {
    const productId = item.product?.toString?.() || String(item.product);
    const product = productMap[productId];

    return {
      productId,
      weight: item.weight,
      quantity: item.quantity || 1,
      role: item.role || "",
      description: item.description || "",
      keyNotes: item.keyNotes || [],
      product,
    };
  }),
});

const buildPublicComboFilter = (query = {}) => {
  const filter = {
    isActive: true,
    status: "active",
  };

  if (query.category && query.category !== "all") {
    filter.category = query.category.trim().toLowerCase();
  }

  return filter;
};

export const listPublicCombos = async (query = {}) => {
  const limit = parsePositiveInt(query.limit, 20, 50);
  const filter = buildPublicComboFilter(query);

  const combos = await Combo.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .lean();

  const productIds = combos.flatMap((combo) =>
    (combo.items || []).map((item) => item.product),
  );
  const productMap = await loadComboProductMap(productIds);

  return {
    combos: combos.map((combo) => formatPublicCombo(combo, productMap)),
  };
};

export const getPublicComboBySlug = async (slug) => {
  const normalizedSlug = slug?.trim().toLowerCase();
  if (!normalizedSlug) {
    const error = new Error("Combo slug is required");
    error.statusCode = 400;
    throw error;
  }

  const combo = await Combo.findOne({
    slug: normalizedSlug,
    isActive: true,
    status: "active",
  }).lean();

  if (!combo) {
    const error = new Error("Combo not found");
    error.statusCode = 404;
    throw error;
  }

  const productIds = (combo.items || []).map((item) => item.product);
  const productMap = await loadComboProductMap(productIds);

  return formatPublicCombo(combo, productMap);
};
