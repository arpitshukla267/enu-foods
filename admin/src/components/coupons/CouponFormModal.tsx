import React, { useCallback, useEffect, useState } from "react";
import { X, Check, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Coupon, CouponDiscountType, Product } from "../../types";
import * as adminProductApi from "../../lib/adminProductApi";
import { CouponPayload } from "../../lib/adminCouponApi";

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CouponPayload) => void;
  couponToEdit?: Coupon | null;
  categories: Category[];
}

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const CouponFormModal: React.FC<CouponFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  couponToEdit,
  categories,
}) => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<CouponDiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minimumCartValue, setMinimumCartValue] = useState("0");
  const [maximumDiscount, setMaximumDiscount] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("0");
  const [perUserLimit, setPerUserLimit] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [selectedProductsCache, setSelectedProductsCache] = useState<Product[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedProductSearch(productSearch.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [productSearch]);

  useEffect(() => {
    if (!isOpen) return;

    if (couponToEdit) {
      setCode(couponToEdit.code);
      setDescription(couponToEdit.description);
      setDiscountType(couponToEdit.discountType);
      setDiscountValue(String(couponToEdit.discountValue));
      setMinimumCartValue(String(couponToEdit.minimumCartValue));
      setMaximumDiscount(String(couponToEdit.maximumDiscount));
      setStartDate(toDateInputValue(couponToEdit.startDate));
      setExpiryDate(toDateInputValue(couponToEdit.expiryDate));
      setUsageLimit(String(couponToEdit.usageLimit));
      setPerUserLimit(String(couponToEdit.perUserLimit));
      setIsActive(couponToEdit.isActive);
      setSelectedProductIds(couponToEdit.applicableProducts);
      setSelectedCategoryIds(couponToEdit.applicableCategories);
      setSelectedProductsCache([]);
    } else {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCode("");
      setDescription("");
      setDiscountType("percentage");
      setDiscountValue("10");
      setMinimumCartValue("0");
      setMaximumDiscount("0");
      setStartDate(today.toISOString().slice(0, 10));
      setExpiryDate(nextMonth.toISOString().slice(0, 10));
      setUsageLimit("0");
      setPerUserLimit("0");
      setIsActive(true);
      setSelectedProductIds([]);
      setSelectedCategoryIds([]);
      setSelectedProductsCache([]);
    }

    setProductSearch("");
    setProductResults([]);
    setErrors({});
  }, [couponToEdit, isOpen]);

  const searchProducts = useCallback(async () => {
    if (!debouncedProductSearch) {
      setProductResults([]);
      return;
    }

    setIsSearchingProducts(true);
    try {
      const result = await adminProductApi.getProducts({
        page: 1,
        limit: 10,
        search: debouncedProductSearch,
        status: "active",
      });
      setProductResults(result.products);
    } catch {
      setProductResults([]);
    } finally {
      setIsSearchingProducts(false);
    }
  }, [debouncedProductSearch]);

  useEffect(() => {
    if (isOpen) {
      searchProducts();
    }
  }, [isOpen, searchProducts]);

  const toggleProduct = (product: Product) => {
    setSelectedProductIds((current) => {
      if (current.includes(product.id)) {
        setSelectedProductsCache((cache) => cache.filter((entry) => entry.id !== product.id));
        return current.filter((id) => id !== product.id);
      }
      setSelectedProductsCache((cache) =>
        cache.some((entry) => entry.id === product.id) ? cache : [...cache, product],
      );
      return [...current, product.id];
    });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!code.trim()) nextErrors.code = "Coupon code is required";
    if (!startDate) nextErrors.startDate = "Start date is required";
    if (!expiryDate) nextErrors.expiryDate = "Expiry date is required";
    if (startDate && expiryDate && startDate > expiryDate) {
      nextErrors.expiryDate = "Expiry date must be after start date";
    }

    const parsedDiscountValue = Number(discountValue);
    if (!Number.isFinite(parsedDiscountValue) || parsedDiscountValue <= 0) {
      nextErrors.discountValue = "Discount value must be greater than 0";
    } else if (discountType === "percentage" && parsedDiscountValue > 100) {
      nextErrors.discountValue = "Percentage cannot exceed 100";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discountType,
      discountValue: parsedDiscountValue,
      minimumCartValue: Number(minimumCartValue) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      startDate,
      expiryDate,
      usageLimit: Number(usageLimit) || 0,
      perUserLimit: Number(perUserLimit) || 0,
      applicableProducts: selectedProductIds,
      applicableCategories: selectedCategoryIds,
      isActive,
    });
  };

  const selectedProductLabels = [
    ...selectedProductsCache,
    ...productResults.filter(
      (product) =>
        selectedProductIds.includes(product.id) &&
        !selectedProductsCache.some((entry) => entry.id === product.id),
    ),
  ].filter(
    (product, index, array) => array.findIndex((entry) => entry.id === product.id) === index,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#173D2A] text-white flex items-center justify-between border-b border-[#245A3F] shrink-0">
              <div>
                <h3 className="text-base font-bold font-serif-brand text-[#F9F7F2]">
                  {couponToEdit ? "Edit Coupon" : "Create Coupon"}
                </h3>
                <p className="text-xs text-[#A6C5B3]">
                  Configure discount rules, validity, and restrictions.
                </p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="p-6 space-y-5 bg-[#F9F7F2]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Coupon Code *
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm uppercase"
                      placeholder="SAVE10"
                    />
                    {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">Status</label>
                    <select
                      value={isActive ? "active" : "inactive"}
                      onChange={(e) => setIsActive(e.target.value === "active")}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    placeholder="Optional internal note or customer-facing description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Discount Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as CouponDiscountType)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm bg-white"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    />
                    {errors.discountValue && (
                      <p className="text-xs text-red-600 mt-1">{errors.discountValue}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Max Discount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maximumDiscount}
                      onChange={(e) => setMaximumDiscount(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Min Cart (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={minimumCartValue}
                      onChange={(e) => setMinimumCartValue(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    />
                    {errors.startDate && (
                      <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173D2A] mb-1.5">
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={perUserLimit}
                    onChange={(e) => setPerUserLimit(e.target.value)}
                    className="w-full md:w-1/3 px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white border border-[#E8E2D5] rounded-xl p-4">
                    <label className="block text-xs font-bold text-[#173D2A] mb-2">
                      Category Restrictions
                    </label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 text-sm text-[#173D2A]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E8E2D5] rounded-xl p-4">
                    <label className="block text-xs font-bold text-[#173D2A] mb-2">
                      Product Restrictions
                    </label>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7FA690]" />
                      <input
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-3 py-2 border border-[#E8E2D5] rounded-lg text-sm"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {isSearchingProducts ? (
                        <div className="py-4 flex justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-[#173D2A]" />
                        </div>
                      ) : debouncedProductSearch && productResults.length === 0 ? (
                        <p className="text-xs text-[#7FA690]">No products found.</p>
                      ) : (
                        productResults.map((product) => (
                          <label
                            key={product.id}
                            className="flex items-center gap-2 text-sm text-[#173D2A]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() => toggleProduct(product)}
                            />
                            <span className="line-clamp-1">{product.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                    {selectedProductIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedProductLabels.map((product) => (
                          <span
                            key={product.id}
                            className="text-[11px] px-2 py-1 rounded-full bg-[#173D2A]/10 text-[#173D2A]"
                          >
                            {product.name}
                          </span>
                        ))}
                        {selectedProductIds.length > selectedProductLabels.length && (
                          <span className="text-[11px] px-2 py-1 rounded-full bg-[#173D2A]/10 text-[#173D2A]">
                            +{selectedProductIds.length - selectedProductLabels.length} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white border-t border-[#E8E2D5] flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-sm font-semibold text-[#173D2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D99B26] hover:bg-[#E2B04A] text-[#173D2A] text-sm font-bold"
                >
                  <Check className="w-4 h-4" />
                  {couponToEdit ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
