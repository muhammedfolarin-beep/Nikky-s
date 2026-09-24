"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Bell, 
  CheckCircle2, 
  Scissors, 
  UserPlus, 
  Clock, 
  Filter, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";

export interface AdminNotification {
  id: string;
  type: "ORDER_PAID" | "BESPOKE_ALERT" | "ORDER_PENDING" | "USER_REGISTERED";
  title: string;
  description: string;
  timestamp: string | Date;
  link?: string;
  priority: "high" | "medium" | "low";
}

export default function NotificationsClient({ initialNotifications }: { initialNotifications: AdminNotification[] }) {
  const [filterType, setFilterType] = useState("ALL");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return initialNotifications.filter(n => {
      if (filterType === "ALL") return true;
      if (filterType === "ORDERS") return n.type === "ORDER_PAID" || n.type === "ORDER_PENDING";
      if (filterType === "BESPOKE") return n.type === "BESPOKE_ALERT";
      if (filterType === "USERS") return n.type === "USER_REGISTERED";
      return true;
    });
  }, [initialNotifications, filterType]);

  const markAllRead = () => {
    const all = new Set(initialNotifications.map(n => n.id));
    setReadIds(all);
  };

  const getIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "BESPOKE_ALERT":
        return <Scissors size={18} className="text-amber-600" />;
      case "ORDER_PAID":
        return <ShoppingBag size={18} className="text-emerald-600" />;
      case "ORDER_PENDING":
        return <Clock size={18} className="text-blue-600" />;
      case "USER_REGISTERED":
        return <UserPlus size={18} className="text-purple-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getBadge = (type: AdminNotification["type"]) => {
    switch (type) {
      case "BESPOKE_ALERT":
        return <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Bespoke Tailoring</span>;
      case "ORDER_PAID":
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">New Order Paid</span>;
      case "ORDER_PENDING":
        return <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Payment Pending</span>;
      case "USER_REGISTERED":
        return <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">New Client</span>;
    }
  };

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">System Notifications</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time feed of newly placed orders, custom tailoring requests, and client activity.
          </p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-xs font-semibold text-brand-midnight hover:text-brand-champagne transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter size={14} className="text-gray-400" />
        {[
          { label: "All Activity", value: "ALL" },
          { label: "Orders", value: "ORDERS" },
          { label: "Bespoke Requests", value: "BESPOKE" },
          { label: "Client Accounts", value: "USERS" }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterType === tab.value
                ? "bg-brand-midnight text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">You're All Caught Up!</h3>
            <p className="text-gray-400 text-xs">No pending notifications in this category.</p>
          </div>
        ) : (
          filtered.map(notification => {
            const isRead = readIds.has(notification.id);
            return (
              <div 
                key={notification.id} 
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-gray-50/70 ${
                  isRead ? "opacity-60 bg-gray-50/30" : "bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {getBadge(notification.type)}
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(notification.timestamp).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-gray-900 leading-snug">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    {notification.description}
                  </p>
                </div>

                {notification.link && (
                  <Link 
                    href={notification.link}
                    className="shrink-0 p-2 text-gray-400 hover:text-brand-midnight hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Resource"
                  >
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
