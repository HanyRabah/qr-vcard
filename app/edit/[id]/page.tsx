"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";


export default function EditVCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vCardId = searchParams.get("id");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    website: "",
    profilePicture: null as File | null,
  });

  useEffect(() => {
    if (!vCardId) return;

    const fetchVCard = async () => {
      const response = await fetch(`/api/vcards/${vCardId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({ ...data, profilePicture: null });
      }
    };

    fetchVCard();
  }, [vCardId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCardId) return;

    const formDataToSend = new FormData();
    formDataToSend.append("id", vCardId);
    for (const key in formData) {
      const formKey = key as keyof typeof formData;
      if (formData[formKey] !== null) {
        formDataToSend.append(formKey, formData[formKey] as string | Blob);
      }
    }

    const response = await fetch("/api/vcards", {
      method: "PUT",
      body: formDataToSend,
    });

    if (response.ok) {
      alert("vCard updated successfully!");
      router.push(`/vcards/${vCardId}`);
    } else {
      alert("Failed to update vCard.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 relative">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Update vCard</h2>
        <div className="absolute top-4 right-4 flex space-x-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
          </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Update vCard
          </button>
        </form>
    </div>
    </div>
  );
}
