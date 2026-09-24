import { prisma } from "@/lib/prisma";
import NotificationsClient, { AdminNotification } from "./NotificationsClient";

export default async function NotificationsPage() {
  const [orders, users] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { items: true },
    }),
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { id: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
      }
    })
  ]);

  const notifications: AdminNotification[] = [];

  // 1. Process orders for notifications
  for (const order of orders) {
    const hasCustom = order.items.some(i => i.size?.toLowerCase().includes("custom") || i.size?.toLowerCase().includes("b:"));
    
    if (hasCustom) {
      notifications.push({
        id: `notif-bespoke-${order.id}`,
        type: "BESPOKE_ALERT",
        title: `Bespoke Tailoring Request for Order #${order.id.slice(-6).toUpperCase()}`,
        description: `${order.shippingName} selected custom made-to-measure tailoring. Measurements and garment silhouettes are ready for artisan pattern making.`,
        timestamp: order.createdAt,
        link: `/admin/orders`,
        priority: "high"
      });
    }

    if (order.status === "PAID" || order.status === "DELIVERED" || order.status === "SHIPPED") {
      notifications.push({
        id: `notif-paid-${order.id}`,
        type: "ORDER_PAID",
        title: `Payment Received for Order #${order.id.slice(-6).toUpperCase()}`,
        description: `Verified payment received from ${order.shippingName} (${order.shippingEmail}) via Paystack.`,
        timestamp: order.createdAt,
        link: `/admin/orders`,
        priority: "medium"
      });
    } else if (order.status === "PENDING") {
      notifications.push({
        id: `notif-pending-${order.id}`,
        type: "ORDER_PENDING",
        title: `Pending Checkout for Order #${order.id.slice(-6).toUpperCase()}`,
        description: `Order checkout initialized by ${order.shippingName}. Awaiting Paystack transaction confirmation.`,
        timestamp: order.createdAt,
        link: `/admin/orders`,
        priority: "low"
      });
    }
  }

  // 2. Process customer signups
  for (const user of users) {
    notifications.push({
      id: `notif-user-${user.id}`,
      type: "USER_REGISTERED",
      title: `New Client Registration: ${user.name || "Valued Client"}`,
      description: `${user.email} opened a new account on the SN24 storefront.`,
      timestamp: new Date(),
      link: `/admin/customers`,
      priority: "low"
    });
  }

  // Sort by latest timestamp
  notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-8">
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
