import { getAdminAnalyticsData } from "@/lib/actions";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  PackageCheck, 
  Clock, 
  MapPin, 
  Activity, 
  BarChart3,
  Layers,
  ArrowUpRight
} from "lucide-react";
import FormattedPrice from "@/components/ui/FormattedPrice";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getAdminAnalyticsData();

  const maxDailyRevenue = Math.max(
    ...data.dailyTimeline.map((d) => d.revenue),
    100 // Avoid division by zero
  );

  const statusColorMap: Record<string, { bg: string; text: string; label: string }> = {
    PAID: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Paid / Confirmed" },
    IN_PRODUCTION: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "In Atelier Production" },
    READY_FOR_DISPATCH: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Ready for Dispatch" },
    SHIPPED: { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", label: "With Courier / In Transit" },
    DELIVERED: { bg: "bg-emerald-100 border-emerald-300", text: "text-emerald-800", label: "Delivered Successfully" },
    PENDING: { bg: "bg-gray-100 border-gray-200", text: "text-gray-600", label: "Pending Payment" },
    CANCELLED: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", label: "Cancelled / Refunded" },
  };

  return (
    <div className="pt-4 pb-16 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Live Operations Sync
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
            Store Performance & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time revenue, order velocity, inventory movement, and fulfillment metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <span>Manage Orders</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Verified Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Gross Verified Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">
              <FormattedPrice amount={data.totalRevenue} />
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={13} />
              <span>From {data.paidOrdersCount} completed transactions</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Order Volume</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">
              {data.totalOrdersCount}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-2">
              {data.totalOrdersCount > 0 
                ? `${Math.round((data.paidOrdersCount / data.totalOrdersCount) * 100)}% payment conversion rate` 
                : "No orders registered yet"}
            </p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Average Order Value (AOV)</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Activity size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">
              <FormattedPrice amount={data.averageOrderValue} />
            </div>
            <p className="text-xs text-gray-500 font-medium mt-2">
              Average basket size per buyer
            </p>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Client Accounts</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Users size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">
              {data.totalCustomersCount}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-2">
              Registered customers in database
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">Pending Checkout Pipeline</span>
            <div className="text-lg font-bold text-gray-900">
              {data.pendingOrdersCount} orders (<FormattedPrice amount={data.pendingRevenue} />)
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PackageCheck size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">Fulfillment & Dispatch Rate</span>
            <div className="text-lg font-bold text-gray-900">
              {data.fulfillmentRate}% of paid orders delivered/shipped
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">Active Ready-to-Wear Catalog</span>
            <div className="text-lg font-bold text-gray-900">
              {data.totalProductsCount} pieces published
            </div>
          </div>
        </div>
      </div>

      {/* 14-Day Sales Velocity Chart */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-gray-700" />
              <span>14-Day Daily Revenue & Order Velocity</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Daily revenue volume based on confirmed store checkouts.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-900"></span> Verified Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-200"></span> Orders
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="h-64 flex items-end gap-2 md:gap-4 border-b border-gray-200 pb-2">
            {data.dailyTimeline.map((day, idx) => {
              const heightPercent = day.revenue > 0 ? Math.max(12, Math.round((day.revenue / maxDailyRevenue) * 100)) : 4;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-gray-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none">
                    <span className="font-bold">{day.label}:</span> ${day.revenue.toFixed(2)} ({day.orders} {day.orders === 1 ? 'order' : 'orders'})
                  </div>

                  {/* Daily Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                        day.revenue > 0 ? "bg-gray-900 group-hover:bg-brand-charcoal" : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    ></div>
                  </div>

                  {/* Date Label */}
                  <span className="text-[10px] text-gray-400 font-mono mt-3 truncate w-full text-center">
                    {day.label.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 font-mono pt-2">
            <span>{data.dailyTimeline[0]?.label}</span>
            <span>{data.dailyTimeline[data.dailyTimeline.length - 1]?.label}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top-Selling Garments */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Top-Selling Ready-to-Wear Pieces
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Ranked by units sold across all confirmed customer orders.
          </p>

          {data.topProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No sales data recorded yet. New product orders will appear here automatically.
            </div>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((prod, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{prod.name}</h3>
                      <span className="text-xs text-gray-500">{prod.quantity} units sold</span>
                    </div>
                  </div>
                  <div className="text-right font-bold text-sm text-gray-900">
                    <FormattedPrice amount={prod.revenue} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status & Geographic Distribution */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Order Fulfillment Breakdown
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Distribution of orders across operational stages.
            </p>

            <div className="space-y-3 mb-8">
              {Object.entries(data.statusCounts).map(([status, count]) => {
                if (count === 0) return null;
                const meta = statusColorMap[status] || { bg: "bg-gray-50", text: "text-gray-700", label: status };
                const pct = data.totalOrdersCount > 0 ? Math.round((count / data.totalOrdersCount) * 100) : 0;
                return (
                  <div key={status} className={`p-3.5 rounded-xl border flex items-center justify-between ${meta.bg}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${meta.text === "text-emerald-700" ? "bg-emerald-600" : "bg-gray-600"}`}></span>
                      <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      {count} ({pct}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Shipping Destinations */}
          {data.topDestinations.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-600" />
                <span>Top Delivery Destinations</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.topDestinations.map((dest, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium">
                    {dest.state}: <strong>{dest.count}</strong> {dest.count === 1 ? 'order' : 'orders'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Recent Live Transactions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Live Activity</h2>
            <p className="text-xs text-gray-500">Real-time orders recorded directly from customer checkouts.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            View all orders &rarr;
          </Link>
        </div>

        <div className="p-6">
          {data.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm">No live orders logged in database yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                    <th className="pb-3">Order Ref</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-100">
                  {data.recentOrders.map((order) => {
                    const meta = statusColorMap[order.status] || { bg: "bg-gray-50", text: "text-gray-700", label: order.status };
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 font-mono font-bold text-gray-800">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3.5">
                          <div className="font-semibold text-gray-900">{order.customerName}</div>
                          <div className="text-[11px] text-gray-400">{order.customerEmail}</div>
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {order.city}, {order.state}
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {order.itemCount} {order.itemCount === 1 ? 'piece' : 'pieces'}
                        </td>
                        <td className="py-3.5 font-bold text-gray-900">
                          <FormattedPrice amount={order.totalAmount} />
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.bg} ${meta.text}`}>
                            {meta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
