import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import {
  fromPaise,
  normalizeWeight,
  toPaise,
  validateObjectId,
} from "./cart.validation.js";
import {
  applyCouponCodeToCartDocument,
  removeCouponFromCartDocument,
  resolveCartCoupon,
} from "../coupon/coupon.service.js";

const getThumbnailUrl = (images = []) => images[0]?.url || "";

const findVariant = (product, weight) => {
  const normalizedWeight = normalizeWeight(weight);
  return (product.weightVariants || []).find(
    (variant) => normalizeWeight(variant.weight) === normalizedWeight,
  );
};

const isProductPurchasable = (product) =>
  Boolean(product?.isActive) && product?.status === "active";

const resolveItemStatus = ({ product, variant, quantity }) => {
  if (!product) {
    return {
      status: "inactive",
      isAvailable: false,
      message: "Product is no longer available",
      availableStock: 0,
    };
  }

  if (!isProductPurchasable(product)) {
    return {
      status: "inactive",
      isAvailable: false,
      message: "Product is currently unavailable",
      availableStock: 0,
    };
  }

  if (!variant) {
    return {
      status: "variant_unavailable",
      isAvailable: false,
      message: "Selected pack size is no longer available",
      availableStock: 0,
    };
  }

  const availableStock = Number(variant.stock || 0);

  if (availableStock <= 0) {
    return {
      status: "out_of_stock",
      isAvailable: false,
      message: "This pack size is out of stock",
      availableStock: 0,
    };
  }

  if (quantity > availableStock) {
    return {
      status: "quantity_exceeded",
      isAvailable: false,
      message: `Only ${availableStock} unit(s) available`,
      availableStock,
    };
  }

  return {
    status: "available",
    isAvailable: true,
    message: "",
    availableStock,
  };
};

const buildWeightVariantsForClient = (product) =>
  (product?.weightVariants || []).map((variant) => ({
    weight: variant.weight,
    price: variant.price,
    originalPrice: variant.compareAtPrice || variant.price,
    inStock: Number(variant.stock) > 0,
  }));

const buildProductSnapshot = (product, variant) => ({
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  category: product.categorySlug || "",
  categorySlug: product.categorySlug || "",
  image: getThumbnailUrl(product.images),
  defaultWeight: product.defaultWeight || variant.weight,
  weightOptions: (product.weightVariants || []).map((entry) => entry.weight),
  weightVariants: buildWeightVariantsForClient(product),
  price: variant.price,
  originalPrice: variant.compareAtPrice || variant.price,
  shortDescription: product.shortDescription || "",
  fullDescription: product.description || "",
  ingredients: product.ingredients || [],
  benefits: product.benefits || [],
  storageInstructions: product.storageInstructions || "",
  aromaProfile: product.aromaProfile || "",
  spicinessLevel: product.spicinessLevel || 3,
  bestFor: product.bestFor || [],
  inStock: Number(variant.stock) > 0,
});

const formatCartItem = (item, productMap) => {
  const product = productMap[item.product.toString()];
  const variant = product ? findVariant(product, item.weight) : null;
  const quantity = Number(item.quantity);
  const currentUnitPricePaise = variant ? toPaise(variant.price) : item.unitPricePaise;
  const subtotalPaise = currentUnitPricePaise * quantity;
  const availability = resolveItemStatus({ product, variant, quantity });

  return {
    itemId: item._id.toString(),
    productId: item.product.toString(),
    name: product?.name || item.productName,
    slug: product?.slug || item.productSlug,
    image: getThumbnailUrl(product?.images) || item.image,
    weight: item.weight,
    quantity,
    unitPrice: fromPaise(currentUnitPricePaise),
    unitPricePaise: currentUnitPricePaise,
    subtotal: fromPaise(subtotalPaise),
    subtotalPaise,
    stock: availability.availableStock,
    status: availability.status,
    isAvailable: availability.isAvailable,
    statusMessage: availability.message,
    product: product ? buildProductSnapshot(product, variant) : null,
  };
};

const summarizeCart = (formattedItems) => {
  const subtotalPaise = formattedItems.reduce(
    (total, item) => total + (item.isAvailable ? item.subtotalPaise : 0),
    0,
  );
  const totalItems = formattedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return {
    items: formattedItems,
    subtotal: fromPaise(subtotalPaise),
    subtotalPaise,
    totalItems,
  };
};

const finalizeCartResponse = async (cart, userId, formattedItems, productMap) => {
  const baseSummary = summarizeCart(formattedItems);
  let couponResult = await resolveCartCoupon({
    appliedCouponCode: cart.appliedCouponCode,
    userId,
    formattedItems,
    productMap,
    cartSubtotalPaise: baseSummary.subtotalPaise,
  });

  if (couponResult.shouldClearCoupon && cart.appliedCouponCode) {
    cart.appliedCouponCode = "";
    await cart.save();
    couponResult = await resolveCartCoupon({
      appliedCouponCode: "",
      userId,
      formattedItems,
      productMap,
      cartSubtotalPaise: baseSummary.subtotalPaise,
    });
  }

  return {
    ...baseSummary,
    coupon: couponResult.coupon,
    discount: couponResult.discount,
    discountPaise: couponResult.discountPaise,
    total: couponResult.total,
    totalPaise: couponResult.totalPaise,
  };
};

const buildCartForUser = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const productMap = await loadProductsForCart(cart);
  await syncCartSnapshots(cart, productMap);

  const formattedItems = cart.items.map((item) => formatCartItem(item, productMap));
  return finalizeCartResponse(cart, userId, formattedItems, productMap);
};

const loadProductsForCart = async (cart) => {
  const productIds = [...new Set(cart.items.map((item) => item.product.toString()))];

  if (!productIds.length) {
    return {};
  }

  const products = await Product.find({ _id: { $in: productIds } }).lean();
  return Object.fromEntries(products.map((product) => [product._id.toString(), product]));
};

const syncCartSnapshots = async (cart, productMap) => {
  let changed = false;

  cart.items.forEach((item) => {
    const product = productMap[item.product.toString()];
    const variant = product ? findVariant(product, item.weight) : null;

    if (product) {
      const nextName = product.name;
      const nextSlug = product.slug;
      const nextImage = getThumbnailUrl(product.images);
      const nextPricePaise = variant ? toPaise(variant.price) : item.unitPricePaise;

      if (
        item.productName !== nextName ||
        item.productSlug !== nextSlug ||
        item.image !== nextImage ||
        item.unitPricePaise !== nextPricePaise
      ) {
        item.productName = nextName;
        item.productSlug = nextSlug;
        item.image = nextImage;
        item.unitPricePaise = nextPricePaise;
        changed = true;
      }
    }
  });

  if (changed) {
    await cart.save();
  }
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const loadValidatedProductVariant = async (productId, weight) => {
  validateObjectId(productId, "productId");

  const product = await Product.findById(productId).lean();
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isProductPurchasable(product)) {
    const error = new Error("Product is not available for purchase");
    error.statusCode = 400;
    throw error;
  }

  const variant = findVariant(product, weight);
  if (!variant) {
    const error = new Error("Selected pack size is not available for this product");
    error.statusCode = 400;
    throw error;
  }

  return { product, variant };
};

const assertStockAvailable = (variant, quantity) => {
  const availableStock = Number(variant.stock || 0);
  if (availableStock <= 0) {
    const error = new Error("Selected pack size is out of stock");
    error.statusCode = 400;
    throw error;
  }

  if (quantity > availableStock) {
    const error = new Error(`Only ${availableStock} unit(s) available in stock`);
    error.statusCode = 400;
    throw error;
  }
};

export const getCartForUser = async (userId) => buildCartForUser(userId);

export const applyCouponToCart = async (userId, code) => {
  const cart = await getOrCreateCart(userId);
  const productMap = await loadProductsForCart(cart);
  await syncCartSnapshots(cart, productMap);

  const formattedItems = cart.items.map((item) => formatCartItem(item, productMap));
  const baseSummary = summarizeCart(formattedItems);

  await applyCouponCodeToCartDocument({
    cart,
    userId,
    code,
    formattedItems,
    productMap,
    cartSubtotalPaise: baseSummary.subtotalPaise,
  });

  return buildCartForUser(userId);
};

export const removeCouponFromCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await removeCouponFromCartDocument(cart);
  return buildCartForUser(userId);
};

export const addItemToCart = async (userId, payload) => {
  const { product, variant } = await loadValidatedProductVariant(
    payload.productId,
    payload.weight,
  );

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === payload.productId &&
      normalizeWeight(item.weight) === normalizeWeight(payload.weight),
  );

  const nextQuantity = existingItem
    ? existingItem.quantity + payload.quantity
    : payload.quantity;

  assertStockAvailable(variant, nextQuantity);

  if (existingItem) {
    existingItem.quantity = nextQuantity;
    existingItem.unitPricePaise = toPaise(variant.price);
    existingItem.productName = product.name;
    existingItem.productSlug = product.slug;
    existingItem.image = getThumbnailUrl(product.images);
  } else {
    cart.items.push({
      product: product._id,
      weight: variant.weight,
      quantity: payload.quantity,
      unitPricePaise: toPaise(variant.price),
      productName: product.name,
      productSlug: product.slug,
      image: getThumbnailUrl(product.images),
    });
  }

  await cart.save();
  return getCartForUser(userId);
};

export const updateCartItemQuantity = async (userId, itemId, payload) => {
  validateObjectId(itemId, "itemId");

  const cart = await getOrCreateCart(userId);
  const cartItem = cart.items.id(itemId);

  if (!cartItem) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  const { product, variant } = await loadValidatedProductVariant(
    cartItem.product.toString(),
    cartItem.weight,
  );

  assertStockAvailable(variant, payload.quantity);

  cartItem.quantity = payload.quantity;
  cartItem.unitPricePaise = toPaise(variant.price);
  cartItem.productName = product.name;
  cartItem.productSlug = product.slug;
  cartItem.image = getThumbnailUrl(product.images);

  await cart.save();
  return getCartForUser(userId);
};

export const removeCartItem = async (userId, itemId) => {
  validateObjectId(itemId, "itemId");

  const cart = await getOrCreateCart(userId);
  const cartItem = cart.items.id(itemId);

  if (!cartItem) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  cartItem.deleteOne();
  await cart.save();
  return getCartForUser(userId);
};

export const clearCartForUser = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.appliedCouponCode = "";
  await cart.save();

  return {
    items: [],
    subtotal: 0,
    subtotalPaise: 0,
    totalItems: 0,
    coupon: null,
    discount: 0,
    discountPaise: 0,
    total: 0,
    totalPaise: 0,
  };
};

export const mergeGuestItems = async (userId, guestItems = []) => {
  const cart = await getOrCreateCart(userId);
  const productIds = [
    ...new Set([
      ...cart.items.map((item) => item.product.toString()),
      ...guestItems.map((item) => item.productId),
    ]),
  ];

  const products = productIds.length
    ? await Product.find({ _id: { $in: productIds } }).lean()
    : [];
  const productMap = Object.fromEntries(
    products.map((product) => [product._id.toString(), product]),
  );

  const mergeWarnings = [];

  guestItems.forEach((guestItem) => {
    const product = productMap[guestItem.productId];
    const variant = product ? findVariant(product, guestItem.weight) : null;
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === guestItem.productId &&
        normalizeWeight(item.weight) === normalizeWeight(guestItem.weight),
    );

    if (!product || !isProductPurchasable(product) || !variant) {
      mergeWarnings.push({
        productId: guestItem.productId,
        weight: guestItem.weight,
        message: "Item could not be merged because it is no longer available",
      });
      return;
    }

    const availableStock = Number(variant.stock || 0);
    const requestedQuantity = existingItem
      ? existingItem.quantity + guestItem.quantity
      : guestItem.quantity;
    const finalQuantity = Math.min(requestedQuantity, availableStock);

    if (finalQuantity <= 0) {
      mergeWarnings.push({
        productId: guestItem.productId,
        weight: guestItem.weight,
        message: "Item is out of stock and was not merged",
      });
      return;
    }

    if (finalQuantity < requestedQuantity) {
      mergeWarnings.push({
        productId: guestItem.productId,
        weight: guestItem.weight,
        message: `Quantity adjusted to ${finalQuantity} due to limited stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = finalQuantity;
      existingItem.unitPricePaise = toPaise(variant.price);
      existingItem.productName = product.name;
      existingItem.productSlug = product.slug;
      existingItem.image = getThumbnailUrl(product.images);
      existingItem.weight = variant.weight;
      return;
    }

    cart.items.push({
      product: product._id,
      weight: variant.weight,
      quantity: finalQuantity,
      unitPricePaise: toPaise(variant.price),
      productName: product.name,
      productSlug: product.slug,
      image: getThumbnailUrl(product.images),
    });
  });

  await cart.save();
  const cartSummary = await getCartForUser(userId);

  return {
    ...cartSummary,
    mergeWarnings,
  };
};

export const assertCartBelongsToUser = (cart, userId) => {
  if (!cart || cart.user.toString() !== userId.toString()) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }
};
