"use client";

import { useState, useMemo } from "react";
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ExternalLink,
  Sparkles,
  Scissors
} from "lucide-react";

export interface FeedbackEntry {
  id: string;
  customerName: string;
  customerEmail: string;
  phone?: string | null;
  topic: string;
  message: string;
  source: "CONTACT_FORM" | "BESPOKE_CONSULTATION" | "ORDER_NOTE";
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string | Date;
}

export default function FeedbackClient({ initialEntries }: { initialEntries: FeedbackEntry[] }) {
  const [entries, setEntries] = useState<FeedbackEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEntry, setSelectedEntry] = useState<FeedbackEntry | null>(null);

  const filtered = useMemo(() => {
    return entries.filter(item => {
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [entries, searchQuery, statusFilter]);

  const toggleStatus = (id: string, newStatus: FeedbackEntry["status"]) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">Client Feedback & Enquiries</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review styling inquiries, custom fit consultations, and concierge contact submissions.
          </p>
        </div>
        <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-full">
          {filtered.length} Inquiries Logged
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search client, email, or message content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:border-brand-midnight transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-brand-midnight text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status === "ALL" ? "All Inquiries" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-16 text-center shadow-xs">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No Inquiries Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Customer submissions from the concierge contact form and bespoke requests will be listed here.
            </p>
          </div>
        ) : (
          filtered.map(entry => (
            <div 
              key={entry.id} 
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {entry.topic}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-900 mt-2">{entry.customerName}</h3>
                    <p className="text-xs text-gray-400 font-mono">{entry.customerEmail}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    entry.status === "NEW" ? "bg-amber-100 text-amber-800" :
                    entry.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                    "bg-emerald-100 text-emerald-800"
                  }`}>
                    {entry.status.replace("_", " ")}
                  </span>
                </div>

                <div className="bg-gray-50/75 rounded-lg p-3 text-xs text-gray-700 leading-relaxed mb-4 border border-gray-100">
                  {entry.message}
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <span className="text-[11px] text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${entry.customerEmail}?subject=Re: ${encodeURIComponent(entry.topic)} - SN24 Concierge`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-midnight hover:bg-gray-100 rounded transition-colors"
                  >
                    <Mail size={12} /> Email Reply
                  </a>

                  {entry.phone && (
                    <a
                      href={`https://wa.me/${entry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                    >
                      <Phone size={12} /> WhatsApp
                    </a>
                  )}

                  <button
                    onClick={() => toggleStatus(entry.id, entry.status === "RESOLVED" ? "IN_PROGRESS" : "RESOLVED")}
                    className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    {entry.status === "RESOLVED" ? "Re-open" : "Resolve"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
