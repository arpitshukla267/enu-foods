import React, { useCallback, useEffect, useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import * as adminOrderApi from '../../lib/adminOrderApi';
import { ApiError } from '../../lib/apiClient';

interface OrdersViewProps {
  refreshToken: number;
  onViewOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, orderStatus: OrderStatus, paymentStatus: PaymentStatus, trackingNumber?: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  refreshToken,
  onViewOrder,
  onUpdateOrderStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminOrderApi.getOrders({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        orderStatus: statusFilter,
        paymentStatus: paymentFilter,
        sort: sortBy,
      });
      setOrders(result.orders);
      setTotalItems(result.pagination.total);
    } catch (fetchError) {
      setOrders([]);
      setTotalItems(0);
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : 'Failed to load orders',
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, statusFilter, paymentFilter, sortBy, refreshToken]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || paymentFilter !== 'all';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">
              Orders & Spice Fulfillment
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#173D2A]/10 text-[#173D2A] text-xs font-medium border border-[#173D2A]/20">
              {totalItems} Orders
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Process incoming orders, generate shipping labels, and track customer deliveries.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order #, customer, item..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="pending">Pending Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid / Settled</option>
              <option value="pending">Pending Payment (COD)</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE0] text-xs text-[#736854]">
            <span>Showing filtered results</span>
            <button
              onClick={handleClearFilters}
              className="text-[#9E382B] hover:underline font-medium flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#173D2A]" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => void fetchOrders()}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#173D2A]"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          description={hasActiveFilters ? "Try adjusting your search keywords or clearing status filters." : "No customer orders recorded yet."}
          actionLabel={hasActiveFilters ? "Reset Filters" : undefined}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5C5343]">
              <thead className="bg-[#F9F7F2] text-[#736854] font-medium uppercase tracking-wider border-b border-[#E8E2D5]">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Total (₹)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                <AnimatePresence mode="popLayout">
                  {orders.map((order) => (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="hover:bg-[#FDFBF7] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium text-[#173D2A] font-mono">
                        {order.orderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1A211D]">{order.customer.name}</div>
                        <div className="text-[11px] text-[#8F816B]">{order.customer.address.city}, {order.customer.address.state}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-medium text-[#1A211D] truncate">
                          {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                        <div className="text-[10px] text-[#8F816B]">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} total units
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#1A211D] text-sm">
                        ₹{order.total}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                          <div className="text-[10px] uppercase font-medium text-[#8F816B]">
                            {order.paymentMethod}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus, order.paymentStatus, order.trackingNumber)}
                            className="px-2.5 py-1 text-xs font-medium bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#173D2A] focus:outline-none focus:border-[#173D2A]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <div>
                            {order.shippingMethod === 'express' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
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
                      </td>

                      <td className="py-3.5 px-4 text-[#736854]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onViewOrder(order)}
                          className="px-3.5 py-1.5 text-xs font-medium text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-[#E8E2D5] bg-[#F9F7F2]">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
