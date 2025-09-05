"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "../baseurl";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("usertoken") || localStorage.getItem("admintoken");

        if (!token) {
          alert("You need to log in to view your properties.");
          window.location.href = "/Login";
          return;
        }

        const response = await fetch(`${BASE_URL}/userproperties`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties. Please try again.");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">My Properties</h1>

            {loading ? (
              <p className="text-center">Loading properties...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : properties.length === 0 ? (
              <p className="text-center">No properties found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">Title</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Price</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Amenities</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Address</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Images</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property: any) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{property.title}</td>
                        <td className="border border-gray-200 px-4 py-2">{property.description}</td>
                        <td className="border border-gray-200 px-4 py-2">₹{property.price.toLocaleString()}</td>
                        <td className="border border-gray-200 px-4 py-2">{property.propertyType}</td>
                        <td
                          className={`border border-gray-200 px-4 py-2 ${
                            property.status === "ACCEPTED"
                              ? "text-green-600"
                              : property.status === "PENDING"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {property.status}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {property.amenities.length > 0 ? property.amenities.join(", ") : "No Amenities"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {property.address}, {property.locality}, {property.city}, {property.state}, {property.pincode}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {property.images.length > 0 ? (
                            <div className="flex space-x-2">
                              {property.images.map((image: string, index: number) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Property ${property.id} Image ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          ) : (
                            <span>No Images</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}