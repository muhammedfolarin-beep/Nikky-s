import { prisma } from "@/lib/prisma";
import StatusSelect from "./StatusSelect";
import FormattedPrice from "@/components/ui/FormattedPrice";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: true
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-semibold text-gray-800 mb-8">Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="p-4">Order ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No orders have been placed yet.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono text-gray-600">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900 text-sm">{order.shippingName}</p>
                    <p className="text-xs text-gray-500">{order.shippingEmail}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                  </td>
                  <td className="p-4 text-sm text-gray-900 font-medium">
                    <FormattedPrice amount={order.totalAmount} />
                  </td>
                  <td className="p-4">
                    <StatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
