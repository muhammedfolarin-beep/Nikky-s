"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import { deleteProduct } from "@/lib/actions";
import { useCurrency } from "@/context/CurrencyContext";

export default function ProductListClient({ products }: { products: any[] }) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCollection, setFilterCollection] = useState("All");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const collections = ["All", ...Array.from(new Set(products.map(p => p.collection).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    if (filterCategory !== "All" && p.category !== filterCategory) return false;
    if (filterCollection !== "All" && p.collection !== filterCollection) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(id);
      await deleteProduct(id);
      setIsDeleting(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-semibold text-gray-800">Products</h1>
        <Link href="/admin/products/new" className="bg-brand-midnight text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-champagne/50"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>)}
        </select>
        
        <select 
          value={filterCollection} 
          onChange={(e) => setFilterCollection(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-champagne/50"
        >
          {collections.map(col => <option key={col} value={col}>{col === "All" ? "All Collections" : col}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Collection</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map(product => {
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
                  <td className="p-4 text-sm text-gray-900 font-medium">{formatPrice(product.price)}</td>
                  <td className="p-4 text-sm text-gray-500">{product.category}</td>
                  <td className="p-4 text-sm text-gray-500">{product.collection || "-"}</td>
                  <td className="p-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-brand-midnight hover:text-brand-champagne transition-colors">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        disabled={isDeleting === product.id}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        {isDeleting === product.id ? "..." : <Trash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No products found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
