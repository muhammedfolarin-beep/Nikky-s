import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      orders: true
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-semibold text-gray-800 mb-8">Customers</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="p-4">Customer</th>
              <th className="p-4">Role</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map(customer => {
              const totalSpent = customer.orders.reduce((acc, order) => acc + order.totalAmount, 0);
              
              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{customer.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-900 font-medium">
                    {customer.orders.length}
                  </td>
                  <td className="p-4 text-sm text-gray-900 font-medium">
                    ${totalSpent.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
