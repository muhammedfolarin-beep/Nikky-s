import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-softwhite flex flex-col items-center justify-center text-center px-4 py-24">
      <p className="text-xs uppercase tracking-widest text-brand-champagne mb-4 font-mono font-medium">404 Error</p>
      <h1 className="font-display text-4xl md:text-5xl text-brand-midnight mb-4">Piece Not Found</h1>
      <p className="text-brand-graphite text-sm max-w-md mb-8">
        The silhouette or capsule you are looking for has either retired or does not exist in our current collection.
      </p>
      <Link 
        href="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-midnight text-white text-sm font-medium rounded-full shadow-soft hover:bg-brand-charcoal transition-all"
      >
        <ArrowLeft size={16} /> Return to Catalog
      </Link>
    </div>
  );
}
