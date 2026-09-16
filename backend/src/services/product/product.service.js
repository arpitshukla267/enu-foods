import mongoose from "mongoose";
import Product from "./product.model.js";
import Category from "../category/category.model.js";
import {
  parsePositiveInt,
  parseNonNegativeNumber,
  validateSort,
  validateStatus,
  validateProductPayload,
  ADMIN_SORT_OPTIONS,
} from "./product.validation.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSubstringSearchFilter = (trimmedSearch) => {
  if (!trimmedSearch) {
    return null;
  }

  const tokens = trimmedSearch.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return null;
  }

  const buildTokenFilter = (token) => {
    const searchRegex = new RegExp(escapeRegex(token), "i");
    return {
      $or: [
        { name: searchRegex },
        { slug: searchRegex },
        { sku: searchRegex },
        { shortDescription: searchRegex },
        { "weightVariants.sku": searchRegex },
      ],
    };
  };

  if (tokens.length === 1) {
    return buildTokenFilter(tokens[0]);
  }

  return {
    $and: tokens.map((token) => buildTokenFilter(token)),
  };
};

const PUBLIC_LIST_SELECT =
  "name slug shortDescription price compareAtPrice stock sku category categorySlug subcategorySlug images defaultWeight weightVariants isFeatured isBestSeller isNewArrival createdAt";

const getThumbnailUrl = (images = []) => {
  const first = images[0];
  if (!first?.url) {
    return "";
  }

  if (first.url.includes("cloudinary.com") && first.url.includes("/upload/")) {
    return first.url.replace("/upload/", "/upload/c_fill,w_400,h_400,q_auto,f_auto/");
  }

  return first.url;
};

const mapWeightVariantsForAdmin = (variants = []) =>
  variants.map((variant) => ({
    id: variant._id.toString(),
    weight: variant.weight,
    price: variant.price,
    originalPrice: variant.compareAtPrice,
    stock: variant.stock,
    sku: variant.sku,
    isDefault: variant.isDefault,
  }));

const mapWeightVariantsForPublic = (variants = []) =>
  variants.map((variant) => variant.weight);

const mapWeightVariantsWithPricingForPublic = (variants = []) =>
  variants.map((variant) => ({
    weight: variant.weight,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice || 0,
    inStock: Number(variant.stock) > 0,
  }));

const buildPublicWeightVariants = (product) => {
  const variants = mapWeightVariantsWithPricingForPublic(product.weightVariants);
  if (variants.length) {
    return variants;
  }

  if (product.defaultWeight) {
    return [
      {
        weight: product.defaultWeight,
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        inStock: product.stock > 0,
      },
    ];
  }

  return [];
};

export const formatPublicListProduct = (product, categoryMeta = {}) => {
  const weightVariants = buildPublicWeightVariants(product);

  return {
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  thumbnail: getThumbnailUrl(product.images),
  price: product.price,
  compareAtPrice: product.compareAtPrice,
  category: {
    id: product.category?.toString?.() || product.category,
    name: categoryMeta.name || "",
    slug: product.categorySlug || categoryMeta.slug || "",
  },
  badges: {
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
  },
  inStock: product.stock > 0,
  weightVariants,
  weightOptions: weightVariants.map((variant) => variant.weight),
  defaultWeight: product.defaultWeight,
  shortDescription: product.shortDescription,
};
};

export const formatPublicDetailProduct = (product, categoryMeta = {}) => {
  const images = product.images || [];
  const secondaryImages = images.slice(1).map((image) => image.url);
  const weightVariants = buildPublicWeightVariants(product);

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: categoryMeta.name || "",
    categorySlug: product.categorySlug || categoryMeta.slug || "",
    categoryId: product.category?.toString?.() || product.category,
    subcategoryId: product.subcategory?.toString?.() || null,
    subcategorySlug: product.subcategorySlug || "",
    weightVariants,
    weightOptions: weightVariants.map((variant) => variant.weight),
    defaultWeight: product.defaultWeight,
    price: product.price,
    originalPrice: product.compareAtPrice,
    compareAtPrice: product.compareAtPrice,
    shortDescription: product.shortDescription,
    fullDescription: product.description,
    description: product.description,
    image: images[0]?.url || "",
    secondaryImages,
    images: images.map((image) => ({
      url: image.url,
      publicId: image.publicId,
    })),
    ingredients: product.ingredients || [],
    benefits: product.benefits || [],
    storageInstructions: product.storageInstructions || "",
    aromaProfile: product.aromaProfile || "",
    spicinessLevel: product.spicinessLevel || 3,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    bestFor: product.bestFor || [],
    stock: product.stock,
    sku: product.sku,
    inStock: product.stock > 0,
    badges: {
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
    },
  };
};

export const formatAdminProduct = (product, categoryMeta = {}) => ({
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  categoryId: product.category?.toString?.() || product.category,
  categoryName: categoryMeta.name || "",
  subcategoryId: product.subcategory?.toString?.() || undefined,
  subcategoryName: categoryMeta.subcategoryName || "",
  weightOptions: mapWeightVariantsForAdmin(product.weightVariants),
  defaultWeight: product.defaultWeight,
  price: product.price,
  originalPrice: product.compareAtPrice,
  compareAtPrice: product.compareAtPrice,
  shortDescription: product.shortDescription,
  fullDescription: product.description,
  image: product.images?.[0]?.url || "",
  secondaryImages: (product.images || []).slice(1).map((image) => image.url),
  images: product.images || [],
  ingredients: product.ingredients || [],
  benefits: product.benefits || [],
  storageInstructions: product.storageInstructions || "",
  aromaProfile: product.aromaProfile || "",
  spicinessLevel: product.spicinessLevel || 3,
  isFeatured: product.isFeatured,
  isBestSeller: product.isBestSeller,
  isNewArrival: product.isNewArrival,
  status: product.status,
  isActive: product.isActive,
  stock: product.stock,
  sku: product.sku,
  bestFor: product.bestFor || [],
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const buildSortOption = (sort) => {
  switch (sort) {
    case "oldest":
      return { createdAt: 1, _id: 1 };
    case "price-asc":
      return { price: 1, _id: 1 };
    case "price-desc":
      return { price: -1, _id: -1 };
    case "name-asc":
      return { name: 1, _id: 1 };
    case "name-desc":
      return { name: -1, _id: -1 };
    case "stock-asc":
      return { stock: 1, _id: 1 };
    case "stock-desc":
      return { stock: -1, _id: -1 };
    case "newest":
    default:
      return { createdAt: -1, _id: -1 };
  }
};

const getPrimarySortField = (sort) => {
  switch (sort) {
    case "oldest":
      return "createdAt";
    case "price-asc":
    case "price-desc":
      return "price";
    case "name-asc":
    case "name-desc":
      return "name";
    case "stock-asc":
    case "stock-desc":
      return "stock";
    default:
      return "createdAt";
  }
};

const encodeCursor = (product, sort) => {
  const sortField = getPrimarySortField(sort);
  const sortValue = product[sortField];

  return Buffer.from(
    JSON.stringify({
      sort,
      sortField,
      sortValue:
        sortValue instanceof Date ? sortValue.toISOString() : sortValue,
      id: product._id.toString(),
    }),
  ).toString("base64url");
};

const decodeCursor = (cursor, sort) => {
  if (!cursor) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));

    if (decoded.sort !== sort) {
      const error = new Error("Cursor does not match the current sort option");
      error.statusCode = 400;
      throw error;
    }

    return decoded;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const invalidCursorError = new Error("Invalid cursor");
    invalidCursorError.statusCode = 400;
    throw invalidCursorError;
  }
};

const buildCursorFilter = (cursorData, sort) => {
  if (!cursorData) {
    return {};
  }

  const sortOption = buildSortOption(sort);
  const primaryField = getPrimarySortField(sort);
  const direction = sortOption[primaryField];
  const operator = direction === 1 ? "$gt" : "$lt";

  let primaryValue = cursorData.sortValue;
  if (primaryField === "createdAt") {
    primaryValue = new Date(cursorData.sortValue);
  }

  return {
    $or: [
      { [primaryField]: { [operator]: primaryValue } },
      {
        [primaryField]: primaryValue,
        _id: { [operator]: new mongoose.Types.ObjectId(cursorData.id) },
      },
    ],
  };
};

