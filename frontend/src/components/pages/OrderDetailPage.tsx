import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NavigationPage } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { getOrderById, type CustomerOrder } from "../../lib/orderApi";
import { ApiError } from "../../lib/apiClient";
import { OrderDetailsContent } from "../orders/OrderDetailsContent";

interface OrderDetailPageProps {
  orderId: string;
  onNavigate: (page: NavigationPage) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError("Invalid order");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getOrderById(orderId);
      setOrder(result);
    } catch (fetchError) {
      setOrder(null);
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : "Failed to load order details",
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    void fetchOrder();
  }, [authLoading, isAuthenticated, fetchOrder]);

  const handleBack = () => {
    router.push("/orders");
    onNavigate("orders");
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
          <h1 className="font-heading text-xl font-bold text-[#1D1D1D]">Sign in to view orders</h1>
          <p className="text-sm text-gray-500">
            Your order details are available only to signed-in customers.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="bg-[#284C38] text-white text-xs font-bold px-6 py-3 rounded-full"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#284C38] mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </button>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#284C38]" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => void fetchOrder()}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#284C38]"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : order ? (
          <OrderDetailsContent order={order} />
        ) : null}
      </div>
    </div>
  );
};
