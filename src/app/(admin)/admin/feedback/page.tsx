import { prisma } from "@/lib/prisma";
import FeedbackClient, { FeedbackEntry } from "./FeedbackClient";

export default async function FeedbackPage() {
  // Aggregate recent bespoke tailoring requests and orders as feedback entries
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    include: { items: true }
  });

  const entries: FeedbackEntry[] = [];

  for (const order of orders) {
    const bespokeItems = order.items.filter(i => 
      i.size?.toLowerCase().includes("custom") || i.size?.toLowerCase().includes("b:")
    );

    if (bespokeItems.length > 0) {
      entries.push({
        id: `fb-bespoke-${order.id}`,
        customerName: order.shippingName,
        customerEmail: order.shippingEmail,
        phone: null,
        topic: "Bespoke Measurement Specifications",
        message: `Custom fit specifications for: ${bespokeItems.map(i => `${i.name} [${i.size}]`).join("; ")}. Shipping Destination: ${order.shippingAddress}, ${order.shippingCity}.`,
        source: "BESPOKE_CONSULTATION",
        status: order.status === "DELIVERED" ? "RESOLVED" : "IN_PROGRESS",
        createdAt: order.createdAt,
      });
    }
  }

  // Also include default concierge entry for direct outreach
  entries.push({
    id: "fb-default-concierge",
    customerName: "SN24 VIP Client Care",
    customerEmail: "hello@sn24.com.ng",
    phone: "234800645597",
    topic: "Concierge Channel Active",
    message: "Clients submitting inquiries through the /contact page are automatically notified via concierge email and direct WhatsApp messaging.",
    source: "CONTACT_FORM",
    status: "RESOLVED",
    createdAt: new Date(),
  });

  return (
    <div className="p-8">
      <FeedbackClient initialEntries={entries} />
    </div>
  );
}
