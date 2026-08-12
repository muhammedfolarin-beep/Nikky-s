import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/lib/actions";
import AccountDashboardClient from "./AccountDashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Nikky's Clothing",
  description: "Manage your account, view orders, and update details.",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const orders = await getUserOrders(userId);

  return <AccountDashboardClient session={session} orders={orders} />;
}
