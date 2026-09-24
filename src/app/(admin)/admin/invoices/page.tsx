import { prisma } from "@/lib/prisma";
import InvoicesClient from "./InvoicesClient";

export default async function InvoicesPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        notIn: ["PENDING", "CANCELLED"]
      }
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: true
    }
  });

  return (
    <div className="p-8">
      <InvoicesClient orders={orders} />
    </div>
  );
}
