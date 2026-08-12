"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Settings, LogOut, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { updateUserAccount } from "@/lib/actions";

export default function AccountDashboardClient({ session, orders }: { session: any, orders: any[] }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const res = await updateUserAccount(session.user.id, { name, email });
    
    if (res.success) {
      setMessage({ type: "success", text: "Account details updated successfully!" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update details." });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-brand-softwhite pt-12 pb-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-12">
          <h1 className="font-display text-4xl text-brand-midnight mb-2">My Account</h1>
          <p className="text-brand-graphite">Welcome back, {session.user?.name || "User"}.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                  ${activeTab === "orders" ? "bg-brand-mist text-brand-midnight" : "text-brand-graphite hover:text-brand-midnight hover:bg-brand-mist/50"}`}
              >
                <Package size={18} /> Order History
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                  ${activeTab === "settings" ? "bg-brand-mist text-brand-midnight" : "text-brand-graphite hover:text-brand-midnight hover:bg-brand-mist/50"}`}
              >
                <Settings size={18} /> Account Details
              </button>
              
              <div className="pt-6 mt-6 border-t border-brand-stone">
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-graphite hover:text-red-500 transition-colors w-full text-left"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-[500px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              
              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="font-display text-2xl text-brand-midnight mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="bg-white border border-brand-stone rounded-xl p-12 text-center">
                      <p className="text-brand-graphite mb-4">You haven't placed any orders yet.</p>
                      <Link href="/shop" className="inline-block bg-brand-midnight text-brand-snow px-6 py-2 rounded-full font-medium hover:bg-brand-charcoal transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-brand-stone rounded-xl p-6 shadow-sm hover:shadow-medium transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-brand-stone gap-4">
                            <div>
                              <p className="text-xs text-brand-graphite font-medium uppercase tracking-wide mb-1">Order Placed</p>
                              <p className="text-brand-charcoal font-medium">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-brand-graphite font-medium uppercase tracking-wide mb-1">Total</p>
                              <p className="text-brand-charcoal font-medium">${order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-brand-graphite font-medium uppercase tracking-wide mb-1">Order #</p>
                              <p className="text-brand-charcoal font-medium">{order.id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="sm:text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium 
                                ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-brand-champagne/20 text-brand-champagne'}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="flex-1">
                                  <Link href={`/shop/${item.productId}`} className="font-medium text-brand-charcoal hover:text-brand-champagne transition-colors">
                                    {item.name}
                                  </Link>
                                  <p className="text-sm text-brand-graphite">Qty: {item.quantity} {item.color ? `| Color: ${item.color}` : ""} {item.size ? `| Size: ${item.size}` : ""}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-brand-charcoal">${item.price.toFixed(2)}</p>
                                </div>
                                <Link href={`/shop/${item.productId}`} className="text-sm font-medium text-brand-midnight hover:text-brand-champagne flex items-center gap-1 ml-4">
                                  View Product <ChevronRight size={14} />
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="max-w-2xl">
                  <h2 className="font-display text-2xl text-brand-midnight mb-6">Account Details</h2>
                  <form onSubmit={handleSaveSettings} className="bg-white border border-brand-stone rounded-xl p-8 space-y-6">
                    
                    {message.text && (
                      <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-brand-graphite uppercase tracking-wide mb-2">Full Name</label>
                      <input 
                        name="name" 
                        type="text" 
                        defaultValue={session.user?.name || ""} 
                        required
                        className="w-full bg-transparent border-b border-brand-stone py-2 focus:outline-none focus:border-brand-champagne" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-graphite uppercase tracking-wide mb-2">Email Address</label>
                      <input 
                        name="email" 
                        type="email" 
                        defaultValue={session.user?.email || ""} 
                        required
                        className="w-full bg-transparent border-b border-brand-stone py-2 focus:outline-none focus:border-brand-champagne" 
                      />
                      <p className="text-xs text-brand-graphite mt-2">Note: Changing your email will also change the email you use to sign in.</p>
                    </div>
                    <div className="pt-4">
                      <button 
                        disabled={isSaving}
                        className="bg-brand-midnight text-brand-snow px-8 py-3 rounded-full font-medium hover:bg-brand-charcoal transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
