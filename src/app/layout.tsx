import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nikky's Clothing",
    default: "Nikky's Clothing | Premium E-Commerce",
  },
  description: "Premium clothing curated for every occasion. Explore timeless essentials and modern silhouettes.",
  openGraph: {
    title: "Nikky's Clothing | Premium E-Commerce",
    description: "Premium clothing curated for every occasion. Explore timeless essentials and modern silhouettes.",
    url: "https://nikkys-clothing.com",
    siteName: "Nikky's Clothing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Nikky's Clothing Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikky's Clothing | Premium E-Commerce",
    description: "Premium clothing curated for every occasion. Explore timeless essentials and modern silhouettes.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"],
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
