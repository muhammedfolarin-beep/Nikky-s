"use client";

import { useEffect, useState } from "react";
import { Product } from "@/data/mockProducts";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, CreditCard, Truck, Headphones, Play, Star, PhoneCall } from "lucide-react";

import { getProducts, getStoreSettings } from "@/lib/actions";

const DEFAULT_CATEGORIES = [
  { name: "Everyday Essentials", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
  { name: "Evening & Occasion", image: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=800&auto=format&fit=crop" },
  { name: "Outerwear & Layering", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop" },
  { name: "The Resort Collection", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop" }
];

const DEFAULT_COLLECTIONS = [
  { name: "The SN24 Capsule", slug: "the-sn24-capsule", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop" },
  { name: "The Midnight Navy Edit", slug: "the-midnight-navy-edit", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop" },
  { name: "Soft White Minimalism", slug: "soft-white-minimalism", image: "https://images.unsplash.com/photo-1515347619362-747da441229a?q=80&w=1200&auto=format&fit=crop" }
];

const promoBanners = [
  {
    discount: "50% Off",
    title: "Welcome exclusive offer",
    desc: "Discover our latest premium designs crafted",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    link: "/shop/p1"
  },
  {
    discount: "20% Off",
    title: "Luxury collection drop",
    desc: "Discover our latest premium designs crafted",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
    link: "/shop/p2"
  },
  {
    discount: "Buy 2 Get 1 Free",
    title: "Fashion that fits you",
    desc: "Discover premium accessories and lifestyle picks curated",
    image: "https://images.unsplash.com/photo-1485230895905-ef10cefaec8e?q=80&w=800&auto=format&fit=crop",
    link: "/shop/p3"
  }
];

const collectionPills = [
  { name: "The SN24 Capsule", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=200&auto=format&fit=crop" },
  { name: "The Midnight Navy Edit", image: "https://images.unsplash.com/photo-1515347619362-747da441229a?q=80&w=200&auto=format&fit=crop" },
  { name: "Soft White Minimalism", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=200&auto=format&fit=crop" },
  { name: "The SN24 Capsule", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=200&auto=format&fit=crop" },
  { name: "The Midnight Navy Edit", image: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=200&auto=format&fit=crop" },
  { name: "Soft White Minimalism", image: "https://images.unsplash.com/photo-1608256246200-53e65329e324?q=80&w=200&auto=format&fit=crop" },
  { name: "The SN24 Capsule", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop" },
  { name: "The Midnight Navy Edit", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop" }
];

const instagramFeed = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515347619362-747da441229a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop"
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);

  useEffect(() => {
    getProducts().then(products => {
      setAllProducts(products as Product[]);
      setNewProducts(products.slice(0, 4) as Product[]);
      
      // Filter for discounted products (where originalPrice > price)
      const discounted = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);
      setDiscountedProducts(discounted as Product[]);
    });
    getStoreSettings().then(settings => {
      if (settings) setStoreSettings(settings);
    });
  }, []);

  // Compute derived categories and collections
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full bg-brand-charcoal">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Fashion Model"
            fill
            className="object-cover object-top opacity-80"
            priority
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl font-medium tracking-tight mb-6 text-brand-snow"
          >
            Discover Fashion <br className="hidden md:block" /> That Moves With You.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl font-light mb-10 max-w-2xl leading-relaxed text-brand-softwhite"
          >
            Premium clothing curated for every occasion. Explore timeless essentials, modern silhouettes, and statement pieces designed to elevate your everyday wardrobe.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/new-arrivals" className="bg-brand-snow text-brand-midnight px-8 py-4 rounded-button text-sm font-medium hover:bg-brand-softgold hover:text-white transition-all duration-300">
              Shop New Arrivals
            </Link>
            <Link href="/collections" className="bg-transparent border border-brand-snow text-brand-snow px-8 py-4 rounded-button text-sm font-medium hover:bg-white/10 transition-all duration-300 text-center">
              Browse Collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-24 px-8 bg-brand-snow text-center">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center justify-center border border-gray-200 rounded-full px-4 py-1.5 mb-6">
             <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-midnight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-midnight block"></span>
                BEST SELLER
             </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-brand-midnight mb-16">Shop by Style Categories</h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {derivedCategories.map((cat, idx) => {
              return (
              <Link key={idx} href={`/shop?category=${cat.name}`} className="flex flex-col items-center group cursor-pointer">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 relative bg-[#F5F4F0]">
                   <Image 
                     src={cat.image} 
                     alt={cat.name} 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                </div>
                <h4 className="font-semibold text-brand-midnight text-lg mb-1">{cat.name}</h4>
                <span className="text-xs text-brand-graphite">{cat.count} Products</span>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="w-full py-24 px-8 bg-brand-snow">
        <div className="max-w-7xl mx-auto flex">
           <div className="hidden lg:flex flex-col items-center justify-center opacity-30 mr-12 mt-12">
             <span className="font-sans tracking-[0.4em] text-xs text-brand-midnight whitespace-nowrap rotate-180 uppercase" style={{ writingMode: 'vertical-rl' }}>
                Fresh Styles Just Landed
             </span>
          </div>

          <div className="flex-1">
            <h2 className="font-display text-4xl text-brand-midnight mb-12">NEW ARRIVALS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newProducts.map((product) => (
                <Link href={`/shop/${product.id}`} key={product.id} className="group cursor-pointer block">
                  <div className="relative aspect-[3/4] w-full mb-4 overflow-hidden rounded-md bg-brand-stone">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <button className="bg-white text-brand-midnight px-6 py-3 rounded-button text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 hover:bg-brand-champagne hover:text-white">
                         Read More
                       </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-brand-midnight group-hover:text-brand-champagne transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/new-arrivals" className="inline-flex items-center gap-2 text-brand-midnight font-medium hover:text-brand-champagne transition-colors pb-1 border-b border-current">
                Find Your Signature Style – Premium Looks Await
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banners Section */}
      <section className="w-full pb-20 px-8 bg-brand-snow">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(discountedProducts.length > 0 ? discountedProducts.slice(0, 3).map(p => {
            const desc = p.description ? (p.description.length > 60 ? p.description.substring(0, 60) + "..." : p.description) : "Discover this exclusive offer on our premium collection.";
            return {
              discount: `${Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)}% Off`,
              title: p.name,
              desc: desc,
              image: (p.images && p.images.length > 0) ? p.images[0] : promoBanners[0].image,
              link: `/shop/${p.id}`
            };
          }) : promoBanners).map((promo, idx) => (
            <div key={idx} className="bg-[#F5F4F0] rounded-xl overflow-hidden flex flex-row h-[280px]">
              <div className="w-[45%] relative h-full">
                <Image 
                  src={promo.image} 
                  alt={promo.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="w-[55%] p-6 flex flex-col justify-center">
                <span className="text-xs font-semibold uppercase mb-2 text-brand-midnight">{promo.discount}</span>
                <h3 className="font-display text-2xl font-semibold mb-3 leading-tight text-brand-midnight line-clamp-2">{promo.title}</h3>
                <p className="text-xs text-brand-graphite mb-6 leading-relaxed opacity-80 line-clamp-2">{promo.desc}</p>
                <div>
                  <Link href={promo.link} className="flex items-center gap-3 border border-gray-300 rounded-md py-1.5 px-1.5 pl-4 hover:border-brand-midnight transition-colors bg-transparent group max-w-fit">
                    <span className="text-sm font-semibold text-brand-midnight">Shop Offer</span>
                    <div className="bg-brand-midnight text-white p-2 rounded flex items-center justify-center group-hover:bg-brand-charcoal transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full relative py-24 px-8 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Testimonials Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-white">
            <div className="inline-flex items-center border border-white/30 rounded-full px-4 py-1.5 mb-8">
               <span className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block"></span>
                  TESTIMONIALS
               </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-semibold mb-6 leading-tight">
              Voices of our happy<br/> customers
            </h2>
            <p className="text-sm text-gray-300 mb-16 max-w-md leading-relaxed">
              Discover what our customers love about us through their real experiences, honest feedback.
            </p>

            <div className="flex items-center gap-6 border-t border-white/20 pt-8">
              <div className="flex -space-x-3">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" width={40} height={40} className="rounded-full border-2 border-black" />
                <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="User" width={40} height={40} className="rounded-full border-2 border-black" />
                <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&auto=format&fit=crop" alt="User" width={40} height={40} className="rounded-full border-2 border-black" />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-midnight font-bold border-2 border-black z-10 text-lg">
                  +
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    <Star fill="currentColor" size={14} />
                    <Star fill="currentColor" size={14} />
                    <Star fill="currentColor" size={14} />
                    <Star fill="currentColor" size={14} />
                    <Star fill="currentColor" size={14} />
                  </div>
                  <span className="bg-white text-brand-midnight text-[10px] font-bold px-2 py-0.5 rounded-full">4.8</span>
                </div>
                <span className="text-xs text-gray-400">4.8 / 5 Ratings</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full">
            {/* Card 1 */}
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-6xl text-white/20 font-serif leading-none block mb-4">"</span>
                <p className="text-white text-sm leading-relaxed mb-8 font-medium">
                  "Absolutely love the quality & fit! The fabric feels premium and the style is exactly what I was looking for."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/20 pt-6">
                <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="Harper Anderson" width={48} height={48} className="rounded-full" />
                <div>
                  <h4 className="text-white font-semibold text-sm">Harper Anderson</h4>
                  <span className="text-gray-400 text-xs">Art Director</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-6xl text-white/20 font-serif leading-none block mb-4">"</span>
                <p className="text-white text-sm leading-relaxed mb-8 font-medium">
                  "Absolutely love the quality & fit! The fabric feels premium and the style is exactly what I was looking for."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/20 pt-6">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Sophia Carter" width={48} height={48} className="rounded-full" />
                <div>
                  <h4 className="text-white font-semibold text-sm">Sophia Carter</h4>
                  <span className="text-gray-400 text-xs">Fashion Stylist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-24 px-8 bg-brand-snow text-center border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center border border-gray-200 rounded-full px-4 py-1.5 mb-6">
             <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-midnight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-midnight block"></span>
                FASHION BY GOAL
             </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-brand-midnight mb-6">Style choices for every goal</h2>
          <p className="text-sm text-brand-graphite max-w-2xl mx-auto mb-20 leading-relaxed">
            Discover fashion tailored to your lifestyle goals — whether it's work, travel, fitness, or special occasions, find styles that fit every moment.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6 text-brand-midnight">
                 <Package strokeWidth={1.5} size={32} />
              </div>
              <h4 className="font-semibold text-brand-midnight text-[15px]">Free Shipping</h4>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6 text-brand-midnight">
                 <CreditCard strokeWidth={1.5} size={32} />
              </div>
              <h4 className="font-semibold text-brand-midnight text-[15px]">Secure Payments</h4>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6 text-brand-midnight">
                 <Truck strokeWidth={1.5} size={32} />
              </div>
              <h4 className="font-semibold text-brand-midnight text-[15px]">Easy Returns</h4>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6 text-brand-midnight">
                 <Headphones strokeWidth={1.5} size={32} />
              </div>
              <h4 className="font-semibold text-brand-midnight text-[15px]">24/7 Support</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="w-full relative h-[600px] overflow-hidden">
        <video
          src="/6248693_Woman_Caucasian_1920x1080.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <button className="w-20 h-20 bg-brand-midnight text-white rounded-full flex items-center justify-center hover:bg-brand-charcoal transition-colors hover:scale-105 transform duration-300">
            <Play fill="currentColor" size={24} className="ml-1" />
          </button>
        </div>
      </section>

      {/* Collections Section */}
      <section className="w-full py-20 px-8 bg-brand-snow text-center border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center justify-center border border-gray-200 rounded-full px-4 py-1.5 mb-6">
             <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-midnight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-midnight block"></span>
                COLLECTION
             </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-brand-midnight mb-12">Explore our latest collections</h2>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 mb-12 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {derivedCollections.map((collection, idx) => (
              <Link 
                key={idx} 
                href={`/collections/${collection.slug}`}
                className="group relative flex-none w-[85%] md:w-[calc(50%-12px)] h-[400px] snap-center overflow-hidden rounded-xl bg-brand-stone/20"
              >
                <Image 
                  src={collection.image} 
                  alt={collection.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight drop-shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">{collection.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          
          <Link href="/collections" className="inline-flex items-center gap-3 border border-gray-300 rounded-md py-2 px-2 pl-6 hover:border-brand-midnight transition-colors bg-transparent group mb-24">
            <span className="text-sm font-semibold text-brand-midnight">Explore Collections</span>
            <div className="bg-brand-midnight text-white p-2 rounded flex items-center justify-center group-hover:bg-brand-charcoal transition-colors">
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Discover Premium Brand block */}
          <div className="flex flex-col lg:flex-row justify-between text-left gap-12 border-t border-gray-100 pt-16">
            <div className="flex-1 max-w-lg">
              <div className="inline-flex items-center justify-center border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                 <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-midnight flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-midnight block"></span>
                    SHOP BY BRANDS
                 </span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl font-semibold text-brand-midnight mb-6 leading-tight">
                Discover premium brand for your style
              </h3>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-brand-midnight">4.5</span>
                <div className="flex text-yellow-400">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} className="opacity-50" />
                </div>
                <span className="text-xs text-brand-graphite">Our Product Review</span>
              </div>
            </div>

            <div className="flex-1 max-w-xl lg:pl-12 flex flex-col justify-center">
               <p className="text-sm text-brand-graphite mb-10 leading-relaxed max-w-md">
                 Explore a curated collection of premium brands that blend quality, style, and innovation — perfectly tailored to match.
               </p>
               <div className="flex items-center justify-between border-t border-gray-100 pt-8 flex-wrap gap-6">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">
                     <PhoneCall size={20} />
                   </div>
                   <div>
                     <span className="text-xs text-brand-graphite block mb-1">Contact Us</span>
                     <span className="font-semibold text-brand-midnight">
                       {storeSettings?.contactPhone || "+(0) 123 458 852"}
                     </span>
                     <span className="text-xs text-brand-midnight block mt-1">
                       {storeSettings?.contactEmail || "hello@nikkys.com"}
                     </span>
                   </div>
                 </div>
                 
                 <Link href="/collections" className="flex items-center gap-3 border border-gray-300 rounded-md py-1.5 px-1.5 pl-4 hover:border-brand-midnight transition-colors bg-transparent group">
                    <span className="text-sm font-semibold text-brand-midnight">Explore Collections</span>
                    <div className="bg-brand-midnight text-white p-2 rounded flex items-center justify-center group-hover:bg-brand-charcoal transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="w-full py-24 bg-brand-snow text-center">
         <h2 className="font-display text-4xl md:text-5xl font-semibold text-brand-midnight mb-12">Follow us for daily lifestyle</h2>
         <div className="grid grid-cols-2 md:grid-cols-5 w-full mx-auto gap-0">
           {instagramFeed.map((img, idx) => (
              <div key={idx} className="relative aspect-square w-full group overflow-hidden cursor-pointer">
                 <Image src={img} alt={`Instagram feed ${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg 
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                 </div>
              </div>
           ))}
         </div>
      </section>

    </div>
  );
}
