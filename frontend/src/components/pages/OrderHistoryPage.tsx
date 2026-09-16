import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Package,
  Calendar,
  ShoppingBag,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavigationPage } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { getOrders, type CustomerOrder } from "../../lib/orderApi";
import { ApiError } from "../../lib/apiClient";
import { formatOrderDate } from "../../lib/orderUi";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";

interface OrderHistoryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

const PAGE_SIZE = 10;

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onNavigate }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const page = useMemo(() => {
    const parsed = Number.parseInt(searchParams.get("page") || "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [searchParams]);

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getOrders({ page, limit: PAGE_SIZE });
      setOrders(result.orders);
      setTotalPages(result.pagination.totalPages);
      setTotalOrders(result.pagination.total);
    } catch (fetchError) {
      setOrders([]);
      setTotalPages(1);
      setTotalOrders(0);
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : "Failed to load orders",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    void fetchOrders();
  }, [authLoading, isAuthenticated, fetchOrders]);

  const goToPage = (nextPage: number) => {
    const safePage = Math.max(1, Math.min(nextPage, totalPages));
    router.push(`/orders?page=${safePage}`);
  };

  const openOrderDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  if (authLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-[#F7F5EF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#284C38]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 bg-[#F7F5EF] min-h-screen px-4">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
          <Package className="w-10 h-10 text-gray-400 mx-auto" />
          <h1 className="font-heading text-2xl font-bold text-[#1D1D1D]">My Orders</h1>
          <p className="text-sm text-gray-500">
            Sign in to view your order history and track deliveries.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold px-6 py-3 rounded-full"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-[#1D1D1D] flex items-center gap-3">
              <Package className="w-8 h-8 text-[#284C38]" />
              My Orders
            </h1>
            <p className="font-body text-sm text-gray-500 font-light mt-1">
              {totalOrders > 0
                ? `${totalOrders} order${totalOrders === 1 ? "" : "s"} placed with ENU Foods`
                : "Track your spice orders and delivery status"}
            </p>
          </div>
          <button
            onClick={() => onNavigate("products")}
            className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold font-btn px-6 py-3 rounded-full shadow-md flex items-center gap-2 transition-colors self-start"
          >
            <ShoppingBag className="w-4 h-4 text-[#D6A146]" />
            <span>Shop More Spices</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#284C38]" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => void fetchOrders()}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#284C38]"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-[#D6A146]/20 shadow-xl text-center space-y-4">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h2 className="font-heading text-xl font-bold text-gray-800">No orders yet</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              When you place an order, it will appear here with live status updates.
            </p>
            <button
              onClick={() => onNavigate("products")}
              className="inline-flex items-center gap-2 bg-[#284C38] text-white text-xs font-bold px-6 py-3 rounded-full"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => openOrderDetails(order.id)}
                className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:border-[#284C38]/30 hover:shadow-md transition-all group"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-bold text-[#1D1D1D]">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge order={order} />
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatOrderDate(order.createdAt)}
                    </span>
                    <span>{order.items.length} item(s)</span>
                    <span className="truncate max-w-[200px]">
                      {order.items
                        .slice(0, 2)
                        .map((item) => item.productName)
                        .join(", ")}
                      {order.items.length > 2 ? "…" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-bold text-[#284C38]">₹{order.total}</div>
                  </div>
                  <span className="text-xs font-bold text-[#284C38] group-hover:underline inline-flex items-center gap-1">
                    Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                <p className="text-xs text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
