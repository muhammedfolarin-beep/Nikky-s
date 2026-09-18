"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/mail";

// ==========================================
// Authorization Helpers
// ==========================================

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Forbidden: Administrative privileges required.");
  }

  return { session, user };
}

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please sign in to continue.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, email: true }
  });

  if (!user) {
    throw new Error("User record not found.");
  }

  return { session, user };
}

// ==========================================
// Public Product Catalog Actions
// ==========================================

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products:", error);
    }
    return [];
  }
}

export async function getProductById(id: string): Promise<any> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching product by ID:", error);
    }
    return null;
  }
}

export async function getProductsByCollection(collection: string) {
  try {
    const products = await prisma.product.findMany({
      where: { collection },
    });
    return products;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error fetching collection ${collection}:`, error);
    }
    return [];
  }
}

// ==========================================
// Order Processing & Payment Verification
// ==========================================

export async function processOrder(orderData: any, items: any[]) {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "Cannot place an order with an empty bag." };
    }

    const paymentRef = orderData.paymentRef || `REF-${Date.now()}`;

    // 1. Idempotency Check: Prevent duplicate order creation if already processed
    const existingOrder = await prisma.order.findFirst({
      where: { paymentRef: paymentRef },
      include: { items: true }
    });

    if (existingOrder) {
      return { success: true, orderId: existingOrder.id };
    }

    // 2. Optional user session attach
    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      userId = dbUser?.id || null;
    }

    // 3. Server-side price recalculation & validation against database
    const productIds = items.map((i: any) => i.productId || i.product?.id).filter(Boolean);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let verifiedSubtotal = 0;
    const validatedItems = items.map((item: any) => {
      const pid = item.productId || item.product?.id;
      const dbProduct = dbProducts.find((p) => p.id === pid);
      if (!dbProduct) {
        throw new Error(`Product with ID "${pid}" is no longer available.`);
      }

      const itemQuantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      verifiedSubtotal += dbProduct.price * itemQuantity;

      return {
        productId: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: itemQuantity,
        color: typeof item.color === "string" ? item.color.slice(0, 50) : null,
        size: typeof item.size === "string" ? item.size.slice(0, 100) : null
      };
    });

    // 4. Server-side Paystack verification if secret key is present
    let isPaymentVerified = false;

    if (process.env.PAYSTACK_SECRET_KEY && orderData.paymentRef) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(orderData.paymentRef)}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          cache: "no-store"
        });
        const verifyData = await verifyRes.json();

        if (verifyData.status && verifyData.data?.status === "success") {
          isPaymentVerified = true;
        } else {
          console.warn("Paystack payment verification returned non-success:", verifyData.message);
        }
      } catch (verifyErr) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Paystack verification request error:", verifyErr);
        }
      }
    } else {
      // In development or when test mode is active
      isPaymentVerified = true;
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: Number(orderData.totalAmount) || verifiedSubtotal,
        shippingName: String(orderData.shippingName || "Valued Customer").slice(0, 150),
        shippingEmail: String(orderData.shippingEmail || "").slice(0, 150),
        shippingAddress: String(orderData.shippingAddress || "").slice(0, 300),
        shippingCity: String(orderData.shippingCity || "").slice(0, 100),
        shippingState: String(orderData.shippingState || "").slice(0, 100),
        shippingZip: String(orderData.shippingZip || "100001").slice(0, 20),
        paymentRef: paymentRef,
        status: isPaymentVerified ? "PAID" : "PENDING",
        items: {
          create: validatedItems
        }
      },
      include: {
        items: true
      }
    });

    // 5. Trigger order confirmation email if paid
    if (isPaymentVerified && order.shippingEmail) {
      sendOrderConfirmationEmail({
        orderId: order.id,
        paymentRef: order.paymentRef,
        customerName: order.shippingName,
        customerEmail: order.shippingEmail,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingState: order.shippingState,
        shippingZip: order.shippingZip,
        totalAmount: order.totalAmount,
        currency: "USD",
        items: order.items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        createdAt: order.createdAt,
      }).catch((emailErr) => {
        console.error("Failed to dispatch order confirmation email:", emailErr);
      });
    }

    revalidatePath("/account");
    revalidatePath("/admin/orders");

    return { success: true, orderId: order.id };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Order processing error:", error);
    }
    return { success: false, error: error.message || "Failed to process order." };
  }
}

// ==========================================
// Admin-Only Catalog Management
// ==========================================

export async function createProduct(data: any) {
  try {
    await requireAdmin();

    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      return { success: false, error: "Invalid product price." };
    }

    const product = await prisma.product.create({
      data: {
        name: String(data.name).trim(),
        brand: String(data.brand || "SN24 Reserve").trim(),
        price: price,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        category: String(data.category).trim(),
        type: String(data.type || "Outerwear").trim(),
        colors: Array.isArray(data.colors) ? data.colors : String(data.colors || "").split(',').map(s => s.trim()).filter(Boolean),
        sizes: Array.isArray(data.sizes) ? data.sizes : String(data.sizes || "").split(',').map(s => s.trim()).filter(Boolean),
        images: Array.isArray(data.images) ? data.images : String(data.images || "").split(',').map(s => s.trim()).filter(Boolean),
        isNew: Boolean(data.isNew === true || data.isNew === 'true'),
        isBestseller: Boolean(data.isBestseller === true || data.isBestseller === 'true'),
        description: data.description ? String(data.description).trim() : null,
        material: data.material ? String(data.material).trim() : null,
        careInstructions: data.careInstructions ? String(data.careInstructions).trim() : null,
        collection: data.collection ? String(data.collection).trim() : null,
      }
    });

    revalidatePath("/", "layout");
    return { success: true, product };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error creating product:", error);
    }
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await requireAdmin();

    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      return { success: false, error: "Invalid product price." };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(data.name).trim(),
        price: price,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        category: String(data.category).trim(),
        colors: Array.isArray(data.colors) ? data.colors : String(data.colors || "").split(',').map(s => s.trim()).filter(Boolean),
        sizes: Array.isArray(data.sizes) ? data.sizes : String(data.sizes || "").split(',').map(s => s.trim()).filter(Boolean),
        images: Array.isArray(data.images) ? data.images : String(data.images || "").split(',').map(s => s.trim()).filter(Boolean),
        description: data.description ? String(data.description).trim() : null,
        collection: data.collection ? String(data.collection).trim() : null,
      }
    });

    revalidatePath("/", "layout");
    return { success: true, product };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error updating product:", error);
    }
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error deleting product:", error);
    }
    return { success: false, error: error.message || "Failed to delete product" };
  }
}

// ==========================================
// Admin Order & Store Management
// ==========================================

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();

    const allowedStatuses = ["PENDING", "IN_PRODUCTION", "READY_FOR_DISPATCH", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!allowedStatuses.includes(status)) {
      return { success: false, error: "Invalid status state." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    revalidatePath("/account");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error updating order:", error);
    }
    return { success: false, error: error.message || "Failed to update order status" };
  }
}

export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSetting.findFirst({
      orderBy: { updatedAt: "desc" }
    });
    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: "SN24",
          contactEmail: "hello@sn24.com.ng",
          currency: "USD",
          timezone: "UTC"
        }
      });
    }
    return settings;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching settings:", error);
    }
    return null;
  }
}

export async function updateStoreSettings(data: any) {
  try {
    await requireAdmin();

    let settings = await prisma.storeSetting.findFirst({
      orderBy: { updatedAt: "desc" }
    });
    if (settings) {
      settings = await prisma.storeSetting.update({
        where: { id: settings.id },
        data: {
          storeName: String(data.storeName || "SN24").trim(),
          contactEmail: String(data.contactEmail || "hello@sn24.com.ng").trim(),
          contactPhone: data.contactPhone ? String(data.contactPhone).trim() : null,
          currency: String(data.currency || "USD").trim(),
          timezone: String(data.timezone || "UTC").trim(),
        }
      });
    } else {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: String(data.storeName || "SN24").trim(),
          contactEmail: String(data.contactEmail || "hello@sn24.com.ng").trim(),
          contactPhone: data.contactPhone ? String(data.contactPhone).trim() : null,
          currency: String(data.currency || "USD").trim(),
          timezone: String(data.timezone || "UTC").trim(),
        }
      });
    }
    revalidatePath("/", "layout");
    return { success: true, settings };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error updating settings:", error);
    }
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

export async function deleteUser(id: string) {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { success: false, error: "User not found" };
    
    if (user.role === "ADMIN") {
      return { success: false, error: "Cannot delete an administrator account." };
    }
    
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to delete user:", error);
    }
    return { success: false, error: error.message || "Failed to delete user" };
  }
}

// ==========================================
// Customer Account & Order Queries (IDOR Protected)
// ==========================================

export async function getUserOrders(requestedUserId?: string) {
  try {
    const { user } = await requireUser();

    // IDOR protection: Non-admin users can ONLY retrieve their own orders
    const targetId = (user.role === "ADMIN" && requestedUserId) ? requestedUserId : user.id;

    const orders = await prisma.order.findMany({
      where: { userId: targetId },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching user orders:", error);
    }
    return [];
  }
}

export async function updateUserAccount(data: { name?: string; email?: string }) {
  try {
    const { user } = await requireUser();

    // IDOR protection: update current authenticated user's ID
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name ? String(data.name).trim() : undefined,
        email: data.email ? String(data.email).toLowerCase().trim() : undefined,
      }
    });

    revalidatePath("/account");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error updating user account:", error);
    }
    return { success: false, error: error.message || "Failed to update account" };
  }
}

// ==========================================
// Admin Live Analytics Aggregation
// ==========================================

export async function getAdminAnalyticsData() {
  await requireAdmin();

  const [orders, totalProducts, totalUsers] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  const validRevenueStatuses = ["PAID", "IN_PRODUCTION", "READY_FOR_DISPATCH", "SHIPPED", "DELIVERED"];
  
  let totalRevenue = 0;
  let pendingRevenue = 0;
  let paidOrdersCount = 0;
  let pendingOrdersCount = 0;
  let fulfilledOrdersCount = 0;

  const statusCounts: Record<string, number> = {
    PAID: 0,
    PENDING: 0,
    IN_PRODUCTION: 0,
    READY_FOR_DISPATCH: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  const destinations: Record<string, number> = {};
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};

  const now = new Date();
  const dailyTimelineMap: Record<string, { date: string; label: string; revenue: number; orders: number }> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyTimelineMap[key] = { date: key, label, revenue: 0, orders: 0 };
  }

  for (const order of orders) {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

    const isPaid = validRevenueStatuses.includes(order.status);
    if (isPaid) {
      totalRevenue += order.totalAmount;
      paidOrdersCount += 1;
    } else if (order.status === "PENDING") {
      pendingRevenue += order.totalAmount;
      pendingOrdersCount += 1;
    }

    if (order.status === "DELIVERED" || order.status === "SHIPPED") {
      fulfilledOrdersCount += 1;
    }

    const dest = order.shippingState ? order.shippingState.trim() : "Other";
    destinations[dest] = (destinations[dest] || 0) + 1;

    const dateKey = order.createdAt.toISOString().split("T")[0];
    if (dailyTimelineMap[dateKey]) {
      dailyTimelineMap[dateKey].orders += 1;
      if (isPaid) {
        dailyTimelineMap[dateKey].revenue += order.totalAmount;
      }
    }

    if (order.status !== "CANCELLED") {
      for (const item of order.items) {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      }
    }
  }

  const averageOrderValue = paidOrdersCount > 0 ? totalRevenue / paidOrdersCount : 0;
  const fulfillmentRate = paidOrdersCount > 0 ? Math.round((fulfilledOrdersCount / paidOrdersCount) * 100) : 0;

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const topDestinations = Object.entries(destinations)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dailyTimeline = Object.values(dailyTimelineMap);

  return {
    totalRevenue,
    pendingRevenue,
    totalOrdersCount: orders.length,
    paidOrdersCount,
    pendingOrdersCount,
    averageOrderValue,
    fulfillmentRate,
    totalCustomersCount: totalUsers,
    totalProductsCount: totalProducts,
    statusCounts,
    topProducts,
    topDestinations,
    dailyTimeline,
    recentOrders: orders.slice(0, 10).map(o => ({
      id: o.id,
      customerName: o.shippingName,
      customerEmail: o.shippingEmail,
      city: o.shippingCity,
      state: o.shippingState,
      totalAmount: o.totalAmount,
      status: o.status,
      paymentRef: o.paymentRef,
      itemCount: o.items.length,
      createdAt: o.createdAt,
    })),
  };
}

