import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our curated collections.",
};

const collections = [
  {
    name: "The SN24 Capsule",
    slug: "the-sn24-capsule",
    image: "/uploads/1786653991709-494.jpg",
    description: "A masterclass in effortless confidence and meticulous craftsmanship."
  },
  {
    name: "The Midnight Navy Edit",
    slug: "the-midnight-navy-edit",
    image: "/uploads/1786654380097-3281.jpg",
    description: "Sophisticated depth for the transition from day to evening."
  },
  {
    name: "Soft White Minimalism",
    slug: "soft-white-minimalism",
    image: "/uploads/1786654201054-spring_outfits_casual__The_Chic_Minimalist_a_crisp_white_oversized_poplin_button-down_shirt_with_structured_cuffs__tucked_into_high-waisted_tailored_beige_linen_trousers_with_a_thin_leather_belt_.jpg",
    description: "Breathable luxury and clean, uninterrupted lines."
  }
];

export default async function CollectionsPage() {
  const allProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  const derivedCollections = collections.map(collection => {
    const productsInCol = allProducts.filter(p => p.collection === collection.name);
    const colImage = productsInCol.length > 0 && productsInCol[0].images?.length > 0 
      ? productsInCol[0].images[0] 
      : collection.image;
    return { ...collection, image: colImage };
  });

  return (
    <div className="min-h-screen bg-brand-softwhite pt-12 pb-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-brand-midnight tracking-tight mb-4">Curated Collections</h1>
          <p className="text-brand-graphite max-w-2xl mx-auto">Discover our latest arrivals grouped by theme, material, and occasion.</p>
        </div>

        <div className="flex flex-col gap-8">
          {derivedCollections.map((collection, index) => (
            <Link 
              key={collection.slug} 
              href={`/collections/${collection.slug}`}
              className="group block relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden rounded-xl bg-brand-stone/20"
            >
              <Image 
                src={collection.image} 
                alt={collection.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h2 className="font-display text-3xl md:text-5xl text-white mb-4 tracking-tight drop-shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">{collection.name}</h2>
                <p className="text-brand-snow max-w-md text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
