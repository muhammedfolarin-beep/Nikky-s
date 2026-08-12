import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description: "Browse our premium selection of coats, knitwear, and accessories.",
  openGraph: {
    title: "Shop All Collections | Nikky's Clothing",
    description: "Browse our premium selection of coats, knitwear, and accessories.",
  }
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