const resolveCategoryMeta = async ({ categoryId, categorySlug, subcategorySlug }) => {
  let categoryDoc = null;

  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    categoryDoc = await Category.findById(categoryId).lean();
  } else if (categorySlug) {
    categoryDoc = await Category.findOne({
      slug: categorySlug.trim().toLowerCase(),
    }).lean();
  }

  if (!categoryDoc) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  let subcategory = null;
  if (subcategorySlug) {
    subcategory = categoryDoc.subcategories?.find(
      (item) => item.slug === subcategorySlug.trim().toLowerCase(),
    );

    if (!subcategory) {
      const error = new Error("Subcategory not found in selected category");
      error.statusCode = 400;
      throw error;
    }
  } else if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    subcategory = categoryDoc.subcategories?.find(
      (item) => item._id.toString() === categoryId,
    );
  }

  return {
    categoryDoc,
    subcategory,
    meta: {
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      subcategoryName: subcategory?.name || "",
    },
  };
};

const buildPublicFilter = async (query = {}) => {
  const filter = {
    isActive: true,
    status: "active",
  };

  if (query.category) {
    filter.categorySlug = query.category.trim().toLowerCase();
  }

  if (query.subcategory) {
    filter.subcategorySlug = query.subcategory.trim().toLowerCase();
  }

  if (query.isFeatured === "true") {
    filter.isFeatured = true;
  }

  if (query.isBestSeller === "true") {
    filter.isBestSeller = true;
  }

  if (query.isNewArrival === "true") {
    filter.isNewArrival = true;
  }

  const minPrice = parseNonNegativeNumber(query.minPrice);
  const maxPrice = parseNonNegativeNumber(query.maxPrice);

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const trimmedSearch = query.search?.trim();
  if (trimmedSearch) {
    Object.assign(filter, buildSubstringSearchFilter(trimmedSearch));
  }

  return filter;
};

const buildAdminFilter = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = validateStatus(query.status);
  }

  if (query.category) {
    if (mongoose.Types.ObjectId.isValid(query.category)) {
      filter.category = query.category;
    } else {
      filter.categorySlug = query.category.trim().toLowerCase();
    }
  }

  if (query.subcategory) {
    filter.subcategorySlug = query.subcategory.trim().toLowerCase();
  }

  const trimmedSearch = query.search?.trim();
  if (trimmedSearch) {
    Object.assign(filter, buildSubstringSearchFilter(trimmedSearch));
  }

  return filter;
};

const syncCategoryProductCount = async (categoryId) => {
  if (!categoryId) return;

  const count = await Product.countDocuments({
    category: categoryId,
    isActive: true,
    status: "active",
  });

  await Category.findByIdAndUpdate(categoryId, { productCount: count });
};

const normalizeWeightVariants = (variants = []) => {
  if (!variants.length) {
    return [];
  }

  const normalized = variants.map((variant) => ({
    weight: variant.weight.trim(),
    price: Number(variant.price),
    compareAtPrice: Number(variant.compareAtPrice ?? variant.originalPrice ?? 0),
    stock: Number(variant.stock),
    sku: variant.sku.trim().toUpperCase(),
    isDefault: Boolean(variant.isDefault),
  }));

  if (!normalized.some((variant) => variant.isDefault)) {
    normalized[0].isDefault = true;
  }

  return normalized;
};

const deriveTopLevelPricing = (variants, fallback = {}) => {
  const defaultVariant =
    variants.find((variant) => variant.isDefault) || variants[0];

  if (defaultVariant) {
    return {
      price: defaultVariant.price,
      compareAtPrice: defaultVariant.compareAtPrice,
      stock: variants.reduce((total, variant) => total + variant.stock, 0),
      sku: defaultVariant.sku,
      defaultWeight: defaultVariant.weight,
    };
  }

  return {
    price: Number(fallback.price || 0),
    compareAtPrice: Number(fallback.compareAtPrice || fallback.originalPrice || 0),
    stock: Number(fallback.stock || 0),
    sku: fallback.sku?.trim().toUpperCase(),
    defaultWeight: fallback.defaultWeight || "",
  };
};

const normalizeImages = (payload = {}) => {
  const images = [];

  if (payload.image) {
    images.push({ url: payload.image.trim(), publicId: payload.imagePublicId || "" });
  }

  (payload.secondaryImages || []).forEach((url, index) => {
    if (url?.trim()) {
      images.push({
        url: url.trim(),
        publicId: payload.secondaryImagePublicIds?.[index] || "",
      });
    }
  });

  if (payload.images?.length) {
    return payload.images.map((image) => ({
      url: image.url,
      publicId: image.publicId || "",
    }));
  }

  return images;
};

