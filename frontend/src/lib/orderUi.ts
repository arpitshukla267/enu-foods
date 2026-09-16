import type { CustomerOrder, OrderStatus, OrderStatusHistoryItem } from "./orderApi";
import type { PaymentMethod } from "../types";

export const formatOrderDate = (value: string, withTime = false) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

export const formatPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case "upi":
      return "UPI";
    case "card":
      return "Credit / Debit Card";
    case "netbanking":
      return "Net Banking";
    case "cod":
      return "Cash on Delivery";
    default:
      return method;
  }
};

export const formatOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "pending_payment":
      return "Awaiting Payment";
    case "confirmed":
      return "Order Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "payment_failed":
      return "Payment Failed";
    default:
      return status;
  }
};

export const formatPaymentStatusLabel = (status: string) => {
  switch (status) {
    case "paid":
      return "Paid";
    case "failed":
      return "Failed";
    case "refunded":
      return "Refunded";
    default:
      return "Pending";
  }
};

export const getOrderStatusTone = (order: CustomerOrder) => {
  if (order.orderStatus === "delivered") return "success";
  if (order.orderStatus === "shipped") return "info";
  if (order.orderStatus === "payment_failed" || order.paymentStatus === "failed") return "error";
  if (order.orderStatus === "pending_payment") return "warning";
  if (order.orderStatus === "cancelled") return "muted";
  return "processing";
};

export const buildOrderTimeline = (order: CustomerOrder): OrderStatusHistoryItem[] => {
  if (order.statusHistory?.length) {
    return [...order.statusHistory].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }

  return [
    {
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      note: "Order placed",
      timestamp: order.createdAt,
    },
  ];
};
