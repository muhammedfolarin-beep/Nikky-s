"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { updateStoreSettings } from "@/lib/actions";

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState({
    storeName: initialSettings?.storeName || "Nikky's",
    contactEmail: initialSettings?.contactEmail || "hello@nikkys.com",
    contactPhone: initialSettings?.contactPhone || "",
    currency: initialSettings?.currency || "USD",
    timezone: initialSettings?.timezone || "UTC",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const result = await updateStoreSettings(formData);
    
    if (result.success) {
      setMessage("Settings saved successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setMessage(result.error || "Failed to save settings");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="pt-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Store Settings</h1>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-midnight text-white font-medium hover:bg-gray-800 text-sm transition-colors"
        >
          <Save size={16} /> {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium mb-6 ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Store Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-6">Store Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input 
                type="text" 
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input 
                type="email" 
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input 
                type="text" 
                placeholder="e.g. +1 234 567 8900"
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
              />
            </div>
          </div>
        </div>

        {/* Currency & Region */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-6">Currency & Region</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
              <select 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50 appearance-none"
              >
                <option value="USD">USD ($)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Timezone</label>
              <select 
                value={formData.timezone}
                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50 appearance-none"
              >
                <option value="UTC">UTC (GMT+0)</option>
                <option value="WAT">West Africa Time (GMT+1)</option>
                <option value="EST">Eastern Standard Time (GMT-5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
          <h3 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-6">Proceed with caution. These actions cannot be undone.</p>
          
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Pause Storefront</h4>
              <p className="text-xs text-gray-500">Temporarily disable checkout and hide products.</p>
            </div>
            <button type="button" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              Pause Store
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