const buildProductWritePayload = async (payload, existingProduct = null) => {
  validateProductPayload(payload, { isUpdate: Boolean(existingProduct) });

  const { categoryDoc, subcategory, meta } = await resolveCategoryMeta({
    categoryId: payload.categoryId || existingProduct?.category,
    categorySlug: payload.categorySlug,
    subcategorySlug: payload.subcategorySlug,
  });

  let subcategoryRef = null;
  if (payload.subcategoryId) {
    subcategoryRef = categoryDoc.subcategories?.find(
      (item) => item._id.toString() === payload.subcategoryId,
    );

    if (!subcategoryRef) {
      const error = new Error("Subcategory not found in selected category");
      error.statusCode = 400;
      throw error;
    }
  } else if (subcategory) {
    subcategoryRef = subcategory;
  }

  const weightVariants = normalizeWeightVariants(
    payload.weightVariants || payload.weightOptions || existingProduct?.weightVariants || [],
  );
  const pricing = deriveTopLevelPricing(weightVariants, payload);
  const images = normalizeImages(payload);
  const status = payload.status || existingProduct?.status || "active";

  return {
    writeData: {
      name: payload.name?.trim() || existingProduct?.name,
      slug: payload.slug?.trim().toLowerCase() || existingProduct?.slug,
      shortDescription:
        payload.shortDescription?.trim() ?? existingProduct?.shortDescription ?? "",
      description:
        payload.fullDescription?.trim() ??
        payload.description?.trim() ??
        existingProduct?.description ??
        "",
      images: images.length ? images : existingProduct?.images || [],
      ...pricing,
      category: categoryDoc._id,
      categorySlug: categoryDoc.slug,
      subcategory: subcategoryRef?._id || null,
      subcategorySlug: subcategoryRef?.slug || "",
      weightVariants,
      ingredients: payload.ingredients ?? existingProduct?.ingredients ?? [],
      benefits: payload.benefits ?? existingProduct?.benefits ?? [],
      bestFor: payload.bestFor ?? existingProduct?.bestFor ?? [],
      storageInstructions:
        payload.storageInstructions ?? existingProduct?.storageInstructions ?? "",
      aromaProfile: payload.aromaProfile ?? existingProduct?.aromaProfile ?? "",
      spicinessLevel: payload.spicinessLevel ?? existingProduct?.spicinessLevel ?? 3,
      isFeatured: payload.isFeatured ?? existingProduct?.isFeatured ?? false,
      isBestSeller: payload.isBestSeller ?? existingProduct?.isBestSeller ?? false,
      isNewArrival: payload.isNewArrival ?? existingProduct?.isNewArrival ?? false,
      status,
      isActive: status === "active",
    },
    categoryMeta: meta,
    categoryId: categoryDoc._id,
  };
};

export const listPublicProducts = async (query = {}) => {
  const limit = parsePositiveInt(query.limit, 12, 50);
  const sort = validateSort(query.sort);
  const baseFilter = await buildPublicFilter(query);
  const cursorData = decodeCursor(query.cursor, sort);
  const cursorFilter = buildCursorFilter(cursorData, sort);
  const filter = cursorFilter.$or ? { $and: [baseFilter, cursorFilter] } : baseFilter;
  const sortOption = buildSortOption(sort);

  const products = await Product.find(filter)
    .select(PUBLIC_LIST_SELECT)
    .sort(sortOption)
    .limit(limit + 1)
    .lean();

  const hasNextPage = products.length > limit;
  const pageItems = hasNextPage ? products.slice(0, limit) : products;

  const categoryIds = [...new Set(pageItems.map((item) => item.category.toString()))];
  const categories = await Category.find({ _id: { $in: categoryIds } })
    .select("name slug")
    .lean();
  const categoryMap = Object.fromEntries(
    categories.map((category) => [category._id.toString(), category]),
  );

  const formattedProducts = pageItems.map((product) =>
    formatPublicListProduct(product, categoryMap[product.category.toString()] || {}),
  );

  const trimmedSearch = query.search?.trim();
  let total = null;
  if (trimmedSearch) {
    total = await Product.countDocuments(baseFilter);
  }

  return {
    products: formattedProducts,
    pagination: {
      limit,
      nextCursor: hasNextPage ? encodeCursor(pageItems[pageItems.length - 1], sort) : null,
      total,
    },
  };
};

