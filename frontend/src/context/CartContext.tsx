import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import { CartItem, Product } from "../types";
import {
  addToCart as addToCartApi,
  applyCoupon as applyCouponApi,
  clearCart as clearCartApi,
  getCart,
  mapCartSummaryToItems,
  mergeGuestCart,
  removeCartItem as removeCartItemApi,
  removeCoupon as removeCouponApi,
  updateCartItem as updateCartItemApi,
  type CartSummary,
} from "../lib/cartApi";
import { ApiError } from "../lib/apiClient";
import { getVariantPricing } from "../lib/productPricing";

const GUEST_CART_KEY = "enu_guest_cart";

interface GuestCartStoredItem {
  productId: string;
  weight: string;
  quantity: number;
  product: Product;
}

interface CartContextType {
  cartItems: CartItem[];
  subtotal: number;
  totalItems: number;
  appliedCoupon: CartSummary["coupon"];
  discount: number;
  total: number;
  isLoading: boolean;
  isMutating: boolean;
  isCouponLoading: boolean;
  couponError: string | null;
  error: string | null;
  addToCart: (product: Product, weight?: string, qty?: number) => Promise<void>;
  updateQuantity: (productId: string, weight: string, newQty: number) => Promise<void>;
  removeItem: (productId: string, weight: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const readGuestCart = (): GuestCartStoredItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as GuestCartStoredItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items: GuestCartStoredItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!items.length) {
    localStorage.removeItem(GUEST_CART_KEY);
    return;
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const mapGuestItemsToCartItems = (items: GuestCartStoredItem[]): CartItem[] =>
  items.map((item) => {
    const { price, originalPrice } = getVariantPricing(item.product, item.weight);

    return {
      product: item.product,
      selectedWeight: item.weight,
      quantity: item.quantity,
      unitPrice: price,
      subtotal: price * item.quantity,
      status: "available",
      isAvailable: true,
      statusMessage: "",
      stock: item.product.weightVariants?.find(
        (variant) => variant.weight === item.weight,
      )?.inStock
        ? 999
        : item.product.inStock
          ? 999
          : 0,
    };
  });

const calculateGuestSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + (item.unitPrice || 0) * item.quantity, 0);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<CartSummary["coupon"]>(null);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutationLockRef = useRef(false);
  const previousAuthRef = useRef<boolean | null>(null);

  const applyServerCart = useCallback((cart: CartSummary) => {
    setCartItems(mapCartSummaryToItems(cart));
    setSubtotal(cart.subtotal);
    setTotalItems(cart.totalItems);
    setAppliedCoupon(cart.coupon ?? null);
    setDiscount(cart.discount ?? 0);
    setTotal(cart.total ?? cart.subtotal);
  }, []);

