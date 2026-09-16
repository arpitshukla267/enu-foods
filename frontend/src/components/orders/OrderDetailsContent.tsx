import React from "react";
import {
  MapPin,
  CreditCard,
  Truck,
  Tag,
  Package,
} from "lucide-react";
import type { CustomerOrder } from "../../lib/orderApi";
import {
  formatOrderDate,
  formatPaymentMethodLabel,
  formatPaymentStatusLabel,
} from "../../lib/orderUi";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";

interface OrderDetailsContentProps {
  order: CustomerOrder;
}

export const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Order Number
          </p>
          <h2 className="font-heading text-2xl font-bold text-[#1D1D1D] mt-1">
            {order.orderNumber}
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            Placed on {formatOrderDate(order.createdAt, true)}
          </p>
        </div>
        <OrderStatusBadge order={order} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-[#FAFAF8] text-xs font-bold text-gray-700">
              Items ({order.items.length})
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.weight}-${index}`}
                  className="p-4 flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1D1D1D] truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.weight} • Qty {item.quantity}
                    </p>
                    {item.sku && (
                      <p className="text-[10px] text-gray-400 mt-0.5">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500">₹{item.unitPrice} each</p>
                    <p className="text-sm font-bold text-[#284C38]">₹{item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Discount
                  {order.coupon?.code ? ` (${order.coupon.code})` : ""}
                </span>
                <span className="font-semibold">-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">
                {order.shippingFee > 0 ? `₹${order.shippingFee}` : "FREE"}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <span className="font-bold text-[#1D1D1D]">Total</span>
              <span className="font-bold text-[#284C38]">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 text-xs">
            <div className="font-bold text-[#284C38] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </div>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">{order.shippingAddress.fullName}</span>
              <br />
              {order.shippingAddress.addressLine}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
              <br />
              Phone: {order.shippingAddress.phone}
            </p>
            <p className="text-gray-500 pt-1">
              Method:{" "}
              {order.shippingMethod === "express" ? "Express Delivery" : "Standard (Free)"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2 text-xs">
            <div className="font-bold text-[#284C38] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              Payment
            </div>
            <p className="text-gray-700 font-semibold">
              {formatPaymentMethodLabel(order.paymentMethod)}
            </p>
            <p className="text-gray-500">
              Status: {formatPaymentStatusLabel(order.paymentStatus)}
            </p>
          </div>

          {(order.trackingNumber || order.carrier) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2 text-xs">
              <div className="font-bold text-[#284C38] flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                Tracking
              </div>
              {order.carrier && <p className="text-gray-600">Carrier: {order.carrier}</p>}
              {order.trackingNumber && (
                <p className="text-gray-800 font-semibold">{order.trackingNumber}</p>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <OrderStatusTimeline order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};
