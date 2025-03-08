import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// Fetch a single vCard
export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    
    const vCard = await prisma.vCard.findUnique({
      where: { id: id },
    });

    if (!vCard) {
      return NextResponse.json({ error: 'vCard not found' }, { status: 404 });
    }

    return NextResponse.json(vCard);
  } catch (error) {
    console.error('Error fetching vCard:', error.stack);
    return NextResponse.json({ error: 'Failed to fetch vCard' }, { status: 500 });
  }
}

// Update a vCard
export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "No vCard ID provided" }, { status: 400 });
    }

    const formData = await req.formData();

    const file = formData.get('profilePicture') as File;
    let profilePictureUrl = '';

    if (file) {
      const blob = await put(`qr-pictures/${file.name}`, file, { access: 'public' });
      profilePictureUrl = blob.url;
    }

    const updatedVCard = await prisma.vCard.update({
      where: { id: id },
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
        profilePicture: profilePictureUrl || undefined,
      },
    });

    return NextResponse.json(updatedVCard);
  } catch (error) {
    console.error('Error updating vCard:', error);
    return NextResponse.json({ error: 'Failed to update vCard' }, { status: 500 });
  }
}

// Delete a vCard
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    await prisma.vCard.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'vCard deleted successfully' });
  } catch (error) {
    console.error('Error deleting vCard:', error);
    return NextResponse.json({ error: 'Failed to delete vCard' }, { status: 500 });
  }
}
