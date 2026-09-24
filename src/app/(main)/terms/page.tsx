import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | SN24 Atelier",
  description: "Terms and conditions governing orders, bespoke tailoring, and dispatch.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-brand-softwhite pt-10 pb-24 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brand-graphite mb-8">
          <Link href="/home" className="hover:text-brand-midnight transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-brand-midnight">Terms of Service</span>
        </nav>

        <div className="bg-white border border-brand-stone rounded-2xl p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-midnight text-brand-champagne text-[10px] uppercase font-mono font-bold tracking-widest mb-3">
              <ShieldCheck size={12} /> Commercial Agreement
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-brand-midnight font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-brand-graphite mt-2">Effective Date: September 2026 &bull; SN24 Luxury Atelier</p>
          </div>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">1. Ready-to-Wear vs. Bespoke Tailoring Orders</h2>
            <p>
              <strong>Ready-to-Wear:</strong> Standard-sized garments ship within 24 to 48 business hours of payment confirmation.
            </p>
            <p>
              <strong>Made-to-Measure Bespoke:</strong> Garments crafted to individual customer measurements require an artisan pattern-making and tailoring window of <strong>5 to 7 working days</strong> prior to dispatch.
            </p>
          </section>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">2. Measurement Accuracy & Alterations</h2>
            <p>
              Clients are responsible for the accuracy of custom dimensions entered using our Tape Measurement Guide. In the event of minor fit variances, complimentary alteration consultations are available within 7 days of package delivery.
            </p>
          </section>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">3. Delivery & Courier Fulfillment</h2>
            <p>
              Deliveries within Lagos are fulfilled via licensed local dispatch couriers (1 to 2 business days post-production). Interstate shipments across Nigeria are routed exclusively via GIG Logistics Express (3 to 5 business days). Tracking codes are provided via SMS and email.
            </p>
          </section>

          <section className="space-y-3 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-display text-lg font-bold text-brand-midnight">4. Returns & Exchanges</h2>
            <p>
              Unworn ready-to-wear items with original tags attached are eligible for return or exchange within 14 days of receipt. Due to individual pattern creation, bespoke custom-fitted garments are non-refundable but covered by our fitting guarantee.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
