import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import ConciergeCallWidget from "@/components/ui/ConciergeCallWidget";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SN24",
    default: "SN24 | Contemporary Luxury & Ready-to-Wear",
  },
  description: "Contemporary luxury meets sculpted minimalism. Bespoke made-to-measure tailoring and ready-to-wear silhouettes by SN24.",
  openGraph: {
    title: "SN24 | Contemporary Luxury & Ready-to-Wear",
    description: "Bespoke made-to-measure tailoring, curated capsules, and ready-to-wear collections.",
    url: "https://sn24.com.ng",
    siteName: "SN24",
    images: [
      {
        url: "/uploads/1786653991709-494.jpg",
        width: 1200,
        height: 630,
        alt: "SN24",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/sn24-black-logo.png",
    shortcut: "/sn24-black-logo.png",
    apple: "/sn24-black-logo.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "SN24 | Contemporary Luxury & Ready-to-Wear",
    description: "Contemporary luxury meets sculpted minimalism.",
    images: ["/uploads/1786653991709-494.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-softwhite text-brand-charcoal selection:bg-brand-champagne selection:text-brand-midnight">
        <Providers>
          <main className="flex-1">
            {children}
          </main>
          {/* Global VIP Concierge & Support Speed-Dial */}
          <ConciergeCallWidget />
        </Providers>
      </body>
    </html>
  );
}
