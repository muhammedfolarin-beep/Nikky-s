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

  return (
    <select 
      value={status} 
      onChange={handleChange}
      disabled={isLoading}
      className={`text-xs font-medium rounded px-2 py-1 border ${
        status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
        status === 'PAID' ? 'bg-blue-100 text-blue-800 border-blue-200' :
        status === 'SHIPPED' ? 'bg-purple-100 text-purple-800 border-purple-200' :
        'bg-green-100 text-green-800 border-green-200'
      }`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="DELIVERED">DELIVERED</option>
    </select>
  );
}
