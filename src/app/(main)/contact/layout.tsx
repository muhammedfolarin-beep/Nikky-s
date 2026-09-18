import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concierge & Support | SN24 Atelier",
  description: "Get in touch with the SN24 Atelier support team. We're here to help with bespoke fittings, styling advice, and orders.",
  openGraph: {
    title: "Concierge & Support | SN24 Atelier",
    description: "Get in touch with the SN24 Atelier support team. We're here to help with bespoke fittings, styling advice, and orders.",
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