export const getPublicProductBySlug = async (slug) => {
  const product = await Product.findOne({
    slug: slug.trim().toLowerCase(),
    isActive: true,
    status: "active",
  }).lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const category = await Category.findById(product.category).lean();
  const subcategory = category?.subcategories?.find(
    (item) => item._id.toString() === product.subcategory?.toString(),
  );

  return formatPublicDetailProduct(product, {
    name: category?.name || "",
    slug: category?.slug || "",
    subcategoryName: subcategory?.name || "",
  });
};

export const listAdminProducts = async (query = {}) => {
  const page = parsePositiveInt(query.page, 1, 100000);
  const limit = parsePositiveInt(query.limit, 20, 100);
  const skip = (page - 1) * limit;
  const sort = validateSort(query.sort, ADMIN_SORT_OPTIONS);
  const filter = await buildAdminFilter(query);
  const sortOption = buildSortOption(sort);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const categoryIds = [...new Set(products.map((item) => item.category.toString()))];
  const categories = await Category.find({ _id: { $in: categoryIds } }).lean();
  const categoryMap = Object.fromEntries(
    categories.map((category) => [category._id.toString(), category]),
  );

  return {
    products: products.map((product) => {
      const category = categoryMap[product.category.toString()];
      const subcategory = category?.subcategories?.find(
        (item) => item._id.toString() === product.subcategory?.toString(),
      );

      return formatAdminProduct(product, {
        name: category?.name || "",
        slug: category?.slug || "",
        subcategoryName: subcategory?.name || "",
      });
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getAdminProductById = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId).lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const category = await Category.findById(product.category).lean();
  const subcategory = category?.subcategories?.find(
    (item) => item._id.toString() === product.subcategory?.toString(),
  );

  return formatAdminProduct(product, {
    name: category?.name || "",
    slug: category?.slug || "",
    subcategoryName: subcategory?.name || "",
  });
};

export const createProduct = async (payload) => {
  const { writeData, categoryMeta, categoryId } = await buildProductWritePayload(payload);

  const existingSlug = await Product.findOne({ slug: writeData.slug });
  if (existingSlug) {
    const error = new Error("A product with this slug already exists");
    error.statusCode = 409;
    throw error;
  }

  const existingSku = await Product.findOne({ sku: writeData.sku });
  if (existingSku) {
    const error = new Error("A product with this SKU already exists");
    error.statusCode = 409;
    throw error;
  }

  const product = await Product.create(writeData);
  await syncCategoryProductCount(categoryId);

  return formatAdminProduct(product.toObject(), categoryMeta);
};

export const updateProduct = async (productId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const previousCategoryId = existingProduct.category.toString();
  const { writeData, categoryMeta, categoryId } = await buildProductWritePayload(
    payload,
    existingProduct.toObject(),
  );

  if (writeData.slug !== existingProduct.slug) {
    const slugExists = await Product.findOne({
      slug: writeData.slug,
      _id: { $ne: existingProduct._id },
    });
    if (slugExists) {
      const error = new Error("A product with this slug already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  if (writeData.sku !== existingProduct.sku) {
    const skuExists = await Product.findOne({
      sku: writeData.sku,
      _id: { $ne: existingProduct._id },
    });
    if (skuExists) {
      const error = new Error("A product with this SKU already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  Object.assign(existingProduct, writeData);
  await existingProduct.save();

  await syncCategoryProductCount(previousCategoryId);
  if (categoryId.toString() !== previousCategoryId) {
    await syncCategoryProductCount(categoryId);
  }

  return formatAdminProduct(existingProduct.toObject(), categoryMeta);
};

export const updateProductStatus = async (productId, status) => {
  validateStatus(status);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  product.status = status;
  product.isActive = status === "active";
  await product.save();
  await syncCategoryProductCount(product.category);

  const category = await Category.findById(product.category).lean();
  return formatAdminProduct(product.toObject(), {
    name: category?.name || "",
    slug: category?.slug || "",
  });
};

export const deleteProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await syncCategoryProductCount(product.category);
  return true;
};
