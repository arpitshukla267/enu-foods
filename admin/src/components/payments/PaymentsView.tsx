import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Download,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Payment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentsViewProps {
  payments: Payment[];
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ payments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showChart, setShowChart] = useState(true);

  const totalCollected = payments
    .filter(p => p.status === 'completed' || p.status === 'paid' as any)
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = payments.filter(p => p.status === 'completed' || p.status === 'paid' as any).length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const successRate = payments.length > 0 ? Math.round((completedCount / payments.length) * 100) : 100;

  // Chart data from payment dates
  const paymentTrends = useMemo(() => {
    const map: Record<string, { date: string; amount: number; count: number }> = {};
    payments.forEach(p => {
      const d = new Date(p.createdAt || Date.now());
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (!map[label]) {
        map[label] = { date: label, amount: 0, count: 0 };
      }
      if (p.status === 'completed' || p.status === 'paid' as any) {
        map[label].amount += p.amount;
      }
      map[label].count += 1;
    });

    const result = Object.values(map);
    return result.length > 0 ? result : [
      { date: 'Aug 10', amount: 3400, count: 4 },
      { date: 'Aug 11', amount: 5600, count: 6 },
      { date: 'Aug 12', amount: 4800, count: 5 },
      { date: 'Aug 13', amount: 7200, count: 8 },
      { date: 'Aug 14', amount: 9100, count: 9 },
      { date: 'Aug 15', amount: 6400, count: 7 },
    ];
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        p.id.toLowerCase().includes(q) ||
        p.orderNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.gatewayRef?.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (methodFilter !== 'all' && p.method.toLowerCase() !== methodFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      return true;
    }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [payments, searchQuery, methodFilter, statusFilter]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, currentPage, pageSize]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">
              Payments & Financial Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#173D2A]/10 text-[#173D2A] text-xs font-medium border border-[#173D2A]/20">
              {payments.length} Transactions
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Audit payment settlements across UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.
          </p>
        </div>

        <button
          onClick={() => setShowChart(!showChart)}
          className="text-xs font-medium px-3 py-1.5 rounded-xl border border-[#DCD4C0] bg-[#F4EFE6] hover:bg-[#EAE2D2] text-[#173D2A] transition-colors self-start sm:self-auto"
        >
          {showChart ? 'Hide Revenue Chart' : 'Show Revenue Chart'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 lg:p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
          <span className="text-[10px] font-medium text-[#736854] uppercase tracking-wider">Total Settled Volume</span>
          <div className="text-2xl font-medium text-[#173D2A] font-serif-brand mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
          <div className="text-xs text-[#245A3F] font-medium mt-0.5">{completedCount} settled transactions</div>
        </div>

        <div className="bg-white p-4 lg:p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
          <span className="text-[10px] font-medium text-[#736854] uppercase tracking-wider">Settlement Rate</span>
          <div className="text-2xl font-medium text-[#173D2A] font-serif-brand mt-1">{successRate}%</div>
          <div className="text-xs text-[#173D2A] font-semibold mt-0.5">Payment gateway uptime</div>
        </div>

        <div className="bg-white p-4 lg:p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
          <span className="text-[10px] font-bold text-[#736854] uppercase tracking-wider">Pending COD Collections</span>
          <div className="text-2xl font-bold text-[#D99B26] font-serif-brand mt-1">{pendingCount} orders</div>
          <div className="text-xs text-[#736854] mt-0.5">Settles on dispatch delivery</div>
        </div>

        <div className="bg-white p-4 lg:p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
          <span className="text-[10px] font-bold text-[#736854] uppercase tracking-wider">Avg Transaction Size</span>
          <div className="text-2xl font-bold text-[#1A211D] font-serif-brand mt-1">
            ₹{completedCount > 0 ? Math.round(totalCollected / completedCount).toLocaleString('en-IN') : 0}
          </div>
          <div className="text-xs text-[#736854] mt-0.5">Average checkout value</div>
        </div>
      </div>

      {/* Embedded Settlement Revenue Graph */}
      {showChart && (
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D99B26]" />
              <h3 className="text-sm font-bold text-[#173D2A] font-serif-brand">
                Payment Realization & Settlement Volume (₹)
              </h3>
            </div>
            <span className="text-xs text-[#736854]">Daily settled transaction inflow</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paymentTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D99B26" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D99B26" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DC" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={{ stroke: '#E8E2D5' }} 
                  tick={{ fill: '#736854', fontSize: 11 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={{ stroke: '#E8E2D5' }} 
                  tick={{ fill: '#736854', fontSize: 11 }}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#173D2A', 
                    borderRadius: '8px', 
                    color: '#F9F7F2',
                    fontSize: '12px'
                  }}
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Settled Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#D99B26" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#payGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Payment ID, Order #, Customer..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI (GPay/PhonePe)</option>
            <option value="Credit Card">Credit / Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed / Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Transactions Match Filters"
          description="Adjust your search query or reset payment method filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setMethodFilter('all');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5C5343]">
              <thead className="bg-[#F9F7F2] text-[#736854] font-semibold uppercase tracking-wider border-b border-[#E8E2D5]">
                <tr>
                  <th className="py-3.5 px-4">Payment ID</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Gateway Reference</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {paginatedPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#173D2A]">
                      {pay.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#5C5343]">
                      {pay.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#1A211D]">
                      {pay.customerName}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#1A211D] text-sm">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#F4EFE6] text-[#173D2A] font-bold text-[11px] uppercase border border-[#E5DEC9]">
                        {pay.method}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#8F816B]">
                      {pay.gatewayRef || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={pay.status} type="payment" size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#736854]">
                      {new Date(pay.date || (pay as any).createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-[#E8E2D5] bg-[#F9F7F2]">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPayments.length}
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
