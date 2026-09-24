"use client";

import { useState, useMemo } from "react";
import FormattedPrice from "@/components/ui/FormattedPrice";
import { 
  CreditCard, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface PaymentOrder {
  id: string;
  paymentRef: string | null;
  totalAmount: number;
  status: string;
  shippingName: string;
  shippingEmail: string;
  createdAt: string | Date;
}

export default function PaymentsClient({ orders }: { orders: PaymentOrder[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = 
        statusFilter === "ALL" ? true :
        statusFilter === "PAID" ? order.status === "PAID" || order.status === "DELIVERED" || order.status === "SHIPPED" || order.status === "IN_PRODUCTION" || order.status === "READY_FOR_DISPATCH" :
        order.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        (order.paymentRef && order.paymentRef.toLowerCase().includes(q)) ||
        order.shippingName.toLowerCase().includes(q) ||
        order.shippingEmail.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  const settledRevenue = useMemo(() => {
    return orders
      .filter(o => o.status !== "PENDING" && o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const exportCSV = () => {
    const headers = ["Order ID", "Payment Reference", "Customer Name", "Customer Email", "Amount", "Status", "Date"];
    const rows = filteredOrders.map(o => [
      o.id,
      o.paymentRef || "N/A",
      `"${o.shippingName.replace(/"/g, '""')}"`,
      o.shippingEmail,
      o.totalAmount.toFixed(2),
      o.status,
      new Date(o.createdAt).toISOString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SN24-Transactions-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">Payments & Transactions</h1>
          <p className="text-xs text-gray-500 mt-1">
            Reconcile Paystack payments, track processed settlement transactions, and export reports.
          </p>
        </div>
        <button 
          onClick={exportCSV}
          disabled={filteredOrders.length === 0}
          className="inline-flex items-center gap-2 bg-brand-midnight text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Settled Volume</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            <FormattedPrice amount={settledRevenue} />
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Verified via Paystack</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Processed Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {orders.length}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Total payment requests</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway Status</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-base font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Paystack Live
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Webhook HMAC-SHA512 Active</span>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reference, customer, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-brand-midnight transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {["ALL", "PAID", "PENDING", "CANCELLED"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-brand-midnight text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {status === "ALL" ? "All Transactions" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Payment Reference</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 text-sm">
                    No transactions match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const isPaid = order.status !== "PENDING" && order.status !== "CANCELLED";
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900 block">
                          {order.paymentRef || "DIRECT-CHECKOUT"}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{order.shippingName}</p>
                        <p className="text-gray-400 font-mono text-[11px]">{order.shippingEmail}</p>
                      </td>
                      <td className="p-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          Paystack Card / Transfer
                        </span>
                      </td>
                      <td className="p-4 text-gray-900 font-bold whitespace-nowrap text-sm">
                        <FormattedPrice amount={order.totalAmount} />
                      </td>
                      <td className="p-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                            <CheckCircle2 size={11} className="text-emerald-600" /> SUCCESS
                          </span>
                        ) : order.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                            <Clock size={11} className="text-amber-600" /> PENDING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                            <AlertCircle size={11} className="text-rose-600" /> CANCELLED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
