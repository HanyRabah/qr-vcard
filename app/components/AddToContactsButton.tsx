'use client'; 

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
    // Fix the vCard formatting - proper line breaks and no extra whitespace
    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:${vcard.lastName};${vcard.firstName};;;
FN:${vcard.firstName} ${vcard.lastName}
ORG:${vcard.company}
TITLE:${vcard.jobTitle}
EMAIL;type=INTERNET:${vcard.email}
TEL;type=CELL:${vcard.phone}
ADR;type=WORK:;;${vcard.address};${vcard.city};${vcard.postalCode};${vcard.country}
URL:${vcard.website}
END:VCARD`;

    // Create the download - this approach works better on mobile
    const blob = new Blob([vcardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    
    // For iOS devices, we need a different approach
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    
    if (isIOS) {
      // For iOS, open the vCard in a new window/tab
      window.open(url, '_blank');
    } else {
      // For other devices, trigger download as before
      const link = document.createElement('a');
      link.href = url;
      link.download = `${vcard.firstName}_${vcard.lastName}.vcf`;
      document.body.appendChild(link); // This is important for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
    }
    
    // Clean up the URL object
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <button 
      onClick={handleClick}
      className=" w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Add to Contacts
    </button>
  );
}