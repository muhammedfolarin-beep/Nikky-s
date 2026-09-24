import { getProducts, getStoreSettings } from "@/lib/actions";
import { Product } from "@/data/mockProducts";
import HomeClient from "./HomeClient";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "SN24 | Contemporary Luxury & Ready-to-Wear",
  description: "Bespoke made-to-measure tailoring, curated capsules, and ready-to-wear collections.",
};

export default async function Home() {
  const products = (await getProducts()) as Product[];
  const storeSettings = await getStoreSettings();

  return (
    <HomeClient 
      initialProducts={products} 
      initialSettings={storeSettings} 
    />
  );
}
