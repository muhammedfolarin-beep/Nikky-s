import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { 
  LayoutDashboard, Package, ShoppingBag, Users, LogOut, 
  CreditCard, RefreshCw, FileText, CornerUpLeft, 
  Bell, MessageSquare, Settings, Moon, Search, Calendar 
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin-login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    redirect("/home");
  }

  return (
    <div className="flex h-screen bg-[#F5F6F8] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-6">
          <Link href="/admin" className="font-display font-semibold text-2xl tracking-tight text-brand-midnight flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-midnight rounded flex items-center justify-center text-white">
              N
            </div>
            Nikky's
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Main Menu */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 mb-2 px-4">Main Menu</p>
            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <LayoutDashboard size={18} /> Analytics
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-brand-champagne/10 text-brand-champagne font-medium transition-colors text-sm">
                <Package size={18} /> Product
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <ShoppingBag size={18} /> Sales
              </Link>
              <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <Users size={18} /> Customers
              </Link>
            </nav>
          </div>

          {/* Transaction */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 mb-2 px-4">Transaction</p>
            <nav className="space-y-1">
              <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <CreditCard size={18} /> Payment
              </Link>
              <Link href="/admin/refunds" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <RefreshCw size={18} /> Refunds
              </Link>
              <Link href="/admin/invoices" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <FileText size={18} /> Invoice
              </Link>
              <Link href="/admin/returns" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <CornerUpLeft size={18} /> Returns
              </Link>
            </nav>
          </div>

          {/* General */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 px-4">General</p>
            <nav className="space-y-1">
              <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <Bell size={18} /> Notifications
              </Link>
              <Link href="/admin/feedback" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <MessageSquare size={18} /> Feedback
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <Settings size={18} /> Setting
              </Link>
              <button className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Moon size={18} /> Dark Mode
                </div>
                <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-[#F5F6F8] px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          </div>
          
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-champagne"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs border border-gray-200 rounded px-1">&#8984;K</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 cursor-pointer">
                <Calendar size={16} /> Feb
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 cursor-pointer">
                Sales
              </div>
            </div>
            
            <AdminProfileDropdown 
              name={user?.name || "Nikky Admin"} 
              role={user?.role || "Manager"}
              imageUrl={session.user?.image}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
