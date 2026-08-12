import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Nikky's Clothing support team. We're here to help with orders, styling advice, and more.",
  openGraph: {
    title: "Contact Us | Nikky's Clothing",
    description: "Get in touch with the Nikky's Clothing support team. We're here to help with orders, styling advice, and more.",
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
