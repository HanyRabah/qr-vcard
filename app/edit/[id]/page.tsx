"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditVCard() {
  const router = useRouter();
  const { id } = useParams();
  const vCardId = id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    existingProfilePicture: "", // Store the existing profile picture URL
  });

  useEffect(() => {
    if (!vCardId) {
      setError("No vCard ID provided.");
      setLoading(false);
      return;
    }

    const fetchVCard = async () => {
      try {
        const response = await fetch(`/api/vcards/${vCardId}`); 
        if (!response.ok) throw new Error("Failed to fetch vCard");

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          ...data,
          existingProfilePicture: data.profilePicture || "", // Store existing profile picture URL
        }));
        setPreviewImage(data.profilePicture || null); // Set preview image if available
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVCard();
  }, [vCardId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files) {
      const file = files[0];
      setFormData({ ...formData, profilePicture: file });
      setPreviewImage(URL.createObjectURL(file)); // Update preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCardId) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "existingProfilePicture") return; // Don't send existing picture URL
      if (value !== null) formDataToSend.append(key, value as string | Blob);
    });

    try {
      const response = await fetch(`/api/vcards/${vCardId}`, {  
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to update vCard");
      }

      alert("vCard updated successfully!");
      router.push(`/vcard/${vCardId}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  
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
            value={formData.firstName || ""}
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

          {/* Display existing profile picture */}
          {previewImage && (
            <div className="flex flex-col items-center">
              <p className="text-gray-700 text-sm">Current Profile Picture:</p>
              <Image
                src={previewImage}
                alt="Profile Preview"
                width={128}  // Adjust size as needed
                height={128} 
                className="w-32 h-32 rounded-full object-cover border border-gray-300"
              />
            </div>
          )}

          {/* File input for new profile picture */}
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
