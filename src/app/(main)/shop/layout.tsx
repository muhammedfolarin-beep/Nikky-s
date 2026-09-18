import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description: "Browse our premium selection of coats, knitwear, and accessories.",
  openGraph: {
    title: "Shop All Collections | SN24",
    description: "Browse our signature selection of contemporary luxury and ready-to-wear silhouettes.",
  }
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
