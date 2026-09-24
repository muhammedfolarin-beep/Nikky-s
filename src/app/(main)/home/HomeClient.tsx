"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/mockProducts";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { getProducts, getStoreSettings } from "@/lib/actions";

const DEFAULT_CATEGORIES = [
  { 
    name: "Everyday Essentials", 
    image: "/uploads/1786654201054-spring_outfits_casual__The_Chic_Minimalist_a_crisp_white_oversized_poplin_button-down_shirt_with_structured_cuffs__tucked_into_high-waisted_tailored_beige_linen_trousers_with_a_thin_leather_belt_.jpg" 
  },
  { 
    name: "Evening & Occasion", 
    image: "/uploads/1786654380097-3281.jpg" 
  },
  { 
    name: "Outerwear & Layering", 
    image: "/uploads/1786653991709-494.jpg" 
  },
  { 
    name: "The Resort Collection", 
    image: "/uploads/1786654655428-download__6_.jpg" 
  }
];

const DEFAULT_COLLECTIONS = [
  { 
    name: "The SN24 Capsule", 
    slug: "the-sn24-capsule", 
    image: "/uploads/1786653991709-494.jpg", 
    desc: "Our signature high-fashion minimalist capsule" 
  },
  { 
    name: "The Midnight Navy Edit", 
    slug: "the-midnight-navy-edit", 
    image: "/uploads/1786654380097-3281.jpg", 
    desc: "Sculpted silhouettes tailored in deep obsidian and navy" 
  },
  { 
    name: "Soft White Minimalism", 
    slug: "soft-white-minimalism", 
    image: "/uploads/1786654201054-spring_outfits_casual__The_Chic_Minimalist_a_crisp_white_oversized_poplin_button-down_shirt_with_structured_cuffs__tucked_into_high-waisted_tailored_beige_linen_trousers_with_a_thin_leather_belt_.jpg", 
    desc: "Clean lines and breathable luxury textiles" 
  }
];

const instagramFeed = [
  "/uploads/1786653991709-494.jpg",
  "/uploads/1786654782269-download__8_.jpg",
  "/uploads/1786654380097-3281.jpg",
  "/uploads/1786654201054-spring_outfits_casual__The_Chic_Minimalist_a_crisp_white_oversized_poplin_button-down_shirt_with_structured_cuffs__tucked_into_high-waisted_tailored_beige_linen_trousers_with_a_thin_leather_belt_.jpg",
  "/uploads/1786654655428-download__6_.jpg"
];

interface HomeClientProps {
  initialProducts?: Product[];
  initialSettings?: any;
}

