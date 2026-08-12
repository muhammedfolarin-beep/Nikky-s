import { prisma } from "@/lib/prisma";
import ProductListClient from "./ProductListClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <ProductListClient products={products} />
    </div>
  );
}
