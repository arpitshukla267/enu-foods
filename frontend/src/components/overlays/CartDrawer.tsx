import React, { useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "../../types";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Gift,
  ArrowRight,
  Tag,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useProductBatch } from "../../hooks/useProductBatch";
import { getVariantPricing } from "../../lib/productPricing";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal?: number;
  total?: number;
  discount?: number;
  appliedCoupon?: { code: string; discount: number } | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  isMutating?: boolean;
  isCouponLoading?: boolean;
  couponError?: string | null;
  error?: string | null;
  onUpdateQuantity: (productId: string, weight: string, newQty: number) => void | Promise<void>;
  onRemoveItem: (productId: string, weight: string) => void | Promise<void>;
  onAddToCart: (product: Product, weight?: string, qty?: number) => void | Promise<void>;
  onApplyCoupon: (code: string) => void | Promise<void>;
  onRemoveCoupon: () => void | Promise<void>;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal: serverSubtotal,
  total: serverTotal,
  discount: serverDiscount = 0,
  appliedCoupon = null,
  isAuthenticated = false,
  isLoading = false,
  isMutating = false,
  isCouponLoading = false,
  couponError = null,
  error = null,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const computedSubtotal = cartItems.reduce((acc, item) => {
    const { price } = getVariantPricing(item.product, item.selectedWeight);
    return acc + (item.unitPrice ?? price) * item.quantity;
  }, 0);
  const subtotal = serverSubtotal ?? computedSubtotal;
  const couponDiscount = serverDiscount;
  const finalTotal = serverTotal ?? Math.max(0, subtotal - couponDiscount);
  
  // Free Gift Threshold (₹999)
  const freeGiftGoal = 999;
  const remainingForGift = Math.max(0, freeGiftGoal - subtotal);
  const giftProgress = Math.min(100, (subtotal / freeGiftGoal) * 100);
  
  const originalSubtotal = cartItems.reduce((acc, item) => {
    const { originalPrice } = getVariantPricing(item.product, item.selectedWeight);
    return acc + originalPrice * item.quantity;
  }, 0);
  
  const totalSavings = originalSubtotal - subtotal + couponDiscount;
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      return;
    }

    try {
      await onApplyCoupon(couponCode.trim());
      setCouponCode("");
    } catch {
      // Error surfaced via couponError prop
    }
  };

  const { products: suggestedProducts } = useProductBatch({
    isFeatured: true,
    limit: 6,
    sort: "newest",
  });

  const cartProductIds = cartItems.map((item) => item.product.id);
  const hasUnavailableItems = cartItems.some((item) => item.isAvailable === false);
  const crossSellProducts = useMemo(
    () => suggestedProducts.filter((product) => !cartProductIds.includes(product.id)).slice(0, 3),
    [suggestedProducts, cartProductIds],
  );

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-end text-left transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel from Right Side */}
      <div
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-hidden text-left transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#284C38] text-white flex items-center justify-between border-b border-[#D6A146]/30 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D6A146]" />
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              YOUR CART ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Incentive Banner */}
        <div className="bg-[#1E3A2B] text-white px-4 py-2.5 text-xs font-btn flex items-center justify-between border-b border-[#D6A146]/20 shrink-0">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#D6A146] shrink-0" />
            <span className="font-semibold text-[#D6A146]">
              Yay! You've unlocked extra discounts!
            </span>
          </div>
          <span className="bg-[#D6A146] text-[#1D1D1D] px-2 py-0.5 rounded text-[10px] font-semibold">
            100% PURE
          </span>
        </div>

        {/* Gift Milestone Progress Bar */}
        <div className="bg-[#F7F5EF] p-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between text-xs font-btn mb-1.5 font-semibold text-gray-800">
            {remainingForGift > 0 ? (
              <span>
                Add items worth{" "}
                <span className="text-[#284C38]">₹{remainingForGift}</span> for
                a Mystery Gift 🎁
              </span>
            ) : (
              <span className="text-[#284C38] flex items-center gap-1">
                <Check className="w-4 h-4 text-[#284C38]" /> Mystery Gift
                Unlocked! 🎁
              </span>
            )}
            <span className="text-gray-600 font-semibold">Goal: ₹999</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D6A146] to-[#284C38] transition-all duration-300 rounded-full"
              style={{ width: `${giftProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
          {error && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#284C38]" />
              <p className="text-sm font-medium">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-800">
                Your cart is empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Discover authentic cold-ground masalas and spices to add rich
                flavor to your cooking.
              </p>
              <button
                onClick={onClose}
                className="bg-[#284C38] text-white text-xs font-semibold font-btn px-6 py-2.5 rounded-full"
              >
                Browse Spices
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const { price, originalPrice } = getVariantPricing(
                item.product,
                item.selectedWeight,
              );
              const unitPrice = item.unitPrice ?? price;
              const isUnavailable = item.isAvailable === false;

              return (
              <div
                key={item.id || `${item.product.id}-${item.selectedWeight}-${index}`}
                className={`pt-3 first:pt-0 flex gap-3 items-center ${isUnavailable ? "opacity-70" : ""}`}
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-sm font-semibold text-[#1D1D1D] truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-xs text-gray-500 font-body">
                    Pack:{" "}
                    <span className="font-bold text-gray-700">
                      {item.selectedWeight}
                    </span>
                  </div>

                  {item.statusMessage && (
                    <p className="text-[11px] text-amber-700 mt-1">{item.statusMessage}</p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-sm text-[#284C38]">
                      ₹{unitPrice}
                    </span>
                    {originalPrice > unitPrice && (
                      <span className="text-xs text-gray-400 font-semibold line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Buttons */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      disabled={isMutating || isUnavailable}
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          item.selectedWeight,
                          item.quantity - 1,
                        )
                      }
                      className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-semibold text-gray-800 font-btn">
                      {item.quantity}
                    </span>
                    <button
                      disabled={
                        isMutating ||
                        isUnavailable ||
                        (item.stock !== undefined && item.quantity >= item.stock)
                      }
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          item.selectedWeight,
                          item.quantity + 1,
                        )
                      }
                      className="p-1 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      onRemoveItem(item.product.id, item.selectedWeight)
                    }
                    className="text-red-500 hover:text-red-700 p-1 text-xs font-semibold"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              );
            })
          )}

          {/* Cross-sell section */}
          {cartItems.length > 0 && crossSellProducts.length > 0 && (
            <div className="pt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#284C38] font-btn mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D6A146]" />
                <span>Pure Goodness Add-ons!</span>
              </div>
              <div className="space-y-2">
                {crossSellProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#F7F5EF] p-2.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <div className="text-xs font-medium text-[#1D1D1D] truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-[#284C38] font-medium">
                          ₹{prod.price}{" "}
                          <span className="text-gray-400 font-normal line-through text-[10px]">
                            ₹{prod.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-[11px] font-medium font-btn px-3 py-1.5 rounded-lg shrink-0"
                    >
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white space-y-3 shrink-0">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!isAuthenticated || isCouponLoading || Boolean(appliedCoupon)}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#284C38] uppercase disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!isAuthenticated || isCouponLoading || !couponCode.trim() || Boolean(appliedCoupon)}
                className="bg-[#1E3A2B] text-[#D6A146] text-xs font-semibold px-4 py-2 rounded-lg font-btn hover:bg-[#284C38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isCouponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Apply
              </button>
            </form>

            {!isAuthenticated && (
              <p className="text-[11px] text-gray-500">Sign in to apply coupon codes.</p>
            )}

            {couponError && (
              <div className="text-xs text-red-700 bg-red-50 p-2 rounded-lg font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{couponError}</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center justify-between">
                <span>
                  Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})
                </span>
                <button
                  onClick={() => onRemoveCoupon()}
                  disabled={isCouponLoading}
                  className="text-gray-500 font-semibold disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Savings Badge */}
            {totalSavings > 0 && (
              <div className="text-xs text-center font-bold text-[#284C38] bg-[#284C38]/10 py-1.5 rounded-lg">
                🎉 Total Savings on this order: ₹{totalSavings}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs text-gray-600 font-body">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-semibold text-[#1D1D1D]">
                <span>Estimated Total</span>
                <span className="text-[#284C38] font-heading text-base">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              disabled={isMutating || hasUnavailableItems || cartItems.length === 0}
              className="w-full bg-[#284C38] hover:bg-[#1E3A2B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl font-btn shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-[#D6A146] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-body">
              <ShieldCheck className="w-3.5 h-3.5 text-[#284C38]" />
              <span>UPI • Cards • NetBanking • Cash on Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
