import { prisma } from "@/lib/prisma";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      paymentRef: true,
      totalAmount: true,
      status: true,
      shippingName: true,
      shippingEmail: true,
      createdAt: true,
    }
  });

  return (
    <div className="p-8">
      <PaymentsClient orders={orders} />
    </div>
  );
}
