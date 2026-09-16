import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Layers, 
  PieChart as PieChartIcon,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Bar, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ComposedChart,
  ReferenceDot
} from 'recharts';
import { DashboardStats, ActiveTab } from '../../types';

interface RevenueGraphSectionProps {
  stats: DashboardStats;
  dateRange: '7d' | '30d' | '3m' | '12m';
  onDateRangeChange: (range: '7d' | '30d' | '3m' | '12m') => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
  isLoading?: boolean;
}

const TOOLTIP_STYLE = {
  backgroundColor: '#173D2A',
  borderRadius: '12px',
  border: '1px solid #245A3F',
  color: '#F9F7F2',
  boxShadow: '0 12px 28px -6px rgba(23, 61, 42, 0.35)',
  fontSize: '12px',
  fontFamily: 'Poppins, sans-serif',
  padding: '10px 12px',
};

export const RevenueGraphSection: React.FC<RevenueGraphSectionProps> = ({
  stats,
  dateRange,
  onDateRangeChange,
  onNavigateToTab,
  isLoading = false,
}) => {
  const [chartType, setChartType] = useState<'area' | 'composed' | 'cumulative' | 'category'>('area');
  const [showDataTable, setShowDataTable] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  const formatCompact = (val: number) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`;

  const chartData = stats.revenueByDate || [];

  const totalPeriodRevenue = useMemo(() => chartData.reduce((acc, curr) => acc + curr.revenue, 0), [chartData]);
  const totalPeriodOrders = useMemo(() => chartData.reduce((acc, curr) => acc + curr.orders, 0), [chartData]);
  const avgDailyRevenue = useMemo(() => (chartData.length === 0 ? 0 : Math.round(totalPeriodRevenue / chartData.length)), [totalPeriodRevenue, chartData.length]);
  const peakDay = useMemo(() => {
    if (chartData.length === 0) return { date: 'N/A', revenue: 0, orders: 0, cumulative: 0 };
    return [...chartData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [chartData]);

  const categoryRevenueData = stats.categoryRevenue || [];

  const totalCategoryRevenue = useMemo(
    () => categoryRevenueData.reduce((a, b) => a + b.revenue, 0),
    [categoryRevenueData]
  );

  const topCategory = useMemo(
    () => [...categoryRevenueData].sort((a, b) => b.revenue - a.revenue)[0],
    [categoryRevenueData]
  );

  const growthLabel = stats.revenueGrowth >= 0
    ? `+${stats.revenueGrowth}% growth`
    : `${stats.revenueGrowth}% vs prior period`;

  const kpiCards = [
    {
      label: 'Period Sales',
      value: formatCurrency(totalPeriodRevenue),
      icon: IndianRupee,
      footer: growthLabel,
      footerColor: stats.revenueGrowth >= 0 ? 'text-[#245A3F]' : 'text-[#9E382B]',
      accent: '#173D2A',
    },
    {
      label: 'Total Orders',
      value: `${totalPeriodOrders} Orders`,
      icon: BarChart3,
      footer: `Avg ₹${totalPeriodOrders > 0 ? Math.round(totalPeriodRevenue / totalPeriodOrders) : 0} / order`,
      footerColor: 'text-[#736854]',
      accent: '#D99B26',
    },
    {
      label: 'Avg Daily Velocity',
      value: formatCurrency(avgDailyRevenue),
      icon: TrendingUp,
      footer: `Across ${chartData.length} checkpoints`,
      footerColor: 'text-[#736854]',
      accent: '#3E805E',
    },
    {
      label: 'Peak Sales Point',
      value: formatCurrency(peakDay.revenue),
      icon: ArrowUpRight,
      footer: `Recorded on ${peakDay.date}`,
      footerColor: 'text-[#736854]',
      accent: '#E2B04A',
    },
  ];

  const chartTabs = [
    { id: 'area' as const, label: 'Trend', icon: LineChartIcon },
    { id: 'composed' as const, label: 'Volume', icon: BarChart3 },
    { id: 'cumulative' as const, label: 'Cumulative', icon: Layers },
    { id: 'category' as const, label: 'Categories', icon: PieChartIcon },
  ];

  const handleExportCSV = () => {
    const headers = ['Date / Interval', 'Revenue (INR)', 'Orders Count', 'Average Order Value (INR)'];
    const rows = chartData.map(item => [
      item.date,
      item.revenue,
      item.orders,
      item.orders > 0 ? Math.round(item.revenue / item.orders) : 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enu-foods-revenue-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-sm overflow-hidden font-['Poppins'] font-normal">
      {/* Header */}
      <div className="p-5 lg:p-6 border-b border-[#E8E2D5] flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#FAF8F3] to-[#F4EFE6]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#173D2A] text-[#D99B26] flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg text-[#173D2A]">
              Revenue & Sales Growth
            </h3>
            <p className="text-xs text-[#736854] mt-0.5">
              Financial performance, order velocity & category mix
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#E5DEC9]">
            {chartTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setChartType(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  chartType === tab.id
                    ? 'bg-[#173D2A] text-white'
                    : 'text-[#5C5343] hover:text-[#173D2A]'
                }`}
                title={tab.label}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#E5DEC9]">
            {(['7d', '30d', '3m', '12m'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onDateRangeChange(range)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  dateRange === range
                    ? 'bg-[#D99B26] text-[#173D2A]'
                    : 'text-[#5C5343] hover:text-[#173D2A]'
                }`}
              >
                {range === '7d' ? '7D' : range === '30d' ? '30D' : range === '3m' ? '3M' : '1Y'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCD4C0] bg-white hover:bg-[#F9F7F2] text-xs text-[#173D2A] transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#D99B26]" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-[#E8E2D5] divide-x divide-[#E8E2D5] bg-[#FAF8F3]">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="p-4 lg:p-5">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${kpi.accent}1A`, color: kpi.accent }}
              >
                <kpi.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#736854]">{kpi.label}</span>
            </div>
            <div className="text-lg lg:text-xl text-[#173D2A] mt-2">{kpi.value}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${kpi.footerColor}`}>{kpi.footer}</div>
          </div>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="p-5 lg:p-6">
        {chartType === 'area' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173D2A]" />
                <span className="text-xs text-[#173D2A]">Gross Revenue Trend</span>
              </div>
              <span className="text-xs text-[#8F816B]">Hover to inspect a checkpoint</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enuRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#173D2A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#173D2A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DC" />
                  <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#E8E2D5' }} tick={{ fill: '#8F816B', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#E8E2D5' }} tick={{ fill: '#8F816B', fontSize: 11 }} tickFormatter={formatCompact} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#173D2A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#enuRevenueGrad)"
                    activeDot={{ r: 5, fill: '#D99B26', stroke: '#173D2A', strokeWidth: 2 }}
                  />
                  {peakDay.date !== 'N/A' && (
                    <ReferenceDot
                      x={peakDay.date}
                      y={peakDay.revenue}
                      r={5}
                      fill="#D99B26"
                      stroke="#173D2A"
                      strokeWidth={2}
                      label={{ value: 'Peak', position: 'top', fill: '#173D2A', fontSize: 11 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartType === 'composed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#D99B26]" />
                  <span className="text-[#173D2A]">Revenue (bars)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#173D2A] rounded-full" />
                  <span className="text-[#173D2A]">Orders (line)</span>
                </div>
              </div>
              <span className="text-xs text-[#8F816B]">Dual-axis volume tracking</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DC" />
                  <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#E8E2D5' }} tick={{ fill: '#8F816B', fontSize: 11 }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={{ stroke: '#E8E2D5' }} tick={{ fill: '#8F816B', fontSize: 11 }} tickFormatter={formatCompact} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#D99B26', fontSize: 11 }} tickFormatter={(val) => `${val}`} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value: any, name: string) => {
                      if (name === 'revenue') return [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue'];
                      if (name === 'orders') return [`${value} Orders`, 'Order Count'];
                      return [value, name];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="revenue" fill="#D99B26" radius={[6, 6, 0, 0]} maxBarSize={36} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#173D2A" strokeWidth={2.5} dot={{ r: 3.5, fill: '#173D2A' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartType === 'cumulative' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D99B26]" />
                <span className="text-xs text-[#173D2A]">Cumulative Trajectory</span>
              </div>
              <span className="text-xs text-[#8F816B]">Building to {formatCurrency(totalPeriodRevenue)}</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enuCumulativeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D99B26" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D99B26" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DC" />
                  <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#E8E2D5' }} tick={{ fill: '#8F816B', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#E8E2D5' }} tick={{ fill: '#8F816B', fontSize: 11 }} tickFormatter={formatCompact} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Cumulative Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#D99B26"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#enuCumulativeGrad)"
                    activeDot={{ r: 5, fill: '#173D2A', stroke: '#D99B26', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartType === 'category' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-2">
            {/* Donut with center label */}
            <div className="relative h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={104}
                    paddingAngle={4}
                    dataKey="revenue"
                    stroke="none"
                    onMouseEnter={(_, index) => setActiveCategory(categoryRevenueData[index].name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    {categoryRevenueData.map((entry, index) => (
                      <Cell
                        key={`cell-cat-${index}`}
                        fill={entry.color}
                        opacity={activeCategory && activeCategory !== entry.name ? 0.35 : 1}
                        style={{ transition: 'opacity 0.15s ease' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(val: number, _name: string, entry: any) => [
                      `₹${val.toLocaleString('en-IN')} · ${((val / totalCategoryRevenue) * 100).toFixed(0)}%`,
                      entry?.payload?.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] uppercase tracking-wider text-[#8F816B]">
                  {activeCategory ?? 'Total Revenue'}
                </span>
                <span className="text-xl text-[#173D2A] mt-1">
                  {activeCategory
                    ? formatCurrency(categoryRevenueData.find(c => c.name === activeCategory)?.revenue ?? 0)
                    : formatCurrency(totalCategoryRevenue)}
                </span>
                <span className="text-[11px] text-[#8F816B] mt-0.5">
                  Top: {topCategory.name}
                </span>
              </div>
            </div>

            {/* Legend / breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm text-[#173D2A] mb-2">Spice Category Breakdown</h4>
              {categoryRevenueData
                .slice()
                .sort((a, b) => b.revenue - a.revenue)
                .map((cat) => {
                  const percent = Math.round((cat.revenue / totalCategoryRevenue) * 100);
                  return (
                    <div
                      key={cat.name}
                      className="space-y-1 cursor-pointer"
                      onMouseEnter={() => setActiveCategory(cat.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-[#1A211D]">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[#8F816B]">{cat.orders} orders</span>
                          <span className="text-[#173D2A]">{formatCurrency(cat.revenue)}</span>
                          <span className="text-[11px] text-[#D99B26] w-8 text-right">{percent}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#F4EFE6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-5 pt-4 border-t border-[#F0EBE0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={() => setShowDataTable(!showDataTable)}
            className="text-xs text-[#173D2A] hover:text-[#D99B26] transition-colors flex items-center gap-1.5"
          >
            {showDataTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showDataTable ? 'Hide Daily Ledger' : 'Show Detailed Daily Ledger Table'}</span>
          </button>

          {onNavigateToTab && (
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => onNavigateToTab('payments')}
                className="text-[#173D2A] hover:text-[#D99B26] flex items-center gap-1"
              >
                <span>View Full Payments Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-[#DCD4C0]">|</span>
              <button
                onClick={() => onNavigateToTab('orders')}
                className="text-[#173D2A] hover:text-[#D99B26] flex items-center gap-1"
              >
                <span>All Orders</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Daily Ledger Table */}
        {showDataTable && (
          <div className="mt-4 overflow-x-auto border border-[#E8E2D5] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-[#736854] border-b border-[#E8E2D5] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Date Interval</th>
                  <th className="py-2.5 px-4 text-right">Revenue (₹)</th>
                  <th className="py-2.5 px-4 text-center">Orders Count</th>
                  <th className="py-2.5 px-4 text-right">Avg Order Value</th>
                  <th className="py-2.5 px-4 text-right">Cumulative Total</th>
                  <th className="py-2.5 px-4 text-right">% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0] text-[#1A211D]">
                {chartData.map((item, idx) => {
                  const share = totalPeriodRevenue > 0 ? ((item.revenue / totalPeriodRevenue) * 100).toFixed(1) : '0';
                  const aov = item.orders > 0 ? Math.round(item.revenue / item.orders) : 0;
                  return (
                    <tr key={idx} className="hover:bg-[#FAF8F3] transition-colors">
                      <td className="py-2 px-4 text-[#173D2A]">{item.date}</td>
                      <td className="py-2 px-4 text-right text-[#173D2A]">{formatCurrency(item.revenue)}</td>
                      <td className="py-2 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#5C5343]">{item.orders}</span>
                      </td>
                      <td className="py-2 px-4 text-right text-[#736854]">{formatCurrency(aov)}</td>
                      <td className="py-2 px-4 text-right text-[#173D2A]">{formatCurrency(item.cumulative || 0)}</td>
                      <td className="py-2 px-4 text-right text-[#D99B26]">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};