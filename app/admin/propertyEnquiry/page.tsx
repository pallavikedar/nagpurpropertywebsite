"use client";

import { useEffect, useState } from "react";

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
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]); // State to store all enquiries
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null); // State to store selected property details
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://192.168.1.4:8084/api/AllProperty-enquiries", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property enquiries");
        }

        const data: Enquiry[] = await response.json();
        setEnquiries(data); // Set the fetched data to state
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEnquiries();
  }, []);

  const handleShowProperty = async (propertyId: number) => {
    // setLoading(true);
    // setError("");
    setSelectedProperty(null);
    const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }

    try {
      const response = await fetch(`http://192.168.1.4:8084/api/property/${propertyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }

      const data: Property = await response.json();
      setSelectedProperty(data); // Set the fetched property details to state
      console.log(selectedProperty)
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Enquiries</h1>

      {/* Table to display all enquiries */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Visit Date</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{enquiry.fullName}</td>
              <td className="border border-gray-300 px-4 py-2">{enquiry.email}</td>
              <td className="border border-gray-300 px-4 py-2">{enquiry.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{enquiry.message}</td>
              <td className="border border-gray-300 px-4 py-2">{enquiry.visitDate}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleShowProperty(enquiry.propertyId)}
                >
                  Show Property
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display selected property details */}
      {selectedProperty && (
        <div className="mt-8 p-4 border rounded shadow-md bg-white">
          <h2 className="text-xl font-bold mb-4">Property Details</h2>
          <p><strong>Title:</strong> {selectedProperty.title}</p>
          <p><strong>Description:</strong> {selectedProperty.description}</p>
          <p><strong>Property For:</strong> {selectedProperty.propertyFor}</p>
          <p><strong>Property Type:</strong> {selectedProperty.propertyType}</p>
          <p><strong>Price:</strong> ₹{selectedProperty.price.toLocaleString()}</p>
          <p><strong>Area:</strong> {selectedProperty.area} sq. ft.</p>
          <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
          <p><strong>Furnishing:</strong> {selectedProperty.furnishing}</p>
          <p><strong>Amenities:</strong> {selectedProperty.amenities.join(", ")}</p>
          <p><strong>Address:</strong> {selectedProperty.address}, {selectedProperty.locality}, {selectedProperty.city}, {selectedProperty.state}, {selectedProperty.pincode}</p>
          <p><strong>Status:</strong> {selectedProperty.status}</p>
          {selectedProperty.images.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold">Images:</h3>
              {selectedProperty.images.map((image, index) => (
                <img key={index} src={image} alt={`Property Image ${index + 1}`} className="mt-2 w-full max-w-md" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}