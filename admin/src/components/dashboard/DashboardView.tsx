import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowUpRight,
  Eye,
  Search,
  Users,
  ShoppingBag,
  Clock,
  IndianRupee,
  Package,
  AlertTriangle,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StatusBadge } from '../common/StatusBadge';
import { Order, User, ActiveTab } from '../../types';
import { RevenueGraphSection } from './RevenueGraphSection';
import * as adminDashboardApi from '../../lib/adminDashboardApi';
import { ApiError } from '../../lib/apiClient';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onViewOrder: (order: Order) => void;
  onViewUser: (user: User) => void;
  refreshToken?: number;
}

const EMPTY_SUMMARY: adminDashboardApi.DashboardSummary = {
  totalSales: 0,
  periodSales: 0,
  totalOrders: 0,
  pendingOrders: 0,
  products: 0,
  activeProducts: 0,
  lowStock: 0,
  customers: 0,
  activeCoupons: 0,
  categories: 0,
  deliveredOrders: 0,
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onViewOrder,
  onViewUser,
  refreshToken = 0,
}) => {
  const [dateRange, setDateRange] = useState<adminDashboardApi.DashboardDateRange>('30d');
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [summary, setSummary] = useState<adminDashboardApi.DashboardSummary>(EMPTY_SUMMARY);
  const [stats, setStats] = useState<adminDashboardApi.AdminDashboardData['stats'] | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topBuyers, setTopBuyers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminDashboardApi.getDashboard(dateRange);
      setSummary(data.summary);
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
      setTopBuyers(data.topBuyers);
    } catch (fetchError) {
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load dashboard data',
      );
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard, refreshToken]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const filteredOrders = useMemo(() => {
    const q = orderSearch.toLowerCase();
    return recentOrders
      .filter((order) => {
        if (!q) return true;
        return (
          order.orderNumber.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.address.city?.toLowerCase().includes(q) ||
          order.orderStatus.toLowerCase().includes(q)
        );
      })
      .slice(0, 7);
  }, [recentOrders, orderSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    return topBuyers
      .filter((user) => {
        if (!q) return true;
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.phone.includes(q)
        );
      })
      .slice(0, 6);
  }, [topBuyers, userSearch]);

  const quickStats = [
    {
      label: 'Total Sales',
      value: formatCurrency(summary.totalSales),
      icon: IndianRupee,
    },
    {
      label: 'Total Orders',
      value: summary.totalOrders.toString(),
      icon: ShoppingBag,
    },
    {
      label: 'Pending Orders',
      value: summary.pendingOrders.toString(),
      icon: Clock,
    },
    {
      label: 'Products',
      value: summary.products.toString(),
      icon: Package,
    },
    {
      label: 'Low Stock',
      value: summary.lowStock.toString(),
      icon: AlertTriangle,
    },
    {
      label: 'Customers',
      value: summary.customers.toString(),
      icon: Users,
    },
  ];

  if (isLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#736854] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#173D2A]" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 font-['Poppins'] font-normal"
    >
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8C9C4] bg-[#FDF6F5] px-4 py-3 text-sm text-[#9E382B]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => void loadDashboard()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCD4C0] bg-white text-xs text-[#173D2A] hover:bg-[#F4EFE6] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs p-4 flex flex-col gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#173D2A]/10 text-[#173D2A] flex items-center justify-center">
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base text-[#1A211D]">
                {isLoading ? (
                  <span className="inline-block w-16 h-5 bg-[#F4EFE6] rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[11px] text-[#736854]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {stats && (
        <RevenueGraphSection
          stats={stats}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onNavigateToTab={setActiveTab}
          isLoading={isLoading}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFAF6]">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#173D2A]" />
                  <h3 className="text-base text-[#173D2A]">Recent Orders</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#173D2A]/10 text-[#173D2A]">
                    {recentOrders.length}
                  </span>
                </div>
                <p className="text-xs text-[#736854] mt-0.5">Latest orders and fulfillment status</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-[#8F816B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#173D2A] hover:text-[#D99B26] flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-xl border border-[#DCD4C0] bg-white hover:bg-[#F4EFE6] shrink-0"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#5C5343]">
                <thead className="bg-[#F9F7F2] text-[#736854] uppercase tracking-wider border-b border-[#E8E2D5]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => (
                      <motion.tr 
                        key={order.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="hover:bg-[#FDFBF7] transition-colors"
                      >
                        <td className="py-3 px-4 text-[#173D2A] font-mono">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[#1A211D]">{order.customer.name}</div>
                          <div className="text-[11px] text-[#8F816B]">{order.customer.address.city}</div>
                        </td>
                        <td className="py-3 px-4 text-[#1A211D]">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.orderStatus} type="order" size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onViewOrder(order)}
                            className="px-3 py-1.5 rounded-xl text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] transition-colors inline-flex items-center gap-1 text-xs shadow-2xs"
                            title="View order details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#736854]">
                        {orderSearch
                          ? `No orders matched "${orderSearch}".`
                          : 'No orders yet. New orders will appear here.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] border-t border-[#E8E2D5] text-xs text-[#736854] flex items-center justify-between">
            <span>Showing recent orders</span>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs text-[#173D2A] hover:underline"
            >
              Open Orders &rarr;
            </button>
          </div>
        </div>

        {/* Top Buyers */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFAF6]">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#173D2A]" />
                  <h3 className="text-base text-[#173D2A]">Top Buyers</h3>
                </div>
                <p className="text-xs text-[#736854] mt-0.5">Customers with highest spend</p>
              </div>

              <div className="relative w-full sm:w-36">
                <Search className="w-3.5 h-3.5 text-[#8F816B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search buyer..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
                />
              </div>
            </div>

            <div className="divide-y divide-[#F0EBE0] p-2">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.div 
                    key={user.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onViewUser(user)}
                    className="p-3 rounded-xl hover:bg-[#F9F7F2] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#173D2A]/10 text-[#173D2A] text-xs flex items-center justify-center shrink-0 border border-[#173D2A]/20 group-hover:bg-[#173D2A] group-hover:text-[#D99B26] transition-colors">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-[#1A211D] truncate">{user.name}</div>
                        <div className="text-[11px] text-[#8F816B] truncate">{user.email}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-[#173D2A]">{formatCurrency(user.totalSpent)}</div>
                      <div className="text-[10px] text-[#736854]">{user.totalOrders} orders</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredUsers.length === 0 && (
                <div className="p-6 text-center text-xs text-[#736854]">
                  {userSearch
                    ? `No buyers matched "${userSearch}".`
                    : 'No buyer data yet. Top spenders will appear here.'}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-[#F9F7F2] border-t border-[#E8E2D5] text-xs text-[#736854] flex items-center justify-between">
            <span>By total spend</span>
            <button
              onClick={() => setActiveTab('users')}
              className="text-xs text-[#173D2A] hover:underline"
            >
              View Customers &rarr;
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
