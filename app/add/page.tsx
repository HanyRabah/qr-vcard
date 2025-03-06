import VCardForm from "../components/VCardForm";
import Link from "next/link";

export default function AddVCard() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New vCard</h1>
          <Link href="/">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700">
              Back
            </button>
          </Link>
        </div>
        <VCardForm />
      </div>
    </div>
  );
}
