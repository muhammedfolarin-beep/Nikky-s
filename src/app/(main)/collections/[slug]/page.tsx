import { getProductsByCollection } from "@/lib/actions";
import ProductCard from "@/components/shop/ProductCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const collectionData: Record<string, { name: string, bannerImage: string, description: string }> = {
  "the-sn24-capsule": {
    name: "The SN24 Capsule",
    bannerImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1600&auto=format&fit=crop",
    description: "A masterclass in effortless confidence and meticulous craftsmanship."
  },
  "the-midnight-navy-edit": {
    name: "The Midnight Navy Edit",
    bannerImage: "https://images.unsplash.com/photo-1515347619362-747da441229a?q=80&w=1600&auto=format&fit=crop",
    description: "Sophisticated depth for the transition from day to evening."
  },
  "soft-white-minimalism": {
    name: "Soft White Minimalism",
    bannerImage: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop",
    description: "Breathable luxury and clean, uninterrupted lines."
  }
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = collectionData[slug];
  if (!data) return { title: "Collection Not Found" };
  
  return {
    title: `${data.name} Collection`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const data = collectionData[slug];

  if (!data) {
    notFound();
  }
  
  const products = await getProductsByCollection(data.name);

  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-softwhite">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.bannerImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-6xl text-white mb-4 tracking-tight">{data.name}</h1>
          <p className="text-brand-snow text-lg max-w-2xl mx-auto">{data.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-display text-2xl text-brand-midnight">Explore the Collection</h2>
          <p className="text-brand-graphite text-sm">{products.length} Products</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
