import { getProductsByCollection } from "@/lib/actions";
import ProductCard from "@/components/product/ProductCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const collectionData: Record<string, { name: string, bannerImage: string, description: string }> = {
  "the-sn24-capsule": {
    name: "The SN24 Capsule",
    bannerImage: "/uploads/1786653991709-494.jpg",
    description: "A masterclass in effortless confidence and meticulous craftsmanship."
  },
  "the-midnight-navy-edit": {
    name: "The Midnight Navy Edit",
    bannerImage: "/uploads/1786654380097-3281.jpg",
    description: "Sophisticated depth for the transition from day to evening."
  },
  "soft-white-minimalism": {
    name: "Soft White Minimalism",
    bannerImage: "/uploads/1786654201054-spring_outfits_casual__The_Chic_Minimalist_a_crisp_white_oversized_poplin_button-down_shirt_with_structured_cuffs__tucked_into_high-waisted_tailored_beige_linen_trousers_with_a_thin_leather_belt_.jpg",
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
          <p className="text-brand-graphite text-sm">{products.length} {products.length === 1 ? "Product" : "Products"}</p>
        </div>
        
        {products.length === 0 ? (
          <div className="bg-white border border-brand-stone rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-champagne bg-brand-midnight px-3 py-1 rounded-full inline-block mb-4">
              Atelier Preview
            </span>
            <h3 className="font-display text-2xl text-brand-midnight mb-2">Curated Pieces In Tailoring</h3>
            <p className="text-brand-graphite text-xs sm:text-sm mb-6 leading-relaxed">
              Our artisans are currently finalizing the tailored silhouettes and capsule drops for {data.name}. Explore ready-to-wear pieces currently in stock.
            </p>
            <a 
              href="/shop" 
              className="inline-block bg-brand-midnight text-brand-snow px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-charcoal transition-colors shadow-soft"
            >
              Explore Full Catalog
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
