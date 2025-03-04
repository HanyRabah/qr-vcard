'use client'; 

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import VCardForm from './components/VCardForm';

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
}
export default function Home() {
  const [vcards, setVcards] = useState<Vcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVcards();
  }, []);

  const fetchVcards = async () => {
    try {
      const response = await fetch('/api/vcards');
      if (!response.ok) {
        throw new Error('Failed to fetch vCards');
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">vCard Generator</h1>

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New vCard</h2>
          <VCardForm  />
        </div>

        {/* vCards Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated vCards</h2>
          {loading ? (
            <p className="text-center">Loading vCards...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : vcards.length === 0 ? (
            <p className="text-center">No vCards found.</p>
          ) : (
            <div className="space-y-6">
              {vcards.map((vcard) => {
                return (
                <div key={vcard.id} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold">
                    {vcard.firstName} {vcard.lastName}
                  </h3>
                  <div className="mt-4">
                    <QRCodeSVG
                      value={`/vcard/${vcard.id}`}
                      size={128}
                      className="mx-auto"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p>
                      <span className="font-medium">Phone:</span> {vcard.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {vcard.email}
                    </p>
                    <p>
                      <span className="font-medium">Website:</span>{' '}
                      <a href={vcard.website} className="text-blue-500 hover:underline">
                        {vcard.website}
                      </a>
                    </p>
                  </div>
                </div>
              )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}