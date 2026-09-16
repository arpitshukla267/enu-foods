import { Product, ProductWeightVariant } from "../types";

const normalizeWeight = (weight: string) => weight.trim().toLowerCase();

export const getProductWeightVariants = (product: Product): ProductWeightVariant[] => {
  if (product.weightVariants?.length) {
    return product.weightVariants;
  }

  return product.weightOptions.map((weight) => ({
    weight,
    price: product.price,
    originalPrice: product.originalPrice,
    inStock: product.inStock ?? true,
  }));
};

export const getVariantByWeight = (
  product: Product,
  weight?: string,
): ProductWeightVariant | undefined => {
  if (!weight) {
    return getProductWeightVariants(product).find(
      (variant) => normalizeWeight(variant.weight) === normalizeWeight(product.defaultWeight),
    );
  }

  return getProductWeightVariants(product).find(
    (variant) => normalizeWeight(variant.weight) === normalizeWeight(weight),
  );
};

export const isVariantInStock = (product: Product, weight?: string): boolean => {
  const variant = getVariantByWeight(product, weight || product.defaultWeight);

  if (variant?.inStock !== undefined) {
    return variant.inStock;
  }

  if (variant?.stock !== undefined) {
    return variant.stock > 0;
  }

  return product.inStock ?? true;
};

export const getPreferredWeight = (product: Product): string => {
  const variants = getProductWeightVariants(product);

  if (!variants.length) {
    return product.defaultWeight || product.weightOptions[0] || "";
  }

  const defaultVariant = variants.find(
    (variant) =>
      normalizeWeight(variant.weight) === normalizeWeight(product.defaultWeight),
  );

  if (defaultVariant && isVariantInStock(product, defaultVariant.weight)) {
    return defaultVariant.weight;
  }

  const firstInStock = variants.find((variant) =>
    isVariantInStock(product, variant.weight),
  );

  return (
    firstInStock?.weight ||
    defaultVariant?.weight ||
    variants[0]?.weight ||
    product.defaultWeight ||
    ""
  );
};

export const getVariantPricing = (
  product: Product,
  weight?: string,
): { price: number; originalPrice: number } => {
  const variant = getVariantByWeight(product, weight || product.defaultWeight);

  return {
    price: variant?.price ?? product.price,
    originalPrice: variant?.originalPrice ?? product.originalPrice,
  };
};

export const getVariantDiscountPercent = (
  product: Product,
  weight?: string,
): number => {
  const { price, originalPrice } = getVariantPricing(product, weight);

  if (originalPrice <= price) {
    return 0;
  }

  return Math.round((1 - price / originalPrice) * 100);
};
