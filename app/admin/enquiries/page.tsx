"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users } from "lucide-react";
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
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Enquiry List</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Full Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Phone</th>
              <th className="px-6 py-3 text-left font-semibold">Required Service</th>
              <th className="px-6 py-3 text-left font-semibold">Message</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b hover:bg-gray-100 transition">
                <td className="px-6 py-4">{enquiry.id}</td>
                <td className="px-6 py-4">{enquiry.fullname}</td>
                <td className="px-6 py-4">{enquiry.email}</td>
                <td className="px-6 py-4">{enquiry.phone}</td>
                <td className="px-6 py-4">{enquiry.requredService}</td>
                <td className="px-6 py-4">{enquiry.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryTable;