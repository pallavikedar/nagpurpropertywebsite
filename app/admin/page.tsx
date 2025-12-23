// "use client"

// import { Label } from "@/components/ui/label"

// import { useState,useEffect } from "react"
// import Link from "next/link"
// import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users, Handshake  } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { properties } from "@/lib/data"
// import { useRouter } from "next/navigation";


// export default function AdminDashboard() {
//   const router = useRouter()
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//  const handleclick = () => {
//     localStorage.removeItem("token")
//     router.push("/Login"); 
    
//  }
//  useEffect(() => {
//   // Check if the user is logged in
//   const adminLoggedIn = Boolean(localStorage.getItem("adminLoggedIn")); // Replace with actual logic
//   setIsLoggedIn(adminLoggedIn);

//   // Redirect based on login status
//   if (!adminLoggedIn) {
//     router.push("/Login"); // Redirect to login if not logged in
//   } else {
//     router.push("/admin"); // Redirect to admin dashboard if logged in
//   }
// }, [router]);

// if (!isLoggedIn) {
//   return null; // Prevent rendering until redirection is complete
// }
//   return (
//     <div className="min-h-screen bg-muted/30">
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r z-10">
//           <div className="p-4 border-b">
//             <Link href="/" className="flex items-center space-x-2">
//               <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//                 Nagpur Properties
//               </span>
//             </Link>
//           </div>
//           <div className="flex-1 py-6 px-4 space-y-1">
//             <Link
//               href="/admin"
//               className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted text-primary font-medium"
//             >
//               <LayoutDashboard className="h-5 w-5" />
//               <span>Dashboard</span>
//             </Link>
//             <Link
//               href="/admin/Properties"
//               className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//             >
//               <Building className="h-5 w-5" />
//               <span>Properties</span>
//             </Link>
//             <Link
//               href="/admin/propertyEnquiry"
//               className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//             >
//               <Users className="h-5 w-5" />
//               <span>Enquiries</span>
//             </Link>
//             <Link
//               href="/admin/enquiries"
//               className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//             >
//               <Handshake  className="h-5 w-5" />
//               <span>Legal Consultancy Enquiry</span>
//             </Link>
//             <Link
//               href="/admin/getusers"
//               className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//             >
//               <Settings className="h-5 w-5" />
//               <span>Users</span>
//             </Link>
//           </div>
//           <div className="p-4 border-t">
//             <button
//               className="flex items-center space-x-2 px-3 py-2 w-full rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//               onClick={handleclick}
//             >
//               <LogOut className="h-5 w-5" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Header */}
//         <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-white border-b z-10 flex items-center justify-between px-4">
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//               NP Admin
//             </span>
//           </Link>
//           <button
//             className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//             onClick={handleclick}
//           >
//             <LogOut className="h-5 w-5" />
//             <span className="sr-only">Logout</span>
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 md:ml-64 pt-16 md:pt-0">
//           <div className="p-6">
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
//               <p className="text-muted-foreground">Welcome to your admin dashboard</p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               <div className="bg-white p-6 rounded-lg shadow-sm border">
//                 <div className="flex items-center">
//                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
//                     <Building className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Total Properties</p>
//                     {/* <h3 className="text-2xl font-bold">{properties.length}</h3> */}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-sm border">
//                 <div className="flex items-center">
//                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
//                     <Home className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">For Sale</p>
//                     {/* <h3 className="text-2xl font-bold">{properties.filter((p) => p.type === "buy").length}</h3> */}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-sm border">
//                 <div className="flex items-center">
//                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
//                     <Building className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">For Rent</p>
//                     {/* <h3 className="text-2xl font-bold">{properties.filter((p) => p.type === "rent").length}</h3> */}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-sm border">
//                 <div className="flex items-center">
//                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
//                     <Users className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Enquiries</p>
//                     {/* <h3 className="text-2xl font-bold">24</h3> */}
//                   </div>
//                 </div>
//               </div>
//             </div>

           
//             {/* Quick Actions */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border">
//               <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <Button className="h-auto py-4 justify-start">
//                   <Plus className="h-5 w-5 mr-2" />
//                   Add New Property
//                 </Button>
//                 <Button variant="outline" className="h-auto py-4 justify-start">
//                   <ListFilter className="h-5 w-5 mr-2" />
//                   Manage Properties
//                 </Button>
//                 <Button variant="outline" className="h-auto py-4 justify-start">
//                   <Users className="h-5 w-5 mr-2" />
//                   View Enquiries
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // function AdminLogin({ onLogin }: { onLogin: () => void }) {
// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
// //       <div className="w-full max-w-md">
// //         <div className="text-center mb-8">
// //           <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
// //             Nagpur Properties
// //           </h1>
// //           <p className="text-muted-foreground mt-2">Admin Dashboard</p>
// //         </div>

