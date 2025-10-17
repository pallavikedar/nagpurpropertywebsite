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




      
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Property Enquiries</h1>

      {/* Enquiries Table */}
      <div className="overflow-x-auto shadow-md rounded-lg mb-8"  style={{marginLeft:"280px"}}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Full Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Message</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Visit Date</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enquiries.map((enquiry, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{enquiry.fullName}</td>
                <td className="px-4 py-2">{enquiry.email}</td>
                <td className="px-4 py-2">{enquiry.phone}</td>
                <td className="px-4 py-2">{enquiry.message}</td>
                <td className="px-4 py-2">{enquiry.visitDate}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={() => handleShowProperty(enquiry.propertyId)}
                  >
                    Show Property
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedProperty.title}</h2>
              <p className="text-gray-700 mb-4">{selectedProperty.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Property For:</strong> {selectedProperty.propertyFor}</p>
                  <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
                  <p><strong>Price:</strong> ₹{selectedProperty.price.toLocaleString()}</p>
                  <p><strong>Area:</strong> {selectedProperty.area} sq. ft.</p>
                </div>
                <div>
                  <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                  <p><strong>Furnishing:</strong> {selectedProperty.furnishing}</p>
                  <p><strong>Status:</strong> {selectedProperty.status}</p>
                </div>
              </div>

              <p className="mb-2"><strong>Amenities:</strong> {selectedProperty.amenities.join(", ")}</p>
              <p className="mb-4">
                <strong>Address:</strong> {selectedProperty.address}, {selectedProperty.locality}, {selectedProperty.city}, {selectedProperty.state}, {selectedProperty.pincode}
              </p>

              {/* Images */}
              {selectedProperty.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProperty.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Property Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
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
