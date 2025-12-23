"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/baseurl";
import AdminDashboard from "../page";
import Link from "next/link";
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users,Handshake  } from "lucide-react"

interface Enquiry {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  visitDate: string;
  propertyId: number;
}

interface Property {
  id: number;
  title: string;
  description: string;
  propertyFor: string;
  propertyType: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  amenities: string[];
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  images: string[];
}

export default function PropertyEnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }
  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/AllProperty-enquiries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch property enquiries");

        const data: Enquiry[] = await response.json();
        setEnquiries(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const handleShowProperty = async (propertyId: number) => {
    setSelectedProperty(null);
    setError("");
    setLoading(true);

    const token = localStorage.getItem("admintoken");
    if (!token) {
      setError("Authorization token is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/property/${propertyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch property details");

      const data: Property = await response.json();
      setSelectedProperty(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelectedProperty(null);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="container mx-auto p-4">
       <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r z-10">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Nagpur Properties
              </span>
            </Link>
          </div>
          <div className="flex-1 py-6 px-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted text-primary font-medium"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/Properties"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Building className="h-5 w-5" />
              <span>Properties</span>
            </Link>
            <Link
              href="/admin/propertyEnquiry"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Enquiries</span>
            </Link>
           <Link
              href="/admin/enquiries"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Handshake  className="h-5 w-5" />
              <span>Legal Consultancy Enquiry</span>
            </Link>
          
            <Link
              href="/admin/getusers"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </div>
          <div className="p-4 border-t">
            <button
              className="flex items-center space-x-2 px-3 py-2 w-full rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={handleclick}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-white border-b z-10 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              NP Admin
            </span>
          </Link>
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={handleclick}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </button>
        </div>




      
       <main className="md:ml-64 px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Property Enquiries
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View customer enquiries and property details
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Message</th>
              <th className="px-6 py-4 text-left">Visit Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {enquiries.map((enquiry, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {enquiry.fullName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {enquiry.email}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {enquiry.phone}
                </td>

                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {enquiry.message}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {enquiry.visitDate}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() =>
                      handleShowProperty(enquiry.propertyId)
                    }
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition"
                  >
                    View Property
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>

    {/* PROPERTY MODAL */}
    {selectedProperty && (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          >
            ×
          </button>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedProperty.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedProperty.description}
            </p>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
              <div className="space-y-2">
                <p><strong>Property For:</strong> {selectedProperty.propertyFor}</p>
                <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
                <p><strong>Price:</strong> ₹{selectedProperty.price.toLocaleString()}</p>
                <p><strong>Area:</strong> {selectedProperty.area} sq.ft</p>
              </div>

              <div className="space-y-2">
                <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                <p><strong>Furnishing:</strong> {selectedProperty.furnishing}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-gray-100">
                    {selectedProperty.status}
                  </span>
                </p>
              </div>
            </div>

            <p className="mb-3 text-sm">
              <strong>Amenities:</strong>{" "}
              {selectedProperty.amenities.join(", ")}
            </p>

            <p className="mb-6 text-sm">
              <strong>Address:</strong>{" "}
              {selectedProperty.address}, {selectedProperty.locality},{" "}
              {selectedProperty.city}, {selectedProperty.state} -{" "}
              {selectedProperty.pincode}
            </p>

            {/* IMAGES */}
            {selectedProperty.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProperty.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="rounded-lg h-56 w-full object-cover border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