// //         <div className="bg-white p-8 rounded-lg shadow-md border">
// //           <h2 className="text-xl font-bold mb-6">Login to Admin Panel</h2>
// //           <form
// //             className="space-y-4"
// //             onSubmit={(e) => {
// //               e.preventDefault()
// //               onLogin()
// //             }}
// //           >
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <Input id="email" type="email" placeholder="Enter your email" defaultValue="admin@nagpurproperties.com" />
// //             </div>

// //             <div className="space-y-2">
// //               <div className="flex items-center justify-between">
// //                 <Label htmlFor="password">Password</Label>
// //                 <Link href="#" className="text-sm text-primary hover:underline">
// //                   Forgot password?
// //                 </Link>
// //               </div>
// //               <Input id="password" type="password" placeholder="Enter your password" defaultValue="admin123" />
// //             </div>

// //             <Button type="submit" className="w-full">
// //               Login
// //             </Button>
// //           </form>

// //           <div className="mt-6 text-center text-sm">
// //             <Link href="/" className="text-primary hover:underline">
// //               Return to Website
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building,
  Home,
  LayoutDashboard,
  Users,
  LogOut,
  Handshake,
  Settings,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { BASE_URL } from "../baseurl";


const COLORS = ["#4690beff", "#16a34a", "#f59e0b", "#dc2626"];

export default function AdminDashboard() {
  const router = useRouter();

  const [properties, setProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    if (!token) router.push("/Login");
  }, [router]);

  /* ---------------- FETCH PROPERTIES ---------------- */
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("admintoken");
      const res = await fetch(`${BASE_URL}/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProperties(data);
    };
    fetchProperties();
  }, []);

  /* ---------------- FETCH ENQUIRIES ---------------- */
  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem("admintoken");
      const res = await fetch(`${BASE_URL}/AllProperty-enquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setEnquiries(data);
      setLoading(false);
    };
    fetchEnquiries();
  }, []);

  /* ---------------- CHART DATA ---------------- */
  const propertyStatusData = [
    { name: "Accepted", value: properties.filter(p => p.status === "ACCEPTED").length },
    { name: "Pending", value: properties.filter(p => p.status === "PENDING").length },
    { name: "Rejected", value: properties.filter(p => p.status === "REJECT").length },
  ];

  const enquiryGraphData = Object.values(
    enquiries.reduce((acc: any, e: any) => {
      acc[e.visitDate] = acc[e.visitDate] || { date: e.visitDate, count: 0 };
      acc[e.visitDate].count++;
      return acc;
    }, {})
  );

  const isUpcomingVisit = (date: string) => {
    const today = new Date();
    const visit = new Date(date);
    const diff = (visit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30 flex">

      {/* ---------------- SIDEBAR (UNCHANGED) ---------------- */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r z-10">
        <div className="p-4 border-b">
          <Link href="/" className="text-xl font-bold">Nagpur Properties</Link>
        </div>

        <div className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-2 p-2 bg-muted rounded">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/Properties" className="flex items-center gap-2 p-2">
            <Building size={18} /> Properties
          </Link>
          <Link href="/admin/propertyEnquiry" className="flex items-center gap-2 p-2">
            <Users size={18} /> Enquiries
          </Link>
          <Link href="/admin/enquiries" className="flex items-center gap-2 p-2">
            <Handshake size={18} /> Legal Enquiry
          </Link>
          <Link href="/admin/getusers" className="flex items-center gap-2 p-2">
            <Settings size={18} /> Users
          </Link>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("admintoken");
              router.push("/Login");
            }}
            className="flex gap-2 text-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* ---------------- MAIN ---------------- */}
      <div className="flex-1 md:ml-64 p-6">

        {/* ---------------- STATS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Stat title="Total Properties" value={properties.length} icon={<Building />} />
          <Stat title="Accepted" value={propertyStatusData[0].value} icon={<Home />} />
          <Stat title="Pending" value={propertyStatusData[1].value} icon={<Home />} />
          <Stat title="Enquiries" value={enquiries.length} icon={<Users />} />
        </div>

        {/* ---------------- CHARTS (ADDED) ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-4">Property Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={propertyStatusData} dataKey="value" outerRadius={90} label>
                  {propertyStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-4">Enquiries by Visit Date</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={enquiryGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4185a2ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ---------------- ENQUIRY TABLE ---------------- */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Property Enquiries</h2>

          <table className="min-w-full divide-y">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Message", "Visit Date"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-sm font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {enquiries.map((e, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{e.fullName}</td>
                  <td className="px-4 py-2">{e.email}</td>
                  <td className="px-4 py-2">{e.phone}</td>
                  <td className="px-4 py-2">{e.message}</td>
                  <td
                    className={`px-4 py-2 ${
                      isUpcomingVisit(e.visitDate)
                        ? "bg-yellow-100 text-yellow-800 font-semibold"
                        : ""
                    }`}
                  >
                    {e.visitDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */
const Stat = ({ title, value, icon }: any) => (
  <div className="bg-white p-5 rounded border flex items-center gap-4">
    <div className="p-3 bg-primary/10 rounded">{icon}</div>
    <div>
      <p className="text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);
