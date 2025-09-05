// import Link from "next/link"
// import { ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
// import { properties } from "@/lib/data"

// export default function PropertyEnquiryPage({ params }: { params: { id: string } }) {
//   // Ensure params.id is properly handled
//   const propertyId = params?.id;

//   // Fetch the property data based on the ID
//   const property = properties.find((p) => p.id === propertyId);

//   // Handle the case where the property is not found
//   if (!property) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-1 flex items-center justify-center">
//           <h1 className="text-2xl font-bold">Property not found</h1>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         {/* Breadcrumb */}
//         <div className="bg-muted py-4">
//           <div className="container px-4 md:px-6">
//             <div className="flex items-center text-sm">
//               <Link href="/" className="text-muted-foreground hover:text-foreground">
//                 Home
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//               <Link href="/properties" className="text-muted-foreground hover:text-foreground">
//                 Properties
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//               <Link
//                 href={`/properties/${property.id}`}
//                 className="text-muted-foreground hover:text-foreground truncate"
//               >
//                 {property.title}
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//               <span className="font-medium">Enquiry</span>
//             </div>
//           </div>
//         </div>

//         <section className="py-12">
//           <div className="container px-4 md:px-6">
//             <div className="max-w-3xl mx-auto">
//               <div className="bg-white p-8 rounded-lg shadow-md border">
//                 <h1 className="text-2xl font-bold mb-6">Enquire About This Property</h1>

//                 <div className="mb-6 p-4 bg-muted/50 rounded-lg">
//                   <h2 className="font-semibold">{property.title}</h2>
//                   <p className="text-sm text-muted-foreground">{property.address}</p>
//                   <p className="font-medium mt-2">
//                     ₹{property.price.toLocaleString()}
//                     {property.type === "rent" ? "/month" : ""}
//                   </p>
//                 </div>

//                 <form className="space-y-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input id="name" placeholder="Enter your full name" />
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input id="email" type="email" placeholder="Enter your email" />
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input id="phone" placeholder="Enter your phone number" />
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="message">Your Message</Label>
//                     <Textarea
//                       id="message"
//                       placeholder="I'm interested in this property and would like to know more about..."
//                       rows={4}
//                       defaultValue={`I'm interested in ${property.title} and would like to know more details.`}
//                     />
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="visit">Preferred Visit Date (Optional)</Label>
//                     <Input id="visit" type="date" />
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="contact-preference"
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                     />
//                     <Label htmlFor="contact-preference" className="text-sm">
//                       I prefer to be contacted via WhatsApp
//                     </Label>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="terms"
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                     />
//                     <Label htmlFor="terms" className="text-sm">
//                       I agree to the{" "}
//                       <Link href="#" className="text-primary hover:underline">
//                         terms and conditions
//                       </Link>{" "}
//                       and{" "}
//                       <Link href="#" className="text-primary hover:underline">
//                         privacy policy
//                       </Link>
//                     </Label>
//                   </div>

//                   <Button type="submit" className="w-full">
//                     Submit Enquiry
//                   </Button>
//                 </form>

//                 <div className="mt-6 text-center text-sm text-muted-foreground">
//                   <p>Your information is secure and will only be used to contact you regarding this property.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { properties } from "@/lib/data";
import { BASE_URL } from "@/app/baseurl";
export default function PropertyEnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    visitDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const resolvedParams = await params; // Unwrap the params Promise
        const propertyId = resolvedParams.id;
        const foundProperty = properties.find((p) => p.id === propertyId);
        setProperty(foundProperty || null); // Set the property or null if not found
      } catch (err) {
        console.error("Failed to resolve params:", err);
      }
    };

    fetchProperty();
  }, [params]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      propertyId: property.id,
    };

    try {
      const response = await fetch(`${BASE_URL }/Property-enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry. Please try again.");
      }

      setSuccess("Enquiry submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
        visitDate: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-muted py-4">
          <div className="container px-4 md:px-6">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              <Link href="/properties" className="text-muted-foreground hover:text-foreground">
                Properties
              </Link>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              <span className="font-medium truncate">{property.title}</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md border">
                <h1 className="text-2xl font-bold mb-6">Enquire About This Property</h1>

                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h2 className="font-semibold">{property.title}</h2>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                  <p className="font-medium mt-2">
                    ₹{property.price.toLocaleString()}
                    {property.type === "rent" ? "/month" : ""}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      id="message"
                      placeholder="I'm interested in this property and would like to know more about..."
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="visitDate">Preferred Visit Date (Optional)</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={formData.visitDate}
                      onChange={handleChange}
                    />
                  </div>

                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}

                  <Button type="submit" className="w-full">
                    Submit Enquiry
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}