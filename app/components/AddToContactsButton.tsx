"use client";

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
    profilePicture: string | null; // Make sure this field exists
  };
}

export default function AddToContactsButton({ vcard }: AddToContactsButtonProps) {
  const handleClick = async () => {
    if (!vcard.profilePicture) {
      console.error("Profile picture URL is missing");
      return;
    }

    // Dynamically fetch the actual image URL
    const imageUrl = vcard.profilePicture;
    
    try {
      const imageBase64 = await fetch(imageUrl)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            })
        );

      // Extract Base64 data (remove the "data:image/jpeg;base64," part)
      const base64Data = imageBase64.split(",")[1];

      // Correct vCard structure with the dynamic image
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
PHOTO;ENCODING=b;TYPE=JPEG:${base64Data}
END:VCARD`;

      // Create the vCard file and trigger download
      const blob = new Blob([vcardData], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);

      // Handle iOS-specific behavior
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);

      if (isIOS) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${vcard.firstName}_${vcard.lastName}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="add-cont-btn w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Add to Contacts
    </button>
  );
}
