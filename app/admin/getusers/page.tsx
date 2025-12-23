"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/baseurl";
import Link from "next/link";
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users,Handshake  } from "lucide-react"

// Updated User interface to include the role
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string; // Assuming role is a string like "Admin" or "User"
}

export default function UserListAndTable() {
  const [users, setUsers] = useState<User[]>([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors
const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/Alluser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Corrected header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await response.json(); // Ensure the response matches the User interface
        setUsers(data); // Set the fetched data to state
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

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
        <main className="md:ml-64 px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Users
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all registered users
        </p>
      </div>

      {/* USERS TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {/* <th className="px-6 py-4 text-left">ID</th> */}
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition"
              >
                {/* <td className="px-6 py-4 text-gray-700">
                  #{user.id}
                </td> */}

                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.email}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  </div>
  );
}