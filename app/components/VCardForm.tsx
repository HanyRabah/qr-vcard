'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Area } from 'react-easy-crop';
import NextImage from './NextImage';

// Dynamically import the Cropper component to avoid SSR issues
const Cropper = dynamic(() => import('react-easy-crop').then((mod) => mod.default), {
  ssr: false,
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function VCardForm() {
  // Add client-side only rendering check
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [imageProps, setImageProps] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState(false);
  
  const onCropChange = (crop: {x: number, y: number}) => setCrop(crop);
  const onZoomChange = (newZoom: number) => setZoom(newZoom);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
      setOpen(true);
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
    
    // Convert to blob and store it
    const croppedDataUrl = croppedCanvas.toDataURL('image/png');
    
    try {
      // Create blob from data URL
      const blob = await fetch(croppedDataUrl).then(res => res.blob());
      setCroppedImageBlob(blob);
      setCroppedImage(croppedDataUrl);
      setImageProps({ width, height });
      setOpen(false);
    } catch (error) {
      console.error('Error creating image blob:', error);
      setOpen(false);
    }
  };
  
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object
    const formDataToSend = new FormData();
    
    // Add all text fields
    for (const key in formData) {
      const formKey = key as keyof typeof formData;
      if (formKey !== 'profilePicture' && formData[formKey] !== null) {
        formDataToSend.append(formKey, formData[formKey] as string);
      }
    }

    // Add the cropped image if available, otherwise use the original
    if (croppedImageBlob) {
      formDataToSend.append('profilePicture', croppedImageBlob, 'profile-picture.png');
    } else if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch('/api/vcards', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('vCard created successfully!');
        router.push('/');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create vCard' }));
        alert(errorData.message || 'Failed to create vCard.');
      }
    } catch (error) {
      console.error('Error creating vCard:', error);
      alert('An error occurred while creating the vCard.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Return null during SSR to prevent hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <Box component="div" sx={{ mx: 'auto', maxWidth: 'md', px: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" component="div">
              Profile Picture
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 1 }}
              >
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Click to upload a profile picture
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: JPG, PNG, GIF
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max file size: 5MB
              </Typography>
            </Stack>
          </Box>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="crop-modal-title"
          >
            <Box sx={modalStyle}>
              <Box sx={{ height: '250px', position: 'relative', mb: 2 }}>
                {imageSrc && (
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={onZoomChange}
                    rotation={0}
                    minZoom={1}
                    maxZoom={3}
                    zoomSpeed={0.1}
                    restrictPosition={false}
                    initialCroppedAreaPixels={undefined}
                    onInteractionStart={() => {}}
                    onInteractionEnd={() => {}}
                    style={{ containerStyle: {}, mediaStyle: {}, cropAreaStyle: {} }}
                    classes={{ containerClassName: '', mediaClassName: '', cropAreaClassName: '' }}
                    mediaProps={{}}
                    keyboardStep={0.1}
                    cropperProps={{}}
                  />
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Slider 
                  value={zoom} 
                  min={1} 
                  max={3} 
                  step={0.1} 
                  onChange={(_, newValue) => onZoomChange(newValue as number)} 
                />
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={createCroppedImage}
              >
                Crop Image
              </Button>
            </Box>
          </Modal>

          {croppedImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
              <Box
                sx={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
              >
                <NextImage 
                  src={croppedImage} 
                  width={imageProps.width} 
                  height={imageProps.height} 
                  alt="Cropped Preview" 
                />
              </Box>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="company"
                label="Company"
                value={formData.company}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="jobTitle"
                label="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="website"
                label="Website"
                value={formData.website}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            sx={{ mt: 3 }}
          >
            Add vCard
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}