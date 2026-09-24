"use client";

import { useState, useMemo } from "react";
import FormattedPrice from "@/components/ui/FormattedPrice";
import { 
  FileText, 
  Search, 
  Printer, 
  X, 
  Download, 
  CheckCircle2, 
  ShoppingBag,
  Sparkles,
  Building2,
  Calendar,
  CreditCard
} from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
}

interface InvoiceOrder {
  id: string;
  paymentRef: string | null;
  totalAmount: number;
  status: string;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  createdAt: string | Date;
  items: InvoiceItem[];
}

export default function InvoicesClient({ orders }: { orders: InvoiceOrder[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceOrder | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.shippingName.toLowerCase().includes(q) ||
        order.shippingEmail.toLowerCase().includes(q) ||
        (order.paymentRef && order.paymentRef.toLowerCase().includes(q))
      );
    });
  }, [orders, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">Invoices & Receipts</h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate, inspect, and print official VAT and commercial receipts for completed customer orders.
          </p>
        </div>
        <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-full">
          {filteredOrders.length} Invoices Available
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice number, client, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:border-brand-midnight transition-colors"
          />
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Billed To</th>
                <th className="p-4">Garment Units</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 text-sm">
                    No invoices match your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const invoiceNum = `INV-SN24-${order.id.slice(-6).toUpperCase()}`;
                  const totalUnits = order.items.reduce((sum, i) => sum + i.quantity, 0);

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedInvoice(order)}
                    >
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900 block">{invoiceNum}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Ref: {order.paymentRef || "N/A"}</span>
                      </td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{order.shippingName}</p>
                        <p className="text-gray-400 font-mono text-[11px]">{order.shippingEmail}</p>
                      </td>
                      <td className="p-4 text-gray-600">
                        {totalUnits} {totalUnits === 1 ? "piece" : "pieces"}
                      </td>
                      <td className="p-4 text-gray-900 font-bold whitespace-nowrap text-sm">
                        <FormattedPrice amount={order.totalAmount} />
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <CheckCircle2 size={10} className="text-emerald-600" /> PAID
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-midnight bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                        >
                          <FileText size={13} /> View Invoice
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

      {/* Invoice Modal Preview / Printable Document */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
            
            {/* Modal Controls Header (Hidden during print) */}
            <div className="print:hidden bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Official Invoice Preview</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 bg-brand-midnight text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors shadow-xs"
                >
                  <Printer size={14} /> Print / Save as PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-8 sm:p-12 text-gray-900 bg-white" id="printable-invoice">
              {/* Brand Letterhead */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-display font-bold text-2xl text-brand-midnight tracking-tight">SN24</span>
                    <span className="text-[10px] font-mono uppercase bg-brand-midnight text-brand-champagne px-2 py-0.5 rounded font-bold">
                      Atelier
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Contemporary Luxury & Bespoke Tailoring</p>
                  <p className="text-xs text-gray-500">Lekki Phase 1, Lagos, Nigeria</p>
                  <p className="text-xs text-gray-500 font-mono">hello@sn24.com.ng</p>
                </div>

                <div className="text-right">
                  <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">INVOICE</h2>
                  <p className="text-xs font-mono font-bold text-gray-700 mt-1">
                    INV-SN24-{selectedInvoice.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Date: {new Date(selectedInvoice.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    STATUS: SETTLED & PAID
                  </span>
                </div>
              </div>

              {/* Billed To / Shipping Address */}
              <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                  <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Billed & Shipped To:</span>
                  <p className="font-bold text-gray-900 text-sm">{selectedInvoice.shippingName}</p>
                  <p className="text-gray-600 mt-0.5">{selectedInvoice.shippingAddress}</p>
                  <p className="text-gray-600">{selectedInvoice.shippingCity}, {selectedInvoice.shippingState} {selectedInvoice.shippingZip}</p>
                  <p className="text-gray-500 font-mono mt-1">{selectedInvoice.shippingEmail}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Payment Reference:</span>
                  <p className="font-mono text-gray-900 font-medium">{selectedInvoice.paymentRef || "DIRECT-GATEWAY"}</p>
                  <span className="font-semibold text-gray-400 uppercase tracking-wider block mt-3 mb-1">Payment Channel:</span>
                  <p className="text-gray-700">Paystack Secured Gateway (Cards / Direct Transfer)</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3">Sizing / Fit</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map(item => (
                      <tr key={item.id}>
                        <td className="p-3">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          {item.color && <span className="text-gray-400 text-[10px]">Color: {item.color}</span>}
                        </td>
                        <td className="p-3 text-gray-700 font-mono text-[11px]">
                          {item.size || "Standard"}
                        </td>
                        <td className="p-3 text-center font-medium">{item.quantity}</td>
                        <td className="p-3 text-right font-mono"><FormattedPrice amount={item.price} /></td>
                        <td className="p-3 text-right font-mono font-bold"><FormattedPrice amount={item.price * item.quantity} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end text-xs mb-8">
                <div className="w-64 space-y-2 border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">
                      <FormattedPrice amount={selectedInvoice.totalAmount} />
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping & Handling:</span>
                    <span className="text-emerald-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total Amount Paid:</span>
                    <span className="font-mono">
                      <FormattedPrice amount={selectedInvoice.totalAmount} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-6">
                Thank you for your patronage. For alterations, bespoke inquiries, or returns, contact concierge at hello@sn24.com.ng.
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