  const applyGuestCart = useCallback((guestItems: GuestCartStoredItem[]) => {
    const mapped = mapGuestItemsToCartItems(guestItems);
    const guestSubtotal = calculateGuestSubtotal(mapped);
    setCartItems(mapped);
    setSubtotal(guestSubtotal);
    setTotalItems(mapped.reduce((sum, item) => sum + item.quantity, 0));
    setAppliedCoupon(null);
    setDiscount(0);
    setTotal(guestSubtotal);
    setCouponError(null);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      applyGuestCart(readGuestCart());
      return;
    }

    const cart = await getCart();
    applyServerCart(cart);
  }, [applyGuestCart, applyServerCart, isAuthenticated]);

  const mergeGuestCartOnLogin = useCallback(async () => {
    const guestItems = readGuestCart();

    if (!guestItems.length) {
      await refreshCart();
      return;
    }

    const result = await mergeGuestCart(
      guestItems.map((item) => ({
        productId: item.productId,
        weight: item.weight,
        quantity: item.quantity,
      })),
    );

    writeGuestCart([]);
    applyServerCart(result.cart);

    if (result.mergeWarnings?.length) {
      setError(result.mergeWarnings.map((warning) => warning.message).join(" "));
    }
  }, [applyServerCart, refreshCart]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const initializeCart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const wasAuthenticated = previousAuthRef.current;
        previousAuthRef.current = isAuthenticated;

        if (!isAuthenticated) {
          if (wasAuthenticated === true) {
            applyGuestCart([]);
          } else {
            applyGuestCart(readGuestCart());
          }
          return;
        }

        if (wasAuthenticated === false || wasAuthenticated === null) {
          await mergeGuestCartOnLogin();
        } else {
          await refreshCart();
        }
      } catch (cartError) {
        setError(
          cartError instanceof ApiError
            ? cartError.message
            : cartError instanceof Error
              ? cartError.message
              : "Failed to load cart",
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [
    applyGuestCart,
    authLoading,
    isAuthenticated,
    mergeGuestCartOnLogin,
    refreshCart,
    token,
  ]);

  const withMutationLock = useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T | undefined> => {
      if (mutationLockRef.current) {
        return undefined;
      }

      mutationLockRef.current = true;
      setIsMutating(true);
      setError(null);

      try {
        return await operation();
      } catch (mutationError) {
        setError(
          mutationError instanceof ApiError
            ? mutationError.message
            : mutationError instanceof Error
              ? mutationError.message
              : "Cart update failed",
        );
        throw mutationError;
      } finally {
        mutationLockRef.current = false;
        setIsMutating(false);
      }
    },
    [],
  );

  const addToCart = useCallback(
    async (product: Product, weight?: string, qty = 1) => {
      const targetWeight = weight || product.defaultWeight || product.weightOptions[0];
      if (!targetWeight) {
        throw new Error("Please select a pack size before adding to cart");
      }

      await withMutationLock(async () => {
        if (!isAuthenticated) {
          const guestItems = readGuestCart();
          const existingIndex = guestItems.findIndex(
            (item) =>
              item.productId === product.id &&
              item.weight.trim().toLowerCase() === targetWeight.trim().toLowerCase(),
          );

          if (existingIndex > -1) {
            guestItems[existingIndex] = {
              ...guestItems[existingIndex],
              quantity: guestItems[existingIndex].quantity + qty,
              product,
            };
          } else {
            guestItems.push({
              productId: product.id,
              weight: targetWeight,
              quantity: qty,
              product,
            });
          }

          writeGuestCart(guestItems);
          applyGuestCart(guestItems);
          return;
        }

        const cart = await addToCartApi({
          productId: product.id,
          weight: targetWeight,
          quantity: qty,
        });

        applyServerCart(cart);
      });
    },
    [applyGuestCart, applyServerCart, isAuthenticated, withMutationLock],
  );

  const updateQuantity = useCallback(
    async (productId: string, weight: string, newQty: number) => {
      if (newQty <= 0) {
        const previousItems = cartItems;
        setCartItems((current) =>
          current.filter(
            (item) => !(item.product.id === productId && item.selectedWeight === weight),
          ),
        );

        try {
          await withMutationLock(async () => {
            if (!isAuthenticated) {
              const guestItems = readGuestCart().filter(
                (item) => !(item.productId === productId && item.weight === weight),
              );
              writeGuestCart(guestItems);
              applyGuestCart(guestItems);
              return;
            }

            const targetItem = previousItems.find(
              (item) => item.product.id === productId && item.selectedWeight === weight,
            );

            if (!targetItem?.id) {
              throw new Error("Cart item not found");
            }

            const cart = await removeCartItemApi(targetItem.id);
            applyServerCart(cart);
          });
        } catch {
          setCartItems(previousItems);
        }
        return;
      }

      const previousItems = cartItems;

      setCartItems((current) =>
        current.map((item) =>
          item.product.id === productId && item.selectedWeight === weight
            ? { ...item, quantity: newQty }
            : item,
        ),
      );

      try {
        await withMutationLock(async () => {
          if (!isAuthenticated) {
            const guestItems = readGuestCart().map((item) =>
              item.productId === productId && item.weight === weight
                ? { ...item, quantity: newQty }
                : item,
            );
            writeGuestCart(guestItems);
            applyGuestCart(guestItems);
            return;
          }

          const targetItem = previousItems.find(
            (item) => item.product.id === productId && item.selectedWeight === weight,
          );

          if (!targetItem?.id) {
            throw new Error("Cart item not found");
          }

          const cart = await updateCartItemApi(targetItem.id, newQty);
          applyServerCart(cart);
        });
      } catch {
        setCartItems(previousItems);
      }
    },
    [applyGuestCart, applyServerCart, cartItems, isAuthenticated, withMutationLock],
  );

  const removeItem = useCallback(
    async (productId: string, weight: string) => {
      const previousItems = cartItems;
      setCartItems((current) =>
        current.filter(
          (item) => !(item.product.id === productId && item.selectedWeight === weight),
        ),
      );

      try {
        await withMutationLock(async () => {
          if (!isAuthenticated) {
            const guestItems = readGuestCart().filter(
              (item) => !(item.productId === productId && item.weight === weight),
            );
            writeGuestCart(guestItems);
            applyGuestCart(guestItems);
            return;
          }

          const targetItem = previousItems.find(
            (item) => item.product.id === productId && item.selectedWeight === weight,
          );

          if (!targetItem?.id) {
            throw new Error("Cart item not found");
          }

          const cart = await removeCartItemApi(targetItem.id);
          applyServerCart(cart);
        });
      } catch {
        setCartItems(previousItems);
      }
    },
    [applyGuestCart, applyServerCart, cartItems, isAuthenticated, withMutationLock],
  );

  const clearCart = useCallback(async () => {
    await withMutationLock(async () => {
      if (!isAuthenticated) {
        writeGuestCart([]);
        applyGuestCart([]);
        return;
      }

      const cart = await clearCartApi();
      applyServerCart(
        mapCartSummaryToItems(cart),
        cart.subtotal,
        cart.totalItems,
      );
    });
  }, [applyGuestCart, applyServerCart, isAuthenticated, withMutationLock]);

  const applyCoupon = useCallback(
    async (code: string) => {
      if (!isAuthenticated) {
        setCouponError("Please sign in to apply a coupon");
        return;
      }

      setIsCouponLoading(true);
      setCouponError(null);

      try {
        const cart = await applyCouponApi(code.trim());
        applyServerCart(cart);
      } catch (couponApplyError) {
        setCouponError(
          couponApplyError instanceof ApiError
            ? couponApplyError.message
            : couponApplyError instanceof Error
              ? couponApplyError.message
              : "Failed to apply coupon",
        );
        throw couponApplyError;
      } finally {
        setIsCouponLoading(false);
      }
    },
    [applyServerCart, isAuthenticated],
  );

  const removeCoupon = useCallback(async () => {
    if (!isAuthenticated) {
      setAppliedCoupon(null);
      setDiscount(0);
      setTotal(subtotal);
      setCouponError(null);
      return;
    }

    setIsCouponLoading(true);
    setCouponError(null);

    try {
      const cart = await removeCouponApi();
      applyServerCart(cart);
    } catch (couponRemoveError) {
      setCouponError(
        couponRemoveError instanceof ApiError
          ? couponRemoveError.message
          : couponRemoveError instanceof Error
            ? couponRemoveError.message
            : "Failed to remove coupon",
      );
      throw couponRemoveError;
    } finally {
      setIsCouponLoading(false);
    }
  }, [applyServerCart, isAuthenticated, subtotal]);

  const value = useMemo(
    () => ({
      cartItems,
      subtotal,
      totalItems,
      appliedCoupon,
      discount,
      total,
      isLoading,
      isMutating,
      isCouponLoading,
      couponError,
      error,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      refreshCart,
    }),
    [
      addToCart,
      appliedCoupon,
      applyCoupon,
      cartItems,
      clearCart,
      couponError,
      discount,
      error,
      isCouponLoading,
      isLoading,
      isMutating,
      refreshCart,
      removeCoupon,
      removeItem,
      subtotal,
      total,
      totalItems,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
