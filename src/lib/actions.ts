"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products.map(product => ({
      ...product,
      colors: product.colors.split(','),
      sizes: product.sizes.split(','),
      images: product.images.split(','),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (product) {
    product.images = product.images.split(',') as any;
    product.colors = product.colors.split(',') as any;
    product.sizes = product.sizes.split(',') as any;
  }
  
  return product;
}

export async function processOrder(orderData: any, items: any[]) {
  try {
    const order = await prisma.order.create({
      data: {
        totalAmount: orderData.totalAmount,
        shippingName: orderData.shippingName,
        shippingEmail: orderData.shippingEmail,
        shippingAddress: orderData.shippingAddress,
        shippingCity: orderData.shippingCity,
        shippingState: orderData.shippingState,
        shippingZip: orderData.shippingZip,
        paymentRef: orderData.paymentRef || `REF-${Date.now()}`,
        status: "PAID",
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size
          }))
        }
      }
    });
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order processing error:", error);
    return { success: false, error: "Failed to process order" };
  }
}

export async function getProductsByCollection(collection: string) {
  try {
    const products = await prisma.product.findMany({
      where: { collection },
    });
    return products.map(product => ({
      ...product,
      colors: product.colors.split(','),
      sizes: product.sizes.split(','),
      images: product.images.split(','),
    }));
  } catch (error) {
    console.error(`Error fetching products for collection ${collection}:`, error);
    return [];
  }
}

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand || "Nikky's Reserve",
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        category: data.category,
        type: data.type || "Outerwear",
        colors: data.colors,
        sizes: data.sizes,
        images: data.images,
        isNew: data.isNew === 'true',
        isBestseller: data.isBestseller === 'true',
        description: data.description,
        material: data.material,
        careInstructions: data.careInstructions,
        collection: data.collection,
      }
    });
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        category: data.category,
        colors: data.colors,
        sizes: data.sizes,
        images: data.images,
        description: data.description,
        collection: data.collection,
      }
    });
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSetting.findFirst();
    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: "Nikky's",
          contactEmail: "hello@nikkys.com",
          currency: "USD",
          timezone: "UTC"
        }
      });
    }
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

export async function updateStoreSettings(data: any) {
  try {
    let settings = await prisma.storeSetting.findFirst();
    if (settings) {
      settings = await prisma.storeSetting.update({
        where: { id: settings.id },
        data: {
          storeName: data.storeName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          currency: data.currency,
          timezone: data.timezone,
        }
      });
    } else {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: data.storeName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          currency: data.currency,
          timezone: data.timezone,
        }
      });
    }
    return { success: true, settings };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function updateUserAccount(userId: string, data: { name?: string, email?: string }) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      }
    });
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user account:", error);
    return { success: false, error: "Failed to update account" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { success: false, error: "User not found" };
    
    if (user.role === "ADMIN") {
      return { success: false, error: "Cannot delete an administrator" };
    }
    
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
