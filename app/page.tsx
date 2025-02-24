'use client'; // Mark this as a Client Component

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [vcards, setVcards] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add vCard');
      }
      const newVCard = await response.json();
      setVcards([...vcards, newVCard]);
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        website: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">vCard Generator</h1>

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New vCard</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add vCard
            </button>
          </form>
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
              {vcards.map((vcard) => (
                <div key={vcard.id} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold">
                    {vcard.firstName} {vcard.lastName}
                  </h3>
                  <div className="mt-4">
                    <QRCodeSVG
                      value={`https://yourdomain.com/vcard/${vcard.id}`} // Dynamic URL for each vCard
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}