import { prisma } from "@/lib/prisma";
import OrdersTableClient from "./OrdersTableClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  return (
    <div className="p-8">
      <OrdersTableClient initialOrders={orders} />
    </div>
  );
}
