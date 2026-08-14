import React, { useState } from "react";
import {
  ChevronDown,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ArrowRight,
  Clock,
  Calendar,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OrderDetails, NavigationPage } from "../../types";

interface OrderHistoryPageProps {
  orders: OrderDetails[];
  onNavigate: (page: NavigationPage) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  orders,
  onNavigate,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadge = (status: "Processing" | "Shipped" | "Delivered") => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            Shipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-[#C86D39]/10 border border-[#C86D39]/20 text-[#C86D39] px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Processing
          </span>
        );
    }
  };

  // Helper to determine status from index
  const getStatusForIndex = (index: number): "Processing" | "Shipped" | "Delivered" => {
    if (index % 3 === 0) return "Delivered";
    if (index % 3 === 1) return "Shipped";
    return "Processing";
  };

  return (
    <div className="pt-28 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#1D1D1D] flex items-center gap-3">
              <Package className="w-8 h-8 text-[#284C38]" />
              Order History
            </h1>
            <p className="font-body text-sm text-gray-500 font-light mt-1">
              View and track all your premium ENU Foods spice orders
            </p>
          </div>
          <button
            onClick={() => onNavigate("products")}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold font-btn py-3 px-5 rounded-xl shadow-md transition-all transform hover:-translate-y-[1px]"
          >
            <span>Browse More Spices</span>
            <ArrowRight className="w-4 h-4 text-[#D6A146]" />
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D6A146]/20 shadow-xl space-y-6">
            <div className="w-20 h-20 bg-[#1E3A2B]/10 rounded-full flex items-center justify-center mx-auto border border-[#D6A146]/20">
              <ShoppingBag className="w-10 h-10 text-[#284C38]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold text-[#1D1D1D]">
                No Orders Yet
              </h2>
              <p className="font-body text-gray-500 max-w-sm mx-auto font-light leading-relaxed">
                Explore our catalog of single-origin and custom spice blends to place your first order.
              </p>
            </div>
            <button
              onClick={() => onNavigate("products")}
              className="inline-flex items-center gap-2 bg-[#D6A146] hover:bg-[#c3913c] text-white font-btn font-bold text-xs py-3.5 px-8 rounded-xl shadow-lg transition-all"
            >
              Shop Spice Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const isExpanded = expandedOrderId === order.orderId;
              const status = getStatusForIndex(index);

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-[#D6A146]/20 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Card Header Summary */}
                  <div
                    onClick={() => toggleExpand(order.orderId)}
                    className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1E3A2B]/5 flex items-center justify-center text-[#284C38] shrink-0 border border-gray-100">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Order ID
                        </div>
                        <div className="text-sm font-bold text-[#1D1D1D] font-mono">
                          {order.orderId}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        Placed On
                      </div>
                      <div className="text-sm font-bold text-[#1D1D1D]">
                        {order.date}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Total Amount
                      </div>
                      <div className="text-sm font-bold text-[#284C38] font-sans">
                        ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(status)}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-gray-100"
                      >
                        <div className="p-6 bg-[#F7F5EF]/30 space-y-6">
                          {/* Inner Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Details */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                <MapPin className="w-4 h-4 text-[#D6A146]" />
                                Shipping Address
                              </h3>
                              <div className="text-sm space-y-1">
                                <div className="font-bold text-[#1D1D1D]">
                                  {order.shippingAddress.fullName}
                                </div>
                                <div className="text-gray-600 font-light">
                                  {order.shippingAddress.addressLine}
                                </div>
                                <div className="text-gray-600 font-light">
                                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                </div>
                                <div className="text-gray-500 font-light text-xs pt-1">
                                  📞 {order.shippingAddress.phone}
                                </div>
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                <CreditCard className="w-4 h-4 text-[#D6A146]" />
                                Payment details
                              </h3>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-light">Method:</span>
                                  <span className="font-bold text-gray-700 uppercase">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-light">Subtotal:</span>
                                  <span className="text-gray-700">₹{order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-green-600">
                                    <span>Discount (Coupon):</span>
                                    <span>-₹{order.discount.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between border-t border-dashed border-gray-100 pt-2 font-bold text-[#284C38]">
                                  <span>Total Paid:</span>
                                  <span>₹{order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">
                              Items Ordered ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
                            </h3>
                            <div className="divide-y divide-gray-100">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-[#F7F5EF]/50 shrink-0"
                                    />
                                    <div>
                                      <div className="text-sm font-bold text-[#1D1D1D]">
                                        {item.product.name}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        Weight: {item.selectedWeight} | Qty: {item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-sm font-bold text-gray-700">
                                    ₹{(item.product.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
