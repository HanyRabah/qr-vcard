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

export async function UPDATE(request: Request) {
  const formData = await request.formData();
  const id = parseInt(formData.get('id') as string);

  const file = formData.get('profilePicture') as File;
  let profilePictureUrl = '';

  if (file) {
    const blob = await put(`qr-pictures/${file.name}`, file, { access: 'public' });
    profilePictureUrl = blob.url;
  }

  const updatedVCard = await prisma.vCard.update({
    where: { id },
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

  return NextResponse.json(updatedVCard);
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Convert ID to number and delete vCard
    await prisma.vCard.delete({
      where: { id: parseInt(id) }, // Convert ID to integer
    });

    return NextResponse.json({ message: 'vCard deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting vCard:', error);
    return NextResponse.json({ error: 'Failed to delete vCard' }, { status: 500 });
  }
}