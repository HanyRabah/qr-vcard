import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';


// Define the type for the vCard response
interface VCardResponse {
  id: number;
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


export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get('profilePicture') as File;
  let profilePictureUrl = '';

   if (file) {
    const blob = await put(`qr-pictures/${file.name}`, file, { access: 'public' });
    profilePictureUrl = blob.url;
  }

  const newVCard = await prisma.vCard.create({
    data: {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: formData.get('company') as string,
      jobTitle: formData.get('jobTitle') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      website: formData.get('website') as string,
      profilePicture: profilePictureUrl,
    },
  });

  return NextResponse.json(newVCard, { status: 201 });
}

export async function GET() {
  try {
    const vcards: VCardResponse[] = await prisma.vCard.findMany();
    return NextResponse.json(vcards);
  } catch (error) {
    console.error('Error:', error); // Debugging line
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

