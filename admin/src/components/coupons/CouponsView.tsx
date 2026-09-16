import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Ticket,
  Loader2,
  AlertCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Category, Coupon } from "../../types";
import { Pagination } from "../common/Pagination";
import { EmptyState } from "../common/EmptyState";
import { ConfirmDialog } from "../common/ConfirmDialog";
import * as adminCouponApi from "../../lib/adminCouponApi";
import { ApiError } from "../../lib/apiClient";

interface CouponsViewProps {
  categories: Category[];
  refreshToken: number;
  onNewCoupon: () => void;
  onEditCoupon: (coupon: Coupon) => void;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const CouponsView: React.FC<CouponsViewProps> = ({
  categories,
  refreshToken,
  onNewCoupon,
  onEditCoupon,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "expired" | "scheduled"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminCouponApi.getCoupons({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        status: statusFilter,
      });
      setCoupons(result.coupons);
      setTotalItems(result.pagination.total);
    } catch (fetchError) {
      setCoupons([]);
      setTotalItems(0);
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : "Failed to load coupons",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons, refreshToken]);

  const handleToggleStatus = async (coupon: Coupon) => {
    setStatusUpdatingId(coupon.id);
    try {
      await adminCouponApi.updateCouponStatus(coupon.id, !coupon.isActive);
      await fetchCoupons();
    } catch (toggleError) {
      setError(
        toggleError instanceof ApiError
          ? toggleError.message
          : toggleError instanceof Error
            ? toggleError.message
            : "Failed to update coupon status",
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCoupon) return;
    try {
      await adminCouponApi.deleteCoupon(deletingCoupon.id);
      setDeletingCoupon(null);
      await fetchCoupons();
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete coupon",
      );
    }
  };

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name || categoryId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">Coupons</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#173D2A]/10 text-[#173D2A]">
              {totalItems}
            </span>
          </div>
          <p className="text-sm text-[#5A7263] mt-1">
            Manage discount codes, usage limits, and product/category restrictions.
          </p>
        </div>
        <button
          onClick={onNewCoupon}
          className="inline-flex items-center justify-center gap-2 bg-[#D99B26] hover:bg-[#E2B04A] text-[#173D2A] font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Coupon
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7FA690]" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E8E2D5] rounded-lg text-sm focus:outline-none focus:border-[#173D2A]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as typeof statusFilter);
            setCurrentPage(1);
          }}
          className="px-3 py-2.5 border border-[#E8E2D5] rounded-lg text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <button
          onClick={fetchCoupons}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E8E2D5] rounded-lg text-sm font-medium text-[#173D2A] hover:bg-[#F9F7F2]"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-[#173D2A]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No coupons found"
            description="Create your first coupon or adjust filters."
            actionLabel="Create Coupon"
            onAction={onNewCoupon}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9F7F2] text-[#5A7263] uppercase text-[11px] tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Code</th>
                  <th className="text-left px-4 py-3">Discount</th>
                  <th className="text-left px-4 py-3">Validity</th>
                  <th className="text-left px-4 py-3">Usage</th>
                  <th className="text-left px-4 py-3">Restrictions</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-[#F0EBE0] hover:bg-[#FCFAF6]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#173D2A]">{coupon.code}</div>
                      <div className="text-xs text-[#7FA690] line-clamp-1">
                        {coupon.description || "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                      {coupon.minimumCartValue > 0 && (
                        <div className="text-xs text-[#7FA690]">
                          Min ₹{coupon.minimumCartValue}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{formatDate(coupon.startDate)}</div>
                      <div className="text-[#7FA690]">to {formatDate(coupon.expiryDate)}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>
                        {coupon.usedCount}
                        {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : " used"}
                      </div>
                      {coupon.perUserLimit > 0 && (
                        <div className="text-[#7FA690]">{coupon.perUserLimit}/user</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A7263]">
                      {coupon.applicableProducts.length > 0 && (
                        <div>{coupon.applicableProducts.length} product(s)</div>
                      )}
                      {coupon.applicableCategories.length > 0 && (
                        <div>
                          {coupon.applicableCategories
                            .slice(0, 2)
                            .map((id) => getCategoryName(id))
                            .join(", ")}
                          {coupon.applicableCategories.length > 2
                            ? ` +${coupon.applicableCategories.length - 2}`
                            : ""}
                        </div>
                      )}
                      {!coupon.applicableProducts.length &&
                        !coupon.applicableCategories.length && (
                          <span className="text-[#7FA690]">All products</span>
                        )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        disabled={statusUpdatingId === coupon.id}
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        {coupon.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditCoupon(coupon)}
                          className="p-2 rounded-lg hover:bg-[#F9F7F2] text-[#173D2A]"
                          title="Edit coupon"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCoupon(coupon)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[#9E382B]"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && totalItems > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingCoupon)}
        title="Delete Coupon"
        message={`Delete coupon "${deletingCoupon?.code}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCoupon(null)}
      />
    </motion.div>
  );
};
