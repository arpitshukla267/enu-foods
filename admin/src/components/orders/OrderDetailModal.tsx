import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CreditCard,
  Package,
  AlertCircle,
  IndianRupee,
  Save,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, orderStatus: OrderStatus, paymentStatus: PaymentStatus, trackingNumber?: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [itemSearch, setItemSearch] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus);
      setPaymentStatus(order.paymentStatus);
      setTrackingNumber(order.trackingNumber || '');
      setItemSearch('');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSave = () => {
    onUpdateStatus(order.id, orderStatus, paymentStatus, trackingNumber);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const filteredItems = order.items.filter(item => 
    item.productName.toLowerCase().includes(itemSearch.toLowerCase()) ||
    (item.weight && item.weight.toLowerCase().includes(itemSearch.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Card with Scale & Fade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto z-10 print:border-none print:shadow-none print:max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-[#173D2A] text-white flex items-center justify-between border-b border-[#245A3F] print:bg-white print:text-black print:border-b-2 print:border-black shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#245A3F] text-[#D99B26] print:border print:border-black">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#F9F7F2] print:text-black">
                      Order {order.orderNumber}
                    </h3>
                    <StatusBadge
                      status={order.orderStatus}
                      type="order"
                      size="sm"
                    />
                  </div>
                  <p className="text-xs text-[#A6C5B3] print:text-gray-600">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrintSlip}
                  className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-1.5"
                  title="Print Packing Slip"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Slip</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#1A211D]">
              {/* Status & Logistics Action Bar (Hidden when printing) */}
              <div className="p-4 bg-[#F9F7F2] border border-[#E8E2D5] rounded-2xl space-y-3 print:hidden">
                <div className="text-xs font-bold text-[#173D2A] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#D99B26]" />
                  <span>Fulfillment & Dispatch Controls</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#736854] uppercase mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) =>
                        setOrderStatus(e.target.value as OrderStatus)
                      }
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing (Packing)</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#736854] uppercase mb-1">
                      Payment Settlement
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) =>
                        setPaymentStatus(e.target.value as PaymentStatus)
                      }
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid / Captured</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#736854] uppercase mb-1">
                      Courier AWB / Tracking #
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BLUEDART-88219"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSave}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      isSaved
                        ? "bg-[#173D2A] text-[#D99B26]"
                        : "bg-[#173D2A] text-white hover:bg-[#245A3F]"
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {isSaved ? "Changes Saved!" : "Update Order Status"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#E8E2D5] rounded-2xl space-y-2.5">
                  <div className="text-xs font-bold text-[#736854] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F0EBE0] pb-2">
                    <User className="w-4 h-4 text-[#173D2A]" />
                    <span>Customer Details</span>
                  </div>
                  <div className="text-xs space-y-1.5">
                    <div className="font-bold text-sm text-[#1A211D]">
                      {order.customer.name}
                    </div>
                    <div className="flex items-center gap-2 text-[#5C5343]">
                      <Mail className="w-3.5 h-3.5 text-[#8F816B] shrink-0" />
                      <span>{order.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5C5343]">
                      <Phone className="w-3.5 h-3.5 text-[#8F816B] shrink-0" />
                      <span>{order.customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#E8E2D5] rounded-2xl space-y-2.5">
                  <div className="text-xs font-bold text-[#736854] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F0EBE0] pb-2">
                    <MapPin className="w-4 h-4 text-[#173D2A]" />
                    <span>Shipping Address</span>
                  </div>
                  <div className="text-xs text-[#5C5343] space-y-1">
                    <div className="font-semibold text-[#1A211D]">
                      {order.customer.address.street}
                    </div>

                    <div>
                      {order.customer.address.city},{" "}
                      {order.customer.address.state} —{" "}
                      <span className="font-mono font-bold text-[#1A211D]">
                        {order.customer.address.pincode}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#736854]">
                      {order.customer.address.country}
                    </div>
                    <div className="pt-1.5">
                      {order.shippingMethod === 'express' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Truck className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>PAN India Express 24-36 Hours Delivery</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F4EFE6] text-[#736854] border border-[#E8E2D5]">
                          <Truck className="w-3 h-3 text-[#8F816B] shrink-0" />
                          <span>Standard Delivery</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items List with Search Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-2">
                  <h4 className="text-xs font-bold text-[#736854] uppercase tracking-wider">
                    Ordered Spice Packs ({order.items.length})
                  </h4>

                  {/* Search inside Order Items */}
                  {order.items.length > 2 && (
                    <div className="relative w-full sm:w-56 print:hidden">
                      <Search className="w-3.5 h-3.5 text-[#8F816B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        placeholder="Search items..."
                        className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-lg text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
                      />
                    </div>
                  )}
                </div>

                <div className="border border-[#E8E2D5] rounded-2xl overflow-hidden divide-y divide-[#F0EBE0] bg-white">
                  {filteredItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E8E2D5] shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-[#1A211D]">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-[#736854] flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded-md bg-[#F4EFE6] font-semibold text-[#173D2A]">
                              {item.weight}
                            </span>
                            <span>₹{item.price} per unit</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-[#1A211D]">
                          ₹{item.price * item.quantity}
                        </div>
                        <div className="text-[11px] text-[#736854] font-medium">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredItems.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#736854]">
                      No items matched your search query.
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-2 text-xs">
                <div className="flex justify-between text-[#736854]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A211D]">
                    ₹{order.subtotal}
                  </span>
                </div>
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#9E382B]">
                    <span>Discount applied</span>
                    <span className="font-semibold">
                      -₹{order.discountAmount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#736854]">
                  <span>Shipping & Handling</span>
                  <span className="font-semibold text-[#1A211D]">
                    {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#736854]">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-[#1A211D]">
                    ₹{order.tax || Math.round(order.subtotal * 0.05)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#173D2A] border-t border-[#DCD4C0] pt-2 mt-2">
                  <span>Grand Total</span>
                  <span>₹{order.total}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#736854] pt-1">
                  <span>Payment Gateway / Method</span>
                  <span className="font-semibold uppercase text-[#173D2A]">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
