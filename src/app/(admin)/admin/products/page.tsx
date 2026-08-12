import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-semibold text-gray-800">Products</h1>
        <Link href="/admin/products/new" className="bg-brand-midnight text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => {
              const images = product.images.split(",");
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-gray-100 relative overflow-hidden shrink-0">
                      {images[0] && (
                        <Image src={images[0]} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-500">{product.category}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Active</span>
                  </td>
                  <td className="p-4 text-right text-sm font-medium">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-brand-midnight hover:text-brand-champagne transition-colors">
                      Edit
                    </Link>
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
