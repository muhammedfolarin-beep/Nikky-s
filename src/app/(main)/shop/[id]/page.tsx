import { getProductById } from "@/lib/actions";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description || undefined,
    openGraph: {
      title: `${product.name} | Nikky's Clothing`,
      description: product.description || undefined,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-softwhite pt-8 pb-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brand-graphite mb-8 lg:mb-12">
          <Link href="/home" className="hover:text-brand-midnight transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-brand-midnight transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-midnight transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-brand-midnight truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] xl:w-[60%]">
            <ProductGallery images={product.images.startsWith('[') ? JSON.parse(product.images) : [product.images]} productName={product.name} />
          </div>
          
          {/* Right: Product Info & Actions */}
          <div className="w-full lg:w-[45%] xl:w-[40%]">
            <ProductInfo product={product} />
          </div>

        </div>
      </div>
    </div>
  );
}
