import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Discover our latest premium designs and fresh styles just landed.",
};

export default async function NewArrivalsPage() {
  const newProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 12
  });

  // format for the ProductCard
  const formattedProducts = newProducts.map(product => ({
    ...product,
    colors: product.colors.split(','),
    sizes: product.sizes.split(','),
    images: product.images.split(',')
  }));

  return (
    <div className="min-h-screen bg-brand-softwhite">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop)` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-6xl text-white mb-4 tracking-tight">New Arrivals</h1>
          <p className="text-brand-snow text-lg max-w-2xl mx-auto">Fresh Styles Just Landed. Discover our latest premium designs crafted for the modern wardrobe.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-display text-2xl text-brand-midnight">Shop Latest</h2>
          <p className="text-brand-graphite text-sm">{newProducts.length} Products</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {formattedProducts.map(product => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
