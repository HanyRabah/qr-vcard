'use client';

import Slider from '@mui/material/Slider';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import NextImage from './NextImage';

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

  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number | number[] | undefined>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area| null>(null);

  const onCropChange = (crop: {x: number, y: number}) => setCrop(crop);
  const onZoomChange = (zoom: number| number[]) => setZoom(zoom);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    
    // Create a circular crop
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    croppedCanvas.width = width;
    croppedCanvas.height = height;

    if (!croppedCtx) return;

    croppedCtx.beginPath();
    croppedCtx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    croppedCtx.clip();
    croppedCtx.drawImage(canvas, 0, 0);

    setCroppedImage(croppedCanvas.toDataURL());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCroppedImage();

    const formDataToSend = new FormData();
    for (const key in formData) {
      const formKey = key as keyof typeof formData;
      if (formData[formKey] !== null) {
        formDataToSend.append(formKey, formData[formKey] as string | Blob);
      }
    }

    if (croppedImage) {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      formDataToSend.append('profilePicture', blob, 'cropped-image.png');
    }

    const response = await fetch('/api/vcards', {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      alert('vCard created successfully!');
      router.push('/');
    } else {
      alert('Failed to create vCard.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="firstName" placeholder="First Name" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="lastName" placeholder="Last Name" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="company" placeholder="Company" onChange={(e) => setFormData({ ...formData, company: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="jobTitle" placeholder="Job Title" onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="email" placeholder="Email" type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="phone" placeholder="Phone" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="address" placeholder="Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="city" placeholder="City" onChange={(e) => setFormData({ ...formData, city: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="postalCode" placeholder="Postal Code" onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="country" placeholder="Country" onChange={(e) => setFormData({ ...formData, country: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />
      <input name="website" placeholder="Website" onChange={(e) => setFormData({ ...formData, website: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-md" />

      <input type="file" name="profilePicture" onChange={handleImageUpload} accept="image/*" className="w-full p-2 border border-gray-300 rounded-md" />

      {imageSrc && (
        <>
          <div className="crop-container">
            <Cropper image={imageSrc} crop={crop} zoom={zoom as number} aspect={1} cropShape="round" showGrid={false} onCropChange={onCropChange} onCropComplete={onCropComplete} onZoomChange={onZoomChange} />
          </div>
          <div className="controls">
            <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => onZoomChange(zoom)} />
          </div>
          <button type="button" onClick={createCroppedImage} className="bg-green-500 text-white px-4 py-2 rounded-md">Crop Image</button>
        </>
      )}

      {croppedImage && <NextImage src={croppedImage} alt="Cropped Preview" className="rounded-full w-24 h-24 mx-auto" />}

      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Add vCard</button>
    </form>
  );
}
