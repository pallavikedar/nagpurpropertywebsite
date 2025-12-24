// "use client";

// import { useEffect, useState } from "react";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import { BASE_URL } from "@/app/baseurl";
// import Link from "next/link";
// import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users,Handshake  } from "lucide-react"
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// export default function AdminPropertiesPage() {
//   const router = useRouter()
//   const [properties, setProperties] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const handleclick = () => {
//     localStorage.removeItem("token")
//     router.push("/Login"); 
    
//  }
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const token = localStorage.getItem("admintoken");

//         if (!token) {
//           alert("You need to log in as an admin to view properties.");
//           window.location.href = "/Login";
//           return;
//         }

//         const response = await fetch(`${BASE_URL}/properties`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch properties. Please try again.");
//         }

//         const data = await response.json();
//         setProperties(data);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const handleStatusChange = async (propertyId: number, newStatus: string) => {
//     try {
//       const token = localStorage.getItem("admintoken");
  
//       if (!token) {
//         alert("Admin token is missing. Please log in again.");
//         return;
//       }
  
//       console.log("Property ID:", propertyId);
//       console.log("New Status:", newStatus);
  
//       const response = await fetch(`${BASE_URL}/updateStatus/${propertyId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json", // Ensure JSON format
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }), // Pass JSON body
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error Response:", errorData);
//         throw new Error(errorData.message || "Failed to update property status.");
//       }
  
//       // Update the status locally in the state
//       setProperties((prevProperties: any) =>
//         prevProperties.map((property: any) =>
//           property.id === propertyId
//             ? { ...property, status: newStatus }
//             : property
//         )
//       );
  
//       alert("Property status updated successfully!");
//     } catch (err: any) {
//       console.error("Error:", err);
  
//       if (err.message === "Failed to fetch") {
//         alert(
//           "Failed to connect to the server. Please check your network or server status."
//         );
//       } else {
//         alert(err.message || "Something went wrong. Please try again.");
//       }
//     }
//   };
//   const handleproperty=()=>{
//      router.push("/admin/addProperty"); 
//   }
//   return (
//     <div className="min-h-screen flex flex-col">
//          {/* Sidebar */}
//           <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r z-10">
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
//              <Link
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
//       <main className="flex-1 ml-0 md:ml-64 bg-gray-50 min-h-screen">
//   <section className="py-8 px-4 md:px-8">
//     {/* Page Header */}
//     <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Manage Properties
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           View and manage all listed properties
//         </p>
//       </div>
//       <Button onClick={handleproperty}>add Property</Button>
//     </div>

//     {/* Content Card */}
//     <div className="bg-white rounded-xl shadow-sm border">
//       {loading ? (
//         <div className="p-8 text-center text-gray-500">
//           Loading properties...
//         </div>
//       ) : error ? (
//         <div className="p-8 text-center text-red-500">{error}</div>
//       ) : properties.length === 0 ? (
//         <div className="p-8 text-center text-gray-500">
//           No properties found.
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//               <tr>
//                 <th className="px-6 py-4 text-left">Title</th>
//                 <th className="px-6 py-4 text-left">Description</th>
//                 <th className="px-6 py-4 text-left">Price</th>
//                 <th className="px-6 py-4 text-left">Type</th>
//                 <th className="px-6 py-4 text-left">Status</th>
//                 <th className="px-6 py-4 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {properties.map((property: any) => (
//                 <tr
//                   key={property.id}
//                   className="hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-4 font-medium text-gray-800">
//                     {property.title}
//                   </td>

//                   <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
//                     {property.description}
//                   </td>

//                   <td className="px-6 py-4 font-semibold text-gray-800">
//                     ₹{property.price.toLocaleString()}
//                   </td>

//                   <td className="px-6 py-4 text-gray-600">
//                     {property.propertyType}
//                   </td>

//                   {/* Status Badge */}
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
//                         ${
//                           property.status === "ACCEPTED"
//                             ? "bg-green-100 text-green-700"
//                             : property.status === "PENDING"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                     >
//                       {property.status}
//                     </span>
//                   </td>

//                   {/* Action */}
//                   <td className="px-6 py-4">
//                     <select
//                       value={property.status}
//                       onChange={(e) =>
//                         handleStatusChange(property.id, e.target.value)
//                       }
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
//                     >
//                       <option value="PENDING">Pending</option>
//                       <option value="ACCEPTED">Accepted</option>
//                       <option value="REJECT">Rejected</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </section>
// </main>

    
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";
import Link from "next/link";
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users, Handshake, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    router.push("/Login");
  };

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        alert("You need to log in as an admin to view properties.");
        router.push("/Login");
        return;
      }

      const response = await fetch(`${BASE_URL}/properties`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch properties.");

      const data = await response.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (propertyId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        alert("Admin token missing.");
        return;
      }

      const response = await fetch(`${BASE_URL}/updateStatus/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status.");
      }

      setProperties((prev: any) =>
        prev.map((p: any) =>
          p.id === propertyId ? { ...p, status: newStatus } : p
        )
      );

      alert("Property status updated!");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  };

  const handleEditProperty = (propertyId: number) => {
    router.push(`/admin/addProperty/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        alert("Admin token missing.");
        return;
      }

      const response = await fetch(`${BASE_URL}/deleteProperty/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete property.");
      }

      setProperties((prev: any) =>
        prev.filter((p: any) => p.id !== propertyId)
      );

      alert("Property deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  };

  const handleAddProperty = () => {
    router.push("/admin/addProperty");
  };
const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar and Mobile Header ... (same as before) */}
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
      <main className="flex-1 ml-0 md:ml-64 bg-gray-50 min-h-screen">
        <section className="py-8 px-4 md:px-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Manage Properties
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage all listed properties
              </p>
            </div>
            <Button onClick={handleAddProperty}>Add Property</Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No properties found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 text-left">Title</th>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4 text-left">Price</th>
                      <th className="px-6 py-4 text-left">Type</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {properties.map((property: any) => (
                      <tr key={property.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-800">{property.title}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{property.description}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">₹{property.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{property.propertyType}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              property.status === "ACCEPTED"
                                ? "bg-green-100 text-green-700"
                                : property.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <select
                            value={property.status}
                            onChange={(e) => handleStatusChange(property.id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECT">Rejected</option>
                          </select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property.id)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="h-4 w-4" /> Edit
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
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
