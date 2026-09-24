"use client";

import { useState, useMemo } from "react";
import FormattedPrice from "@/components/ui/FormattedPrice";
import StatusSelect from "./StatusSelect";
import { 
  Search, 
  Filter, 
  Eye, 
  X, 
  Scissors, 
  Truck, 
  MapPin, 
  Mail, 
  Calendar, 
  CreditCard, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ShoppingBag
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentRef?: string | null;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  createdAt: string | Date;
  items: OrderItem[];
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function OrdersTableClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter & Search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.shippingName.toLowerCase().includes(query) ||
        order.shippingEmail.toLowerCase().includes(query) ||
        (order.paymentRef && order.paymentRef.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  // Check if an item is custom bespoke
  const isCustomBespoke = (size?: string | null) => {
    if (!size) return false;
    const lower = size.toLowerCase();
    return lower.includes("custom") || lower.includes("bespoke") || lower.includes("b:");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer fulfillment, inspect custom bespoke sizing, and update dispatch pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, customer, email, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:border-brand-midnight transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter size={15} className="text-gray-400 shrink-0" />
          {["ALL", "PENDING", "PAID", "IN_PRODUCTION", "READY_FOR_DISPATCH", "SHIPPED", "DELIVERED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? "bg-brand-midnight text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "ALL" ? "All" : status.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/75 border-b border-gray-200">
              <tr className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Order Ref</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items & Tailoring</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 text-sm">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const hasCustomFit = order.items.some((i) => isCustomBespoke(i.size));
                  const totalUnits = order.items.reduce((acc, i) => acc + i.quantity, 0);

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-gray-800">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        {order.paymentRef && (
                          <span className="block text-[10px] font-mono text-gray-400 truncate max-w-[120px]" title={order.paymentRef}>
                            {order.paymentRef}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm">{order.shippingName}</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-[180px]">{order.shippingEmail}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-700 font-medium">
                            {totalUnits} {totalUnits === 1 ? "piece" : "pieces"}
                          </span>
                          {hasCustomFit && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <Scissors size={10} className="text-amber-700" /> Bespoke
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate max-w-[200px] mt-0.5">
                          {order.items.map((i) => i.name).join(", ")}
                        </p>
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        <FormattedPrice amount={order.totalAmount} />
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <StatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-gray-900">
                    Order #{selectedOrder.id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedOrder.status === "PAID" ? "bg-blue-100 text-blue-800" :
                    selectedOrder.status === "IN_PRODUCTION" ? "bg-purple-100 text-purple-800" :
                    selectedOrder.status === "READY_FOR_DISPATCH" ? "bg-teal-100 text-teal-800" :
                    selectedOrder.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {selectedOrder.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Planted on {new Date(selectedOrder.createdAt).toLocaleString("en-GB")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print Order Summary"
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Printer size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6">
              
              {/* Order Status Controller */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                    Fulfillment Pipeline
                  </span>
                  <p className="text-xs text-gray-500">Update current tailoring or dispatch stage</p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <StatusSelect orderId={selectedOrder.id} currentStatus={selectedOrder.status} />
                </div>
              </div>

              {/* Customer & Shipping Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-xs uppercase tracking-wider mb-2">
                    <Mail size={14} className="text-brand-midnight" />
                    <span>Client Details</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedOrder.shippingName}</p>
                  <p className="text-xs text-gray-600 font-mono">{selectedOrder.shippingEmail}</p>
                  {selectedOrder.user && (
                    <span className="inline-block text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                      Registered Client Account
                    </span>
                  )}
                </div>

                {/* Delivery Information */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-xs uppercase tracking-wider mb-2">
                    <Truck size={14} className="text-brand-midnight" />
                    <span>Courier Destination</span>
                  </div>
                  <p className="text-xs text-gray-900 font-medium leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingZip}
                  </p>
                  <p className="text-[11px] font-medium text-brand-midnight pt-1">
                    {selectedOrder.shippingState.toLowerCase().includes("lagos") 
                      ? "⚡ Lagos Local Courier Dispatch"
                      : "📦 GIG Logistics Interstate Express"}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block">Payment Method</span>
                    <span className="text-xs text-gray-500 font-mono">
                      {selectedOrder.paymentRef ? `Paystack (${selectedOrder.paymentRef})` : "Direct Verification"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Amount Paid</span>
                  <span className="text-base font-bold text-gray-900">
                    <FormattedPrice amount={selectedOrder.totalAmount} />
                  </span>
                </div>
              </div>

              {/* Itemized Garments & Custom Measurements */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-brand-midnight" />
                  <span>Garments & Tailoring Specs ({selectedOrder.items.length})</span>
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const custom = isCustomBespoke(item.size);

                    return (
                      <div 
                        key={item.id || idx} 
                        className={`border rounded-xl p-4 transition-all ${
                          custom 
                            ? "border-amber-200 bg-amber-50/30" 
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {item.color && (
                                <span className="text-xs text-gray-600">
                                  Color: <strong>{item.color}</strong>
                                </span>
                              )}
                              <span className="text-gray-300">&bull;</span>
                              <span className="text-xs text-gray-600">
                                Qty: <strong>{item.quantity}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">
                              <FormattedPrice amount={item.price * item.quantity} />
                            </span>
                            <span className="block text-[11px] text-gray-400">
                              <FormattedPrice amount={item.price} /> each
                            </span>
                          </div>
                        </div>

                        {/* Sizing & Bespoke Custom Measurements Callout */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
                          {custom ? (
                            <div className="bg-amber-100/60 border border-amber-200/80 rounded-lg p-3">
                              <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold mb-1">
                                <Scissors size={14} />
                                <span>Bespoke Made-to-Measure Specifications:</span>
                              </div>
                              <p className="text-xs font-mono text-amber-950 font-medium leading-relaxed">
                                {item.size}
                              </p>
                              <span className="block text-[10px] text-amber-800/80 mt-1 italic">
                                * Artisan tailoring window: 5–7 working days prior to courier pickup.
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-600">
                              Standard Sizing: <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">{item.size || "Standard"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between text-xs text-gray-500 mt-auto">
              <span>Order Reference ID: <strong className="font-mono text-gray-800">{selectedOrder.id}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-brand-midnight text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
