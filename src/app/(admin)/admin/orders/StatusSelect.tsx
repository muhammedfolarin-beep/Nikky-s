"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions";

export default function StatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsLoading(true);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setStatus(newStatus);
    }
    setIsLoading(false);
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "PAID":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "IN_PRODUCTION":
        return "bg-purple-50 text-purple-800 border-purple-200 font-semibold";
      case "READY_FOR_DISPATCH":
        return "bg-teal-50 text-teal-800 border-teal-200 font-semibold";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <select 
      value={status} 
      onChange={handleChange}
      disabled={isLoading}
      className={`text-xs font-medium rounded-md px-2.5 py-1.5 border transition-colors outline-none focus:ring-1 focus:ring-brand-midnight cursor-pointer ${getStatusStyles(status)}`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="IN_PRODUCTION">IN PRODUCTION</option>
      <option value="READY_FOR_DISPATCH">READY FOR DISPATCH</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
