import AddToContactsButton from '@/app/components/AddToContactsButton';
import prisma from '@/lib/prisma';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

// import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;

export default async function VCardPage({ params }: { params: Params }) {
  const { id } = await params;

  // Fetch the vCard from the database
  const vcard = await prisma.vCard.findUnique({
    where: { id: parseInt(id) },
  });

  if (!vcard) {
    return <div>vCard not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 relative">
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          {vcard.profilePicture && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={vcard.profilePicture}
                alt="Profile Picture"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold mt-4">{vcard.firstName} {vcard.lastName}</h1>
          <p className="text-gray-600">{vcard.jobTitle}</p>
        </div>

        {/* Contact Details Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Phone className="text-gray-500 w-5 h-5" />
            <span className="font-semibold">{vcard.phone}</span>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="text-gray-500 w-5 h-5" />
            <a href={`mailto:${vcard.email}`} className="font-semibold text-blue-500 hover:underline">
              {vcard.email}
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Globe className="text-gray-500 w-5 h-5" />
            <a href={vcard.website} className="font-semibold text-blue-500 hover:underline">
              {vcard.website}
            </a>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="text-gray-500 w-5 h-5 mt-1" />
            <div className="font-semibold">
              <p>{vcard.address}</p>
              <p>{vcard.city}, {vcard.postalCode}</p>
              <p>{vcard.country}</p>
            </div>
          </div>
        </div>

        {/* Add to Contacts Button */}
        <div className="mt-8">
          <AddToContactsButton vcard={vcard} />
        </div>
      </div>
    </div>
  );
}
