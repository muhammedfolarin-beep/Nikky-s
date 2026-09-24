import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SN24 Atelier",
  description: "Privacy and data protection commitment for SN24 clients.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-softwhite pt-10 pb-24 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brand-graphite mb-8">
          <Link href="/home" className="hover:text-brand-midnight transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-brand-midnight">Privacy Policy</span>
        </nav>

        <div className="bg-white border border-brand-stone rounded-2xl p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-midnight text-brand-champagne text-[10px] uppercase font-mono font-bold tracking-widest mb-3">
              <ShieldCheck size={12} /> Client Data Protection
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-brand-midnight font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-brand-graphite mt-2">Effective Date: September 2026 &bull; SN24 Luxury Atelier</p>
          </div>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">1. Commitment to Client Confidentiality</h2>
            <p>
              At SN24, discretion and confidentiality are central to our atelier values. We collect only the information strictly necessary to craft your garments, ensure precise bespoke fits, and facilitate timely local or nationwide courier dispatch.
            </p>
          </section>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-brand-charcoal">
              <li><strong>Contact & Identity Details:</strong> Full name, telephone number for SMS delivery updates, and verified email address for order notifications.</li>
              <li><strong>Bespoke Tailoring Sizing:</strong> Body measurements (bust, waist, hips, sleeve length, shoulder span, height) submitted via our tape measurement guide.</li>
              <li><strong>Fulfillment Destinations:</strong> Physical delivery addresses within Lagos zones or nationwide interstate destinations.</li>
              <li><strong>Payment Information:</strong> Financial transactions are processed directly by our PCI-DSS compliant partner <strong>Paystack</strong>. SN24 never stores your raw credit/debit card numbers or bank security codes.</li>
            </ul>
          </section>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">3. Logistics & Third-Party Sharing</h2>
            <p>
              Your contact details and physical address are shared exclusively with trusted dispatch partners (e.g. Lagos Courier Dispatch and GIG Logistics Express) solely to execute shipping. We never sell, rent, or monetize client data.
            </p>
          </section>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">4. Client Rights & Deletion</h2>
            <p>
              You maintain the right to review, update, or request complete removal of your personal information and account records. For inquiries or data requests, please contact our concierge team directly at <strong>hello@sn24.com.ng</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
