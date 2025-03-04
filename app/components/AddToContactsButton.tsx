'use client'; // Mark this as a Client Component


interface AddToContactsButtonProps {
  vcard: {
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
  };
}

export default function AddToContactsButton({ vcard }: AddToContactsButtonProps) {
  const handleClick = () => {
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
  };

  return (
    <button
      className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
      onClick={handleClick}
    >
      Add to Contacts
    </button>
  );
}