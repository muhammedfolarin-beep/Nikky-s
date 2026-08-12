import Link from "next/link";
import { getStoreSettings } from "@/lib/actions";

export default async function Footer() {
  const settings = await getStoreSettings();
  const storeName = settings?.storeName || "Nikky's";

  return (
    <footer className="w-full py-12 px-8 bg-brand-midnight text-brand-softwhite mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl mb-4 text-brand-snow">{storeName}</h3>
          <p className="text-sm text-brand-silver">Timeless • Elegant • Minimal</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-brand-snow">Shop</h4>
          <ul className="text-sm space-y-2 text-brand-silver">
            <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Best Sellers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-brand-snow">Support</h4>
          <ul className="text-sm space-y-2 text-brand-silver">
            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-brand-snow">Newsletter</h4>
          <p className="text-sm text-brand-silver mb-4">Stay Ahead of Fashion</p>
          <div className="flex">
            <input type="email" placeholder="Your email address" className="px-4 py-2 w-full text-sm rounded-l-sm text-brand-charcoal outline-none" />
            <button className="bg-brand-champagne text-white px-4 py-2 rounded-r-sm text-sm font-medium">Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
