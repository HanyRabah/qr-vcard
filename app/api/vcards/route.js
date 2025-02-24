import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body); // Debugging line

    if (!body) {
      return Response.json({ error: 'Request body is required' }, { status: 400 });
    }

    const { firstName, lastName, company, jobTitle, email, phone, address, city, postalCode, country, website } = body;

    const newVCard = await prisma.vCard.create({
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

    return Response.json(newVCard, { status: 201 });
  } catch (error) {
    console.error('Error:', error); // Debugging line
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const vcards = await prisma.vCard.findMany();
  return Response.json(vcards);
}
