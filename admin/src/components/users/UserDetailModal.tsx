import React, { useEffect, useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Calendar, 
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Order } from '../../types';
import { getUserById, mapAdminUserToUser } from '../../lib/adminUserApi';
import { getOrders } from '../../lib/adminOrderApi';
import { ApiError } from '../../lib/apiClient';
import { StatusBadge } from '../common/StatusBadge';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  userOrders: Order[];
  onViewOrder?: (order: Order) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  userOrders: propUserOrders,
  onViewOrder,
}) => {
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedOrders, setFetchedOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isOpen || !user) {
      setDetailUser(null);
      setError(null);
      setFetchedOrders([]);
      return;
    }

    let isMounted = true;

    const loadUserDataAndOrders = async () => {
      setIsLoading(true);
      setOrdersLoading(true);
      setError(null);
      setDetailUser(user);

      try {
        const record = await getUserById(user.id);
        if (isMounted) {
          setDetailUser(mapAdminUserToUser(record));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof ApiError
              ? fetchError.message
              : fetchError instanceof Error
                ? fetchError.message
                : 'Failed to load customer details',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      try {
        const ordersData = await getOrders({ search: '', limit: 50 });
        if (isMounted) {
          const matchingOrders = ordersData.orders.filter(
            (o) => o.customer?.id === user.id || o.customer?.email === user.email
          );
          setFetchedOrders(matchingOrders);
        }
      } catch {
        if (isMounted) {
          setFetchedOrders([]);
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    loadUserDataAndOrders();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const displayUser = detailUser || user;
  const joinedDate = new Date(displayUser.joinedDate);
  const joinedLabel = Number.isNaN(joinedDate.getTime())
    ? 'Unknown'
    : joinedDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  // Fallback to propUserOrders if fetchedOrders is empty or not matching
  const ordersToDisplay = fetchedOrders.length > 0 
    ? fetchedOrders 
    : (propUserOrders || []).filter(
        (o) => o.customer?.id === displayUser.id || o.customer?.email === displayUser.email
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 bg-[#173D2A] text-white flex items-center justify-between border-b border-[#245A3F] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#245A3F] text-[#D99B26] font-bold text-lg flex items-center justify-center border border-[#D99B26]/30">
                  {displayUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#F9F7F2]">
                    {displayUser.name}
                  </h3>
                  <p className="text-xs text-[#A6C5B3]">
                    Customer since {joinedLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-[#736854]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing customer profile...
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E8E2D5]">
                  <span className="text-[10px] font-medium text-[#736854] uppercase">Total Spent</span>
                  <div className="text-base font-medium text-[#173D2A] mt-0.5">
                    {displayUser.totalSpent > 0
                      ? `₹${displayUser.totalSpent.toLocaleString('en-IN')}`
                      : '—'}
                  </div>
                </div>

                <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E8E2D5]">
                  <span className="text-[10px] font-medium text-[#736854] uppercase">Total Orders</span>
                  <div className="text-base font-medium text-[#1A211D] mt-0.5">
                    {ordersToDisplay.length > 0
                      ? `${ordersToDisplay.length} Dispatches`
                      : displayUser.totalOrders > 0
                        ? `${displayUser.totalOrders} Dispatches`
                        : 'No orders yet'}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E8E2D5]">
                  <span className="text-[10px] font-medium text-[#736854] uppercase">Account Status</span>
                  <div className="mt-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#173D2A]">
                      {displayUser.status === 'active' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#173D2A]" />
                          Active Customer
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Inactive Customer
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#E8E2D5] rounded-2xl space-y-2.5">
                <div className="text-xs font-medium text-[#173D2A] uppercase tracking-wider">
                  Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5C5343]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#8F816B]" />
                    <span className="text-[#1A211D] font-medium">{displayUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#8F816B]" />
                    <span className="text-[#1A211D] font-medium">{displayUser.phone}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#E8E2D5] rounded-2xl space-y-2.5">
                <div className="text-xs font-medium text-[#173D2A] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D99B26]" />
                  <span>Saved Delivery Addresses ({displayUser.addresses?.length || 0})</span>
                </div>
                {(displayUser.addresses?.length || 0) === 0 ? (
                  <p className="text-xs text-[#8F816B]">No saved addresses in the account profile.</p>
                ) : (
                  <div className="space-y-2">
                    {displayUser.addresses.map((addr) => (
                      <div key={addr.id} className="p-3 bg-[#F9F7F2] rounded-xl border border-[#E8E2D5] text-xs text-[#1A211D]">
                        <div className="font-medium flex items-center justify-between">
                          <span>{addr.street}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#173D2A] text-white rounded-md font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-[#736854] mt-0.5">
                          {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className="border border-[#E8E2D5] rounded-2xl overflow-hidden bg-white">
                <div className="p-3 bg-[#F9F7F2] border-b border-[#E8E2D5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#173D2A]" />
                    <span className="text-xs font-medium text-[#173D2A] uppercase tracking-wider">
                      Customer Order History ({ordersToDisplay.length})
                    </span>
                  </div>
                  {ordersLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#173D2A]" />}
                </div>

                {ordersToDisplay.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8F816B]">
                    No orders placed by this customer yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#5C5343]">
                      <thead className="bg-[#FAF8F5] text-[#736854] font-medium uppercase tracking-wider border-b border-[#E8E2D5]">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EBE0]">
                        {ordersToDisplay.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#FDFBF7] transition-colors">
                            <td className="py-3 px-4 font-medium font-mono text-[#173D2A]">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3 px-4 text-[#736854]">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-[#1A211D]">
                                {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                              </span>
                              <div className="text-[11px] text-[#8F816B] truncate max-w-[140px]">
                                {ord.items.map((i) => i.productName).join(', ')}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-[#1A211D]">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <StatusBadge status={ord.orderStatus} type="order" size="sm" />
                                <StatusBadge status={ord.paymentStatus} type="payment" size="sm" />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {onViewOrder && (
                                <button
                                  onClick={() => {
                                    onClose();
                                    onViewOrder(ord);
                                  }}
                                  className="px-2.5 py-1 text-xs font-medium text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-lg transition-colors inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D5] flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#5C5343] bg-white hover:bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
