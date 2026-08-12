import { FileText, Search } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Invoices</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-champagne"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Generation Offline</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Once PDF generation is enabled, you will be able to view and download customer invoices directly from this page.
          </p>
        </div>
      </div>
    </div>
  );
}
