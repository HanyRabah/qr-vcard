"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
// import VCardForm from "VCardForm";

import Link from "next/link";
import { FiEye, FiEdit } from "react-icons/fi";

type Vcard = {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website: string;
};
export default function Home() {
  const [vcards, setVcards] = useState<Vcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVcards();
  }, []);

  const fetchVcards = async () => {
    try {
      const response = await fetch("/api/vcards");
      if (!response.ok) {
        throw new Error("Failed to fetch vCards");
      }
      const data = await response.json();
      setVcards(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">vCard Generator</h1>

        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New vCard</h2>
          <VCardForm  />
        </div> */}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Members Details</h1>
          <Link href="/add">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
              + Add New Member Info
            </button>
          </Link>
        </div>

        {/* vCards Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p className="text-center">Loading vCards...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : vcards.length === 0 ? (
            <p className="text-center">No vCards found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vcards.map((vcard) => (
                <div key={vcard.id} className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{vcard.firstName} {vcard.lastName}</h3>
                    <div className="mt-2">
                      <QRCodeSVG value={`/vcard/${vcard.id}`} size={80} className="mx-auto" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Link href={`/vcard/${vcard.id}`}>
                      <FiEye className="text-blue-500 text-xl cursor-pointer hover:text-blue-700" />
                    </Link>
                    <Link href={`/edit/${vcard.id}`}>
                      <FiEdit className="text-green-500 text-xl cursor-pointer hover:text-green-700" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
