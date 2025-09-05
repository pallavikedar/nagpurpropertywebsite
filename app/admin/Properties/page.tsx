"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";
import Link from "next/link";
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users } from "lucide-react"
export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        if (!token) {
          alert("You need to log in as an admin to view properties.");
          window.location.href = "/Login";
          return;
        }

        const response = await fetch(`${BASE_URL}/properties`, {
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

  const handleStatusChange = async (propertyId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("admintoken");
  
      if (!token) {
        alert("Admin token is missing. Please log in again.");
        return;
      }
  
      console.log("Property ID:", propertyId);
      console.log("New Status:", newStatus);
  
      const response = await fetch(`${BASE_URL}/updateStatus/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Ensure JSON format
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }), // Pass JSON body
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(errorData.message || "Failed to update property status.");
      }
  
      // Update the status locally in the state
      setProperties((prevProperties: any) =>
        prevProperties.map((property: any) =>
          property.id === propertyId
            ? { ...property, status: newStatus }
            : property
        )
      );
  
      alert("Property status updated successfully!");
    } catch (err: any) {
      console.error("Error:", err);
  
      if (err.message === "Failed to fetch") {
        alert(
          "Failed to connect to the server. Please check your network or server status."
        );
      } else {
        alert(err.message || "Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
         {/* Sidebar */}
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
              href="/admin/settings"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
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
      <main className="flex-1">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">
              Admin - Manage Properties
            </h1>

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
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Title
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Description
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Price
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Type
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Status
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property: any) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">
                          {property.title}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {property.description}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          ₹{property.price.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {property.propertyType}
                        </td>
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
                          <select
                            value={property.status}
                            onChange={(e) => {
                              console.log("Selected Status:", e.target.value);
                              handleStatusChange(property.id, e.target.value);
                            }}
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="REJECT">REJECT</option>
                          </select>
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
    
    </div>
  );
}
