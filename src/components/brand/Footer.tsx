import Link from "next/link";
import { getStoreSettings } from "@/lib/actions";
import { 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  Truck,
  MessageSquare
} from "lucide-react";
import Image from "next/image";

export default async function Footer() {
  const settings = await getStoreSettings();
  const storeName = settings?.storeName || "SN24";
  const contactEmail = settings?.contactEmail || "hello@sn24.com.ng";
  const contactPhone = settings?.contactPhone || "+234 (0) 800 SN24";

  return (
    <footer className="w-full bg-brand-midnight text-brand-softwhite mt-auto border-t border-brand-charcoal font-sans">
      {/* Upper Brand Manifesto Strip */}
      <div className="border-b border-white/10 py-10 px-6 md:px-12 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="bg-brand-champagne text-brand-midnight font-mono text-xs font-bold px-2.5 py-1 rounded">
              SN24
            </span>
            <p className="text-sm text-brand-silver/90 font-light">
              Contemporary Luxury & Ready-to-Wear Sartorial Excellence
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-brand-silver/70">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-brand-champagne" /> Lagos Dispatch & GIG Nationwide
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-brand-champagne" /> Secured via Paystack
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand Statement & Socials */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-9 h-9">
              <Image
                src="/sn24-white-logo.png"
                alt="SN24 Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display font-bold text-2xl md:text-3xl text-brand-snow tracking-tight">
              {storeName}
            </span>
          </div>
          <p className="text-sm text-brand-silver/80 leading-relaxed max-w-sm mb-6">
            Timeless • Architectural • Minimal. SN24 exists to redefine contemporary luxury through precision tailoring, sculpted silhouettes, and ready-to-wear pieces.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 mt-auto pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-champagne hover:text-brand-midnight flex items-center justify-center transition-all duration-300 border border-white/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-champagne hover:text-brand-midnight flex items-center justify-center transition-all duration-300 border border-white/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </a>
            <a 
              href={`mailto:${contactEmail}`} 
              aria-label="Email Concierge"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-champagne hover:text-brand-midnight flex items-center justify-center transition-all duration-300 border border-white/10"
            >
              <Mail size={16} />
            </a>
            <a 
              href="https://wa.me/234800645597" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp Concierge"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all duration-300 border border-white/10"
            >
              <MessageSquare size={15} />
            </a>
          </div>
        </div>
        
        {/* Collections */}
        <div>
          <h4 className="font-sans font-semibold text-xs uppercase tracking-widest mb-5 text-brand-champagne">
            Collections
          </h4>
          <ul className="text-sm space-y-3 text-brand-silver/80">
            <li>
              <Link href="/collections/the-sn24-capsule" className="hover:text-brand-champagne transition-colors duration-300 flex items-center gap-1.5 w-fit">
                <span>The SN24 Capsule</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-champagne"></span>
              </Link>
            </li>
            <li><Link href="/new-arrivals" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">New Arrivals</Link></li>
            <li><Link href="/shop" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">All Ready-to-Wear</Link></li>
            <li><Link href="/collections" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Curated Edits</Link></li>
          </ul>
        </div>
        
        {/* Client Support */}
        <div>
          <h4 className="font-sans font-semibold text-xs uppercase tracking-widest mb-5 text-brand-champagne">
            Client Support
          </h4>
          <ul className="text-sm space-y-3 text-brand-silver/80">
            <li><Link href="/contact" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Concierge & Contact</Link></li>
            <li><Link href="/contact" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">How to Measure Guide</Link></li>
            <li><Link href="/contact" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Lagos & GIG Dispatch</Link></li>
            <li><Link href="/account" className="hover:text-brand-champagne transition-colors duration-300 block w-fit">Order Tracking</Link></li>
          </ul>
        </div>
        
        {/* Newsletter & Contact Details */}
        <div className="flex flex-col">
          <h4 className="font-sans font-semibold text-xs uppercase tracking-widest mb-5 text-brand-champagne">
            The Newsletter
          </h4>
          <p className="text-xs text-brand-silver/70 mb-4 leading-relaxed">
            Receive private capsule drops and SN24 collection previews.
          </p>
          
          <form className="flex group focus-within:ring-1 focus-within:ring-brand-champagne rounded-sm overflow-hidden mb-6 shadow-sm border border-white/10">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-3.5 py-2.5 w-full text-xs text-brand-charcoal outline-none bg-brand-snow placeholder:text-brand-graphite/60 transition-colors" 
              aria-label="Email address for newsletter"
              required
            />
            <button 
              type="submit"
              className="bg-brand-champagne hover:bg-brand-softgold text-brand-midnight px-3.5 py-2.5 text-xs font-bold transition-colors duration-300 whitespace-nowrap flex items-center gap-1"
              aria-label="Subscribe"
            >
              <span>Join</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Quick Contact info */}
          <div className="text-xs space-y-2 text-brand-silver/70 mt-auto pt-2 border-t border-white/10">
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-brand-champagne transition-colors">
              <Mail size={13} className="text-brand-champagne shrink-0" />
              <span className="font-mono">{contactEmail}</span>
            </a>
            <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-brand-champagne transition-colors">
              <Phone size={13} className="text-brand-champagne shrink-0" />
              <span className="font-mono font-medium">{contactPhone}</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Legal & Payment Row */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-silver/60">
        <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        
        {/* Payment Channels Indicator */}
        <div className="flex items-center gap-3 text-[11px] text-brand-silver/50">
          <span>Secured via Paystack</span>
          <span>&bull;</span>
          <span>Cards</span>
          <span>&bull;</span>
          <span>Bank Transfer</span>
          <span>&bull;</span>
          <span>USSD</span>
        </div>

        <div className="flex gap-6">
          <Link href="/contact" className="hover:text-brand-snow transition-colors duration-300">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-brand-snow transition-colors duration-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
