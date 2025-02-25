import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Define the type for the vCard request body
interface VCardRequestBody {
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
  try {
    const body: VCardRequestBody = await request.json();
    console.log('Request Body:', body); // Debugging line

    if (!body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    const { firstName, lastName, company, jobTitle, email, phone, address, city, postalCode, country, website } = body;

    const newVCard: VCardResponse = await prisma.vCard.create({
      data: {
        firstName,
        lastName,
        company,
        jobTitle,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        website,
      },
    });

    return NextResponse.json(newVCard, { status: 201 });
  } catch (error) {
    console.error('Error:', error); // Debugging line
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
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