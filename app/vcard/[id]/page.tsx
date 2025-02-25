import prisma from '@/lib/prisma';

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
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">vCard Details</h1>
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Name:</span> {vcard.firstName} {vcard.lastName}
          </p>
          <p>
            <span className="font-semibold">Company:</span> {vcard.company}
          </p>
          <p>
            <span className="font-semibold">Job Title:</span> {vcard.jobTitle}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {vcard.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {vcard.phone}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {vcard.address}, {vcard.city}, {vcard.postalCode}, {vcard.country}
          </p>
          <p>
            <span className="font-semibold">Website:</span>{' '}
            <a href={vcard.website} className="text-blue-500 hover:underline">
              {vcard.website}
            </a>
          </p>
        </div>
        <button
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          onClick={() => {
            const vcardData = `BEGIN:VCARD
            VERSION:3.0
            N:${vcard.lastName};${vcard.firstName}
            FN:${vcard.firstName} ${vcard.lastName}
            ORG:${vcard.company}
            TITLE:${vcard.jobTitle}
            EMAIL;TYPE=INTERNET:${vcard.email}
            TEL;TYPE=CELL:${vcard.phone}
            ADR;TYPE=WORK:;;${vcard.address};${vcard.city};${vcard.postalCode};${vcard.country}
            URL;TYPE=WORK:${vcard.website}
            END:VCARD`;
            const blob = new Blob([vcardData], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${vcard.firstName}_${vcard.lastName}.vcf`;
            link.click();
         }}
       >
         Add to Contacts
       </button>
     </div>
   </div>
 );
}