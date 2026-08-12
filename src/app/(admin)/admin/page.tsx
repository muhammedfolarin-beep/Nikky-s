import { prisma } from "@/lib/prisma";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count()
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-semibold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="$0.00" icon={<DollarSign size={24} className="text-green-600" />} />
        <StatCard title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag size={24} className="text-blue-600" />} />
        <StatCard title="Total Products" value={totalProducts.toString()} icon={<Package size={24} className="text-purple-600" />} />
        <StatCard title="Total Customers" value={totalUsers.toString()} icon={<Users size={24} className="text-orange-600" />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders have been placed yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-4 text-gray-600 font-mono">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 text-gray-800 font-medium">{order.shippingName}</td>
                    <td className="py-4 text-gray-500">{order.createdAt.toLocaleDateString()}</td>
                    <td className="py-4 text-gray-800 font-medium">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
