import Link from "next/link";
import { getStoreSettings } from "@/lib/actions";

export default async function Footer() {
  const settings = await getStoreSettings();
  const storeName = settings?.storeName || "Nikky's";

  return (
    <footer className="w-full py-16 px-6 md:px-8 bg-brand-midnight text-brand-softwhite mt-auto border-t border-brand-midnight/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
        <div className="flex flex-col">
          <h3 className="font-display font-semibold text-2xl mb-4 text-brand-snow tracking-tight">{storeName}</h3>
          <p className="text-sm text-brand-silver/80 leading-relaxed max-w-xs">Timeless • Elegant • Minimal. Curated fashion for the modern aesthetic.</p>
        </div>
        
        <div>
          <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-5 text-brand-snow">Shop</h4>
          <ul className="text-sm space-y-3 text-brand-silver/80">
            <li><Link href="/new-arrivals" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">New Arrivals</Link></li>
            <li><Link href="/collections" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Collections</Link></li>
            <li><Link href="/shop" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">All Products</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-5 text-brand-snow">Support</h4>
          <ul className="text-sm space-y-3 text-brand-silver/80">
            <li><Link href="/contact" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">FAQ</Link></li>
            <li><Link href="#" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Shipping & Returns</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-5 text-brand-snow">Newsletter</h4>
          <p className="text-sm text-brand-silver/80 mb-4 leading-relaxed">Stay ahead of fashion with our latest releases.</p>
          <div className="flex group focus-within:ring-1 focus-within:ring-brand-champagne/50 rounded-sm overflow-hidden transition-shadow duration-300 shadow-sm">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 w-full text-sm text-brand-charcoal outline-none bg-brand-snow placeholder:text-brand-graphite/60 transition-colors" 
              aria-label="Email address"
            />
            <button 
              className="bg-brand-champagne hover:bg-brand-softgold text-brand-snow px-5 py-3 text-sm font-semibold transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-silver/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-silver/60">
        <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-brand-snow transition-colors duration-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-brand-snow transition-colors duration-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
