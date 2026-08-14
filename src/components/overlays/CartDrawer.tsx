import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { PRODUCTS } from "../../data/mockData";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, weight: string, newQty: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  onAddToCart: (product: Product, weight?: string, qty?: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

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

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const originalSubtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.product.originalPrice || item.product.price * 1.3) * item.quantity,
    0,
  );

  // Coupon Discount
  const couponDiscount =
    appliedCoupon === "ENU15" ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount);
  const totalSavings = originalSubtotal - subtotal + couponDiscount;

  // Free Gift Threshold (₹999)
  const freeGiftGoal = 999;
  const remainingForGift = Math.max(0, freeGiftGoal - subtotal);
  const giftProgress = Math.min(100, (subtotal / freeGiftGoal) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "ENU15") {
      setAppliedCoupon("ENU15");
    } else {
      alert("Invalid coupon. Try code: ENU15");
    }
  };

  // Cross-sell products not in cart
  const cartProductIds = cartItems.map((i) => i.product.id);
  const crossSellProducts = PRODUCTS.filter(
    (p) => !cartProductIds.includes(p.id),
  ).slice(0, 3);

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
            <h2 className="font-heading text-lg font-bold tracking-tight">
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
          <span className="bg-[#D6A146] text-[#1D1D1D] px-2 py-0.5 rounded text-[10px] font-bold">
            100% PURE
          </span>
        </div>

        {/* Gift Milestone Progress Bar */}
        <div className="bg-[#F7F5EF] p-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between text-xs font-btn mb-1.5 font-bold text-gray-800">
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
            <span className="text-gray-600 font-normal">Goal: ₹999</span>
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
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-800">
                Your cart is empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Discover authentic cold-ground masalas and spices to add rich
                flavor to your cooking.
              </p>
              <button
                onClick={onClose}
                className="bg-[#284C38] text-white text-xs font-bold font-btn px-6 py-2.5 rounded-full"
              >
                Browse Spices
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedWeight}-${index}`}
                className="pt-3 first:pt-0 flex gap-3 items-center"
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
                  <h4 className="font-heading text-sm font-bold text-[#1D1D1D] truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-xs text-gray-500 font-body">
                    Pack:{" "}
                    <span className="font-semibold text-gray-700">
                      {item.selectedWeight}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-sm text-[#284C38]">
                      ₹{item.product.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.product.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Quantity Buttons */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
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
                    <span className="px-2 text-xs font-bold text-gray-800 font-btn">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          item.selectedWeight,
                          item.quantity + 1,
                        )
                      }
                      className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      onRemoveItem(item.product.id, item.selectedWeight)
                    }
                    className="text-red-500 hover:text-red-700 p-1 text-xs"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Cross-sell section */}
          {cartItems.length > 0 && crossSellProducts.length > 0 && (
            <div className="pt-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#284C38] font-btn mb-3 flex items-center gap-1.5">
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
                        <div className="text-xs font-bold text-[#1D1D1D] truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-[#284C38] font-bold">
                          ₹{prod.price}{" "}
                          <span className="text-gray-400 font-normal line-through text-[10px]">
                            ₹{prod.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-[11px] font-bold font-btn px-3 py-1.5 rounded-lg shrink-0"
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
                placeholder="Enter Coupon (e.g. ENU15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#284C38] uppercase"
              />
              <button
                type="submit"
                className="bg-[#1E3A2B] text-[#D6A146] text-xs font-bold px-4 py-2 rounded-lg font-btn hover:bg-[#284C38] transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center justify-between">
                <span>Coupon ENU15 applied (15% Off)</span>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-gray-500 font-bold"
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
                  <span>Coupon Discount (15%)</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold text-[#1D1D1D]">
                <span>Estimated Total</span>
                <span className="text-[#284C38] font-heading text-base">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-bold text-sm py-3.5 rounded-xl font-btn shadow-xl transition-all flex items-center justify-center gap-2 group"
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
