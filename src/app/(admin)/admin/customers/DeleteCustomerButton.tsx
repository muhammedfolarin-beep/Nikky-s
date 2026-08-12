"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/actions";

export default function DeleteCustomerButton({ customerId, customerName }: { customerId: string, customerName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${customerName || "this customer"}? This action cannot be undone.`)) {
      setIsDeleting(true);
      const res = await deleteUser(customerId);
      if (!res.success) {
        alert(res.error || "Failed to delete customer");
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
      title="Delete Customer"
    >
      <Trash2 size={18} />
    </button>
  );
}
