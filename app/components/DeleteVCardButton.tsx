"use client"; // Client Component for handling router actions

import { useRouter } from "next/navigation";
import { X, Trash } from "lucide-react";

export default function DeleteVCardButton({ id }: { id: string }) {
  const router = useRouter();

  // Handle Delete Function
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this vCard?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/vcards/${id}`, { method: "DELETE" });
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting vCard:", error);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex space-x-4">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:text-red-800"
      >
        <Trash className="w-6 h-6" />
      </button>

      {/* Close Button */}
      <button
        onClick={() => router.push("/")}
        className="p-2 text-gray-600 hover:text-gray-800"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