export default function HomeClient({ initialProducts = [], initialSettings = null }: HomeClientProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [newProducts, setNewProducts] = useState<Product[]>(initialProducts.slice(0, 4));
  const [, setStoreSettings] = useState<any>(initialSettings);

  // Background refresh to keep in sync if updated
  useEffect(() => {
    if (initialProducts.length === 0) {
      getProducts().then(products => {
        setAllProducts(products as Product[]);
        setNewProducts(products.slice(0, 4) as Product[]);
      });
    }
    if (!initialSettings) {
      getStoreSettings().then(settings => {
        if (settings) setStoreSettings(settings);
      });
    }
  }, [initialProducts.length, initialSettings]);

  const derivedCategories = DEFAULT_CATEGORIES.map(cat => {
    const productsInCat = allProducts.filter(p => p.category === cat.name);
    const catImage = productsInCat.length > 0 && productsInCat[0].images?.length > 0 
      ? productsInCat[0].images[0] 
      : cat.image;
    return { ...cat, image: catImage, count: productsInCat.length };
  });

  const derivedCollections = DEFAULT_COLLECTIONS.map(col => {
    const productsInCol = allProducts.filter((p: any) => p.collection === col.name);
    const colImage = productsInCol.length > 0 && productsInCol[0].images?.length > 0 
      ? productsInCol[0].images[0] 
      : col.image;
    return { ...col, image: colImage };
  });

  return (
    <div className="w-full bg-brand-softwhite">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-brand-midnight">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/uploads/1786654782269-download__8_.jpg"
            alt="SN24 Luxury Fashion"
            fill
            className="object-cover object-top opacity-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-midnight/70 backdrop-blur-md border border-brand-champagne/40 mb-6"
          >
            <Sparkles size={12} className="text-brand-champagne" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-champagne font-mono">
              The Signature SN24 Capsule
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-brand-snow leading-[1.1]"
          >
            Contemporary Luxury <br className="hidden md:block" /> Sculpted By SN24.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="text-base sm:text-lg font-light mb-8 max-w-2xl leading-relaxed text-brand-silver/90"
          >
            Artisanal craftsmanship meets sleek minimalism. Explore ready-to-wear silhouettes and bespoke made-to-measure tailoring.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
          >
            <Link 
              href="/shop" 
              className="w-full sm:w-auto bg-brand-champagne text-brand-midnight px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-softgold transition-all duration-300 shadow-large hover:scale-[1.02]"
            >
              Explore Catalog
            </Link>
            <Link 
              href="/collections/the-sn24-capsule" 
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-brand-snow px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all duration-300 text-center"
            >
              The SN24 Capsule
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="w-full py-8 px-6 bg-brand-midnight text-brand-snow border-b border-brand-charcoal">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3.5 px-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-champagne shrink-0">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-brand-snow">Lagos Dispatch & GIG Nationwide</h4>
              <p className="text-[11px] text-brand-silver/70">1–2 days Lagos & 3–5 days interstate express</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3.5 px-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-champagne shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-brand-snow">Bespoke Custom Tailoring</h4>
              <p className="text-[11px] text-brand-silver/70">Custom made-to-measure fit options</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3.5 px-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-champagne shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-brand-snow">Secure Payments</h4>
              <p className="text-[11px] text-brand-silver/70">Paystack cards, transfer & USSD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-20 px-6 md:px-12 bg-brand-softwhite">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-brand-stone bg-white rounded-full px-3.5 py-1 mb-4 shadow-xs">
             <span className="w-1.5 h-1.5 rounded-full bg-brand-midnight"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-midnight font-mono">
               Curation
             </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-midnight mb-12">
            Shop by Style Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {derivedCategories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={`/shop?category=${encodeURIComponent(cat.name)}`} 
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden mb-4 relative bg-brand-stone shadow-soft group-hover:shadow-large transition-all duration-500 border border-brand-stone">
                   <Image 
                     src={cat.image} 
                     alt={cat.name} 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover:scale-108" 
                   />
                </div>
                <h3 className="font-display font-semibold text-brand-midnight text-base group-hover:text-brand-champagne transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-brand-graphite font-mono mt-0.5">{cat.count} Products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section with ProductCard */}
      <section className="w-full py-20 px-6 md:px-12 bg-white border-y border-brand-stone">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-brand-champagne font-bold block mb-1">
                Fresh Drops
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-midnight">
                New Arrivals
              </h2>
            </div>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-midnight hover:text-brand-champagne transition-colors pb-1 border-b border-brand-midnight"
            >
              View Full Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections Section */}
      <section className="w-full py-20 px-6 md:px-12 bg-brand-softwhite">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-brand-champagne font-bold block mb-2">
            Signature Edits
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-midnight mb-12">
            Explore Curated Collections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {derivedCollections.map((collection, idx) => (
              <Link 
                key={idx} 
                href={`/collections/${collection.slug}`}
                className="group relative h-[420px] rounded-2xl overflow-hidden shadow-medium border border-brand-stone block"
              >
                <Image 
                  src={collection.image} 
                  alt={collection.name} 
                  fill 
                  className="object-cover group-hover:scale-108 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/90 via-brand-midnight/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-left">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-champagne font-bold block mb-1">
                    Signature Capsule
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-brand-silver/80 line-clamp-2 mb-4 font-light">
                    {collection.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-champagne group-hover:translate-x-1 transition-transform">
                    Discover Collection <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full relative py-20 px-6 md:px-12 bg-brand-midnight text-brand-snow">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-xs uppercase font-mono tracking-widest text-brand-champagne font-bold block mb-2">
              Client Testimonials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
              Voices of our esteemed clientele
            </h2>
            <p className="text-sm text-brand-silver/80 mb-6 font-light max-w-md">
              From signature event occasions to effortless daily luxury, discover why SN24 silhouettes and tailored fits stand apart.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
              </div>
              <span className="text-xs text-brand-silver/80 font-mono font-semibold">4.9 / 5.0 Client Satisfaction</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-brand-silver/90 italic leading-relaxed mb-6 font-light">
                &ldquo;Ordered to Lekki Phase 1 and local dispatch delivered next day. The fabric texture and seam construction are exceptional.&rdquo;
              </p>
              <div>
                <span className="font-bold text-xs text-white block">Dr. Amina Bello</span>
                <span className="text-[10px] text-brand-champagne font-mono">Lagos, Nigeria</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-brand-silver/90 italic leading-relaxed mb-6 font-light">
                &ldquo;Received in Abuja via GIG Express on time. The bespoke measurements fit like a dream.&rdquo;
              </p>
              <div>
                <span className="font-bold text-xs text-white block">Chioma Eke</span>
                <span className="text-[10px] text-brand-champagne font-mono">Abuja FCT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="w-full py-16 bg-brand-softwhite text-center">
         <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-midnight mb-8">
           Follow <span className="font-mono text-brand-champagne">@sn24_store</span>
         </h2>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 px-4 max-w-7xl mx-auto">
           {instagramFeed.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-brand-stone bg-brand-stone">
                 <Image src={img} alt={`SN24 feed ${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-108" />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-xs uppercase font-mono font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Look
                    </span>
                 </div>
              </div>
           ))}
         </div>
      </section>
    </div>
  );
}
