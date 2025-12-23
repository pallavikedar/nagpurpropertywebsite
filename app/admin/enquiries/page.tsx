"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building, Handshake, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users } from "lucide-react";
import { BASE_URL } from "@/app/baseurl";
import Router from "next/router";

interface Enquiry {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  requredService: string;
  message: string;
}

const EnquiryTable: React.FC = () => {
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    router.push("/Login");
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
      const token = localStorage.getItem("admintoken");

      if (!token) {
        alert("Admin token is missing. Please log in again.");
        router.push("/Login");
        return;
      }

      
        const response = await fetch(`${BASE_URL}/show-Enquire`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch enquiries. Please try again.");
        }

        const data: Enquiry[] = await response.json();
        setEnquiries(data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

       <main className="md:ml-64 px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Legal Consultancy Enquiries
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage legal service enquiries
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {/* <th className="px-6 py-4 text-left">ID</th> */}
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Service</th>
              <th className="px-6 py-4 text-left">Message</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {enquiries.map((enquiry) => (
              <tr
                key={enquiry.id}
                className="hover:bg-gray-50 transition"
              >
                {/* <td className="px-6 py-4 text-gray-700">
                  #{enquiry.id}
                </td> */}

                <td className="px-6 py-4 font-medium text-gray-800">
                  {enquiry.fullname}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {enquiry.email}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {enquiry.phone}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">
                    {enquiry.requredService}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {enquiry.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  </div>
  );
};

export default EnquiryTable;