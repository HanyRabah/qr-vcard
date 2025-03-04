'use client'; 

import { useState } from 'react';

export default function VCardForm() {
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
    profilePicture: null as File | null,
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels.width / croppedAreaPixels.height)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture' && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      const formKey = key as keyof typeof formData;
      if (formData[formKey] !== null) {
        formDataToSend.append(formKey, formData[formKey] as string | Blob);
      }
    }

    const response = await fetch('/api/vcards', {
      method: 'POST',
      body: formDataToSend,
    });
    

    if (response.ok) {
      alert('vCard created successfully!');
    } else {
      alert('Failed to create vCard.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="company"
        placeholder="Company"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="jobTitle"
        placeholder="Job Title"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="address"
        placeholder="Address"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="postalCode"
        placeholder="Postal Code"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="country"
        placeholder="Country"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        name="website"
        placeholder="Website"
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {/* <input
        type="file"
        name="profilePicture"
        onChange={handleChange}
        accept="image/*"
        className="w-full p-2 border border-gray-300 rounded-md"
      /> */}

      {/* <div className="crop-container">
        <Cropper
          image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => onZoomChange(zoom)}
          classes={{ container: 'slider' }}
        />
      </div> */}


      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Add vCard
      </button>
    </form>
  );
}