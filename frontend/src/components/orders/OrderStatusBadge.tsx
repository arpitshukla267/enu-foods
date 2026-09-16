import React from "react";
import {
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { CustomerOrder } from "../../lib/orderApi";
import { getOrderStatusTone } from "../../lib/orderUi";

interface OrderStatusBadgeProps {
  order: CustomerOrder;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  order,
  className = "",
}) => {
  const tone = getOrderStatusTone(order);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    muted: "bg-gray-100 border-gray-200 text-gray-600",
    processing: "bg-[#C86D39]/10 border-[#C86D39]/20 text-[#C86D39]",
  }[tone];

  const icon =
    tone === "success" ? (
      <CheckCircle className="w-3.5 h-3.5" />
    ) : tone === "info" ? (
      <Truck className="w-3.5 h-3.5" />
    ) : tone === "error" ? (
      <XCircle className="w-3.5 h-3.5" />
    ) : tone === "warning" ? (
      <Clock className="w-3.5 h-3.5" />
    ) : tone === "muted" ? (
      <AlertCircle className="w-3.5 h-3.5" />
    ) : (
      <Clock className="w-3.5 h-3.5 animate-pulse" />
    );

  const label =
    order.orderStatus === "delivered"
      ? "Delivered"
      : order.orderStatus === "shipped"
        ? "Shipped"
        : order.orderStatus === "payment_failed" || order.paymentStatus === "failed"
          ? "Payment Failed"
          : order.orderStatus === "pending_payment"
            ? "Awaiting Payment"
            : order.orderStatus === "confirmed"
              ? "Confirmed"
              : order.orderStatus === "processing"
                ? "Processing"
                : order.orderStatus === "cancelled"
                  ? "Cancelled"
                  : "Processing";

  return (
    <span
      className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-xs font-semibold ${styles} ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};
