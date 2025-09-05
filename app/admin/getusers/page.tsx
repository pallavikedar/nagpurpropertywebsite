"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/baseurl";

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
     

      {/* Table Format */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Table Format</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              {/* <th className="border border-gray-300 px-4 py-2">Role</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                {/* <td className="border border-gray-300 px-4 py-2">{user.role}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}