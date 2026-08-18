// "use client";

// import { useEffect, useState } from "react";
// import { BASE_URL } from "@/app/baseurl";
// import Link from "next/link";
// import { 
//   Building, 
//   Plus, 
//   Edit2, 
//   Trash2, 
//   Eye, 
//   Search, 
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Download,
//   TrendingUp,
//   Home,
//   MapPin,
//   DollarSign,
//   Calendar,
//   User
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import AdminSidebar from "@/components/admin-sidebar";

// export default function AdminPropertiesPage() {
//   const router = useRouter();
//   const [properties, setProperties] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedProperties, setSelectedProperties] = useState([]);
//   const [toastMessage, setToastMessage] = useState(null);

//   const showToast = (message, type) => {
//     setToastMessage({ message, type });
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   const fetchProperties = async () => {
//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         alert("You need to log in as an admin to view properties.");
//         router.push("/Login");
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/properties`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch properties.");

//       const data = await response.json();
//       setProperties(data);
//       setFilteredProperties(data);
//       return data;
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//       showToast(err.message || "Failed to fetch properties", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshProperties = async () => {
//     setRefreshing(true);
//     await fetchProperties();
//     setRefreshing(false);
//     showToast("Properties refreshed successfully!", "success");
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   // Filter and sort properties
//   useEffect(() => {
//     let filtered = [...properties];

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(property =>
//         property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         property.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(property => 
//         property.status?.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }

//     // Type filter
//     if (typeFilter !== "all") {
//       filtered = filtered.filter(property => 
//         property.propertyType?.toLowerCase() === typeFilter.toLowerCase()
//       );
//     }

//     // Sorting
//     switch (sortBy) {
//       case "newest":
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       case "oldest":
//         filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;
//       case "price-high":
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case "price-low":
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case "name-asc":
//         filtered.sort((a, b) => a.title?.localeCompare(b.title));
//         break;
//       default:
//         break;
//     }

//     setFilteredProperties(filtered);
//   }, [searchTerm, statusFilter, typeFilter, sortBy, properties]);

//   const handleStatusChange = async (propertyId, newStatus) => {
//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         alert("Admin token missing.");
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/updateStatus/${propertyId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update status.");
//       }

//       setProperties((prev) =>
//         prev.map((p) =>
//           p.id === propertyId ? { ...p, status: newStatus } : p
//         )
//       );

//       showToast("Property status updated successfully!", "success");
//     } catch (err) {
//       showToast(err.message || "Something went wrong.", "error");
//     }
//   };

//   const handleEditProperty = (propertyId) => {
//     router.push(`/admin/addProperty/${propertyId}`);
//   };

//   const handleDeleteProperty = async (propertyId) => {
//     if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;

//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         alert("Admin token missing.");
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/deleteProperty/${propertyId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete property.");
//       }

//       setProperties((prev) => prev.filter((p) => p.id !== propertyId));
//       showToast("Property deleted successfully!", "success");
//     } catch (err) {
//       showToast(err.message || "Something went wrong.", "error");
//     }
//   };

//   const handleAddProperty = () => {
//     router.push("/admin/addProperty");
//   };

//   const handleBulkDelete = async () => {
//     if (selectedProperties.length === 0) return;
//     if (!confirm(`Delete ${selectedProperties.length} selected properties?`)) return;

//     for (const id of selectedProperties) {
//       await handleDeleteProperty(id);
//     }
//     setSelectedProperties([]);
//   };

//   const handleExport = () => {
//     try {
//       // Prepare data for export
//       const exportData = filteredProperties.map(property => ({
//         ID: property.id,
//         Title: property.title,
//         Description: property.description,
//         Price: property.price,
//         'Price Formatted': formatPrice(property.price),
//         'Property Type': property.propertyType,
//         'Property For': property.propertyFor,
//         Status: property.status,
//         Bedrooms: property.bedrooms,
//         Bathrooms: property.bathrooms,
//         Area: `${property.area} sq.ft`,
//         Address: property.address,
//         City: property.city,
//         State: property.state,
//         Pincode: property.pincode,
//         'Owner Name': property.ownerName,
//         'Owner Phone': property.ownerPhone,
//         'Owner Email': property.ownerEmail,
//         'Created At': new Date(property.createdAt).toLocaleDateString(),
//       }));

//       // Create CSV content
//       const headers = Object.keys(exportData[0] || {});
//       const csvRows = [
//         headers.join(','),
//         ...exportData.map(row => 
//           headers.map(header => {
//             const value = row[header];
//             // Handle values that contain commas
//             if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
//               return `"${value.replace(/"/g, '""')}"`;
//             }
//             return value;
//           }).join(',')
//         )
//       ];

//       const csvContent = csvRows.join('\n');
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `properties_export_${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
      
//       showToast(`Exported ${exportData.length} properties successfully!`, "success");
//     } catch (err) {
//       showToast("Failed to export properties", "error");
//     }
//   };

//   const handleClearFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setTypeFilter("all");
//     setSortBy("newest");
//     showToast("Filters cleared successfully!", "success");
//   };

//   const formatPrice = (price) => {
//     if (price >= 10000000) {
//       return `₹${(price / 10000000).toFixed(1)}Cr`;
//     } else if (price >= 100000) {
//       return `₹${(price / 100000).toFixed(1)}L`;
//     }
//     return `₹${price.toLocaleString()}`;
//   };

//   const StatCard = ({ title, value, icon: Icon, color }) => (
//     <motion.div 
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500 mb-1">{title}</p>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
//           <Icon className="w-5 h-5 text-white" />
//         </div>
//       </div>
//     </motion.div>
//   );

//   const stats = {
//     total: properties.length,
//     accepted: properties.filter(p => p.status === "ACCEPTED").length,
//     pending: properties.filter(p => p.status === "PENDING").length,
//     rejected: properties.filter(p => p.status === "REJECT" || p.status === "REJECTED").length,
//   };

//   if (loading) {
//     return (
//       <AdminSidebar>
//         <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
//             <p className="text-gray-500">Loading properties...</p>
//           </div>
//         </div>
//       </AdminSidebar>
//     );
//   }

//   return (
//     <AdminSidebar>
//       <div className="p-4 md:p-8">
//         {/* Toast Notification */}
//         <AnimatePresence>
//           {toastMessage && (
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
//                 toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
//               } text-white`}
//             >
//               {toastMessage.type === "success" ? (
//                 <CheckCircle className="h-5 w-5" />
//               ) : (
//                 <AlertCircle className="h-5 w-5" />
//               )}
//               {toastMessage.message}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                 Manage Properties
//               </h1>
//               <p className="text-gray-500 mt-1">
//                 View, edit, and manage all property listings
//               </p>
//             </div>
//             <Button 
//               onClick={handleAddProperty}
//               className="bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add New Property
//             </Button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard title="Total Properties" value={stats.total} icon={Building} color="from-blue-500 to-cyan-500" />
//           <StatCard title="Accepted" value={stats.accepted} icon={CheckCircle} color="from-green-500 to-emerald-500" />
//           <StatCard title="Pending" value={stats.pending} icon={Clock} color="from-yellow-500 to-orange-500" />
//           <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="from-red-500 to-pink-500" />
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-xl shadow-sm border mb-6">
//           <div className="p-4 border-b">
//             <div className="flex flex-col lg:flex-row gap-4">
//               {/* Search */}
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by title, description, address or owner..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
              
//               {/* Filter Toggle Button */}
//               <Button 
//                 variant="outline" 
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="gap-2"
//               >
//                 <Filter className="h-4 w-4" />
//                 Filters
//                 {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//               </Button>
              
//               {/* Refresh Button */}
//               <Button 
//                 variant="outline" 
//                 onClick={refreshProperties} 
//                 className="gap-2"
//                 disabled={refreshing}
//               >
//                 <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//                 {refreshing ? "Refreshing..." : "Refresh"}
//               </Button>
              
//               {/* Export Button */}
//               <Button 
//                 variant="outline" 
//                 onClick={handleExport}
//                 className="gap-2"
//                 disabled={filteredProperties.length === 0}
//               >
//                 <Download className="h-4 w-4" />
//                 Export CSV
//               </Button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="p-4 border-t bg-gray-50">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
//                       <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                       >
//                         <option value="all">All Status</option>
//                         <option value="accepted">Accepted</option>
//                         <option value="pending">Pending</option>
//                         <option value="reject">Rejected</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
//                       <select
//                         value={typeFilter}
//                         onChange={(e) => setTypeFilter(e.target.value)}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                       >
//                         <option value="all">All Types</option>
//                         <option value="apartment">Apartment</option>
//                         <option value="villa">Villa</option>
//                         <option value="house">House</option>
//                         <option value="plot">Plot</option>
//                         <option value="commercial">Commercial</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                       >
//                         <option value="newest">Newest First</option>
//                         <option value="oldest">Oldest First</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="name-asc">Name: A to Z</option>
//                       </select>
//                     </div>

//                     <div className="flex items-end">
//                       <Button 
//                         variant="outline" 
//                         onClick={handleClearFilters}
//                         className="w-full"
//                       >
//                         Clear All Filters
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Bulk Actions */}
//         <AnimatePresence>
//           {selectedProperties.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between"
//             >
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-5 w-5 text-blue-600" />
//                 <span className="text-sm text-blue-700">
//                   {selectedProperties.length} property(ies) selected
//                 </span>
//               </div>
//               <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete Selected
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Properties Table */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           {error ? (
//             <div className="p-8 text-center">
//               <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
//               <p className="text-red-500">{error}</p>
//               <Button onClick={refreshProperties} className="mt-4">Try Again</Button>
//             </div>
//           ) : filteredProperties.length === 0 ? (
//             <div className="p-8 text-center">
//               <Home className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500">No properties found matching your criteria</p>
//               <Button variant="outline" onClick={handleClearFilters} className="mt-4">
//                 Clear Filters
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left">
//                       <input
//                         type="checkbox"
//                         checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedProperties(filteredProperties.map(p => p.id));
//                           } else {
//                             setSelectedProperties([]);
//                           }
//                         }}
//                         className="rounded border-gray-300"
//                       />
//                     </th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Title</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Price</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Type</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Owner</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {filteredProperties.map((property, index) => (
//                     <motion.tr
//                       key={property.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.03 }}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedProperties.includes(property.id)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedProperties([...selectedProperties, property.id]);
//                             } else {
//                               setSelectedProperties(selectedProperties.filter(id => id !== property.id));
//                             }
//                           }}
//                           className="rounded border-gray-300"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <div>
//                           <p className="font-medium text-gray-900">{property.title}</p>
//                           <p className="text-xs text-gray-500 mt-1 line-clamp-1">{property.address}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 font-semibold text-gray-900 hidden lg:table-cell">
//                         {formatPrice(property.price)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <Badge variant="outline" className="bg-gray-100">
//                           {property.propertyType}
//                         </Badge>
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={property.status}
//                           onChange={(e) => handleStatusChange(property.id, e.target.value)}
//                           className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary cursor-pointer ${
//                             property.status === "ACCEPTED"
//                               ? "bg-green-100 text-green-700"
//                               : property.status === "PENDING"
//                               ? "bg-yellow-100 text-yellow-700"
//                               : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           <option value="PENDING">Pending</option>
//                           <option value="ACCEPTED">Accepted</option>
//                           <option value="REJECT">Rejected</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 hidden md:table-cell">
//                         <div className="flex items-center gap-2">
//                           <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
//                             <User className="h-3 w-3 text-primary" />
//                           </div>
//                           <span className="text-sm text-gray-600">{property.ownerName}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleEditProperty(property.id)}
//                             className="gap-1"
//                           >
//                             <Edit2 className="h-3 w-3" />
//                             <span className="hidden sm:inline">Edit</span>
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => handleDeleteProperty(property.id)}
//                             className="gap-1"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                             <span className="hidden sm:inline">Delete</span>
//                           </Button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
          
//           {/* Footer with pagination info */}
//           <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <p className="text-sm text-gray-500">
//               Showing {filteredProperties.length} of {properties.length} properties
//             </p>
//             {filteredProperties.length > 0 && (
//               <p className="text-sm text-green-600">
//                 <CheckCircle className="h-3 w-3 inline mr-1" />
//                 {stats.accepted} accepted, {stats.pending} pending
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </AdminSidebar>
//   );
// }





// "use client";

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { BASE_URL } from "@/app/baseurl";
// import {
//   Building,
//   Plus,
//   Edit2,
//   Trash2,
//   Eye,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Download,
//   Home,
//   User,
//   Link2,
//   Share2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import AdminSidebar from "@/components/admin-sidebar";

// const CACHE_KEY = "admin_properties_cache_v1";
// const PAGE_SIZE = 20;
// const SEARCH_DEBOUNCE_MS = 250;

// function formatPrice(price) {
//   if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
//   if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
//   return `₹${price.toLocaleString()}`;
// }

// function StatCard({ title, value, icon: Icon, color }) {
//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500 mb-1">{title}</p>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
//           <Icon className="w-5 h-5 text-white" />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* One table row, memoized so a status change on one property (or a re-render
//    from typing in the search box) doesn't re-render every other row. Without
//    this, a table of a few hundred properties re-renders the whole table on
//    every keystroke, which is the main thing that made this page feel slow. */
// const PropertyRow = React.memo(function PropertyRow({
//   property, selected, onToggleSelect, onView, onEdit, onCopyLink, onDelete, onStatusChange,
// }) {
//   return (
//     <tr className="hover:bg-gray-50 transition-colors">
//       <td className="px-6 py-4">
//         <input
//           type="checkbox"
//           checked={selected}
//           onChange={(e) => onToggleSelect(property.id, e.target.checked)}
//           className="rounded border-gray-300"
//         />
//       </td>
//       <td className="px-6 py-4">
//         <div>
//           <p className="font-medium text-gray-900">{property.title}</p>
//           <p className="text-xs text-gray-500 mt-1 line-clamp-1">{property.address}</p>
//         </div>
//       </td>
//       <td className="px-6 py-4 font-semibold text-gray-900 hidden lg:table-cell">
//         {formatPrice(property.price)}
//       </td>
//       <td className="px-6 py-4">
//         <Badge variant="outline" className="bg-gray-100">{property.propertyType}</Badge>
//       </td>
//       <td className="px-6 py-4">
//         <select
//           value={property.status}
//           onChange={(e) => onStatusChange(property.id, e.target.value)}
//           className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary cursor-pointer ${
//             property.status === "ACCEPTED"
//               ? "bg-green-100 text-green-700"
//               : property.status === "PENDING"
//               ? "bg-yellow-100 text-yellow-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           <option value="PENDING">Pending</option>
//           <option value="ACCEPTED">Accepted</option>
//           <option value="REJECT">Rejected</option>
//         </select>
//       </td>
//       <td className="px-6 py-4 hidden md:table-cell">
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
//             <User className="h-3 w-3 text-primary" />
//           </div>
//           <span className="text-sm text-gray-600">{property.ownerName}</span>
//         </div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" onClick={() => onView(property.id)} className="gap-1" title="View full property details">
//             <Eye className="h-3 w-3" />
//             <span className="hidden sm:inline">View</span>
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => onEdit(property.id)} className="gap-1">
//             <Edit2 className="h-3 w-3" />
//             <span className="hidden sm:inline">Edit</span>
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => onCopyLink(property.id)} className="gap-1" title="Copy a shareable, no-login edit link">
//             <Link2 className="h-3 w-3" />
//             <span className="hidden sm:inline">Copy Link</span>
//           </Button>
//           <Button variant="destructive" size="sm" onClick={() => onDelete(property.id)} className="gap-1">
//             <Trash2 className="h-3 w-3" />
//             <span className="hidden sm:inline">Delete</span>
//           </Button>
//         </div>
//       </td>
//     </tr>
//   );
// });

// export default function AdminPropertiesPage() {
//   const router = useRouter();
//   const [properties, setProperties] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const [searchInput, setSearchInput] = useState(""); // raw, every keystroke
//   const [searchTerm, setSearchTerm] = useState("");    // debounced, used for filtering
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedProperties, setSelectedProperties] = useState([]);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

//   const showToast = useCallback((message, type) => {
//     setToastMessage({ message, type });
//     setTimeout(() => setToastMessage(null), 3000);
//   }, []);

//   // Debounce search so typing doesn't re-filter the whole list on every key.
//   useEffect(() => {
//     const handle = setTimeout(() => setSearchTerm(searchInput), SEARCH_DEBOUNCE_MS);
//     return () => clearTimeout(handle);
//   }, [searchInput]);

//   const fetchProperties = useCallback(async (signal) => {
//     const token = localStorage.getItem("admintoken");
//     if (!token) {
//       alert("You need to log in as an admin to view properties.");
//       router.push("/Login");
//       return;
//     }
//     const response = await fetch(`${BASE_URL}/properties`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//       signal,
//     });
//     if (!response.ok) throw new Error("Failed to fetch properties.");
//     return response.json();
//   }, [router]);

//   // Stale-while-revalidate: paint instantly from the last-seen list (if any),
//   // then refresh from the network in the background. This is what makes the
//   // page feel instant on repeat visits instead of showing a spinner every time.
//   useEffect(() => {
//     const controller = new AbortController();
//     let hadCache = false;

//     try {
//       const cached = localStorage.getItem(CACHE_KEY);
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         if (Array.isArray(parsed)) {
//           setProperties(parsed);
//           setLoading(false);
//           hadCache = true;
//         }
//       }
//     } catch {
//       // Corrupted cache — ignore, fall through to network fetch.
//     }

//     fetchProperties(controller.signal)
//       .then((data) => {
//         if (!data) return;
//         setProperties(data);
//         try {
//           localStorage.setItem(CACHE_KEY, JSON.stringify(data));
//         } catch {
//           // Storage full/disabled — non-fatal, just skip caching.
//         }
//       })
//       .catch((err) => {
//         if (err.name !== "AbortError" && !hadCache) {
//           setError(err.message || "Something went wrong.");
//           showToast(err.message || "Failed to fetch properties", "error");
//         }
//       })
//       .finally(() => {
//         if (!controller.signal.aborted) setLoading(false);
//       });

//     return () => controller.abort();
//   }, [fetchProperties, showToast]);

//   const refreshProperties = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       const data = await fetchProperties();
//       if (data) {
//         setProperties(data);
//         try {
//           localStorage.setItem(CACHE_KEY, JSON.stringify(data));
//         } catch {}
//         setError("");
//         showToast("Properties refreshed successfully!", "success");
//       }
//     } catch (err) {
//       showToast(err.message || "Failed to refresh properties", "error");
//     } finally {
//       setRefreshing(false);
//     }
//   }, [fetchProperties, showToast]);

//   // Filtering/sorting is derived state — compute it with useMemo instead of a
//   // second piece of state kept in sync via useEffect. That was causing an
//   // extra render on every properties/filter change; useMemo only recomputes
//   // when an actual dependency changes and skips the redundant render.
//   const filteredProperties = useMemo(() => {
//     const term = searchTerm.toLowerCase();
//     let filtered = properties.filter((property) => {
//       if (
//         term &&
//         !property.title?.toLowerCase().includes(term) &&
//         !property.description?.toLowerCase().includes(term) &&
//         !property.address?.toLowerCase().includes(term) &&
//         !property.ownerName?.toLowerCase().includes(term)
//       )
//         return false;
//       if (statusFilter !== "all" && property.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
//       if (typeFilter !== "all" && property.propertyType?.toLowerCase() !== typeFilter.toLowerCase()) return false;
//       return true;
//     });

//     filtered = [...filtered];
//     switch (sortBy) {
//       case "newest":
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       case "oldest":
//         filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;
//       case "price-high":
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case "price-low":
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case "name-asc":
//         filtered.sort((a, b) => a.title?.localeCompare(b.title));
//         break;
//     }
//     return filtered;
//   }, [properties, searchTerm, statusFilter, typeFilter, sortBy]);

//   // Reset pagination whenever the active filter/sort set changes.
//   useEffect(() => {
//     setVisibleCount(PAGE_SIZE);
//   }, [searchTerm, statusFilter, typeFilter, sortBy]);

//   // Only render a page's worth of rows at a time — a table with hundreds of
//   // properties (each with a <select>, four buttons, and a checkbox) is the
//   // biggest single cost on this page. Rendering 20 instead of "all" is what
//   // actually fixes the slow initial paint.
//   const visibleProperties = useMemo(
//     () => filteredProperties.slice(0, visibleCount),
//     [filteredProperties, visibleCount]
//   );

//   const handleStatusChange = useCallback(async (propertyId, newStatus) => {
//     // Optimistic update — flip the UI immediately, roll back only if the
//     // request actually fails, instead of waiting on the network round trip.
//     setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p)));
//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         showToast("Admin token missing.", "error");
//         return;
//       }
//       const response = await fetch(`${BASE_URL}/updateStatus/${propertyId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.message || "Failed to update status.");
//       }
//       showToast("Property status updated successfully!", "success");
//     } catch (err) {
//       // Roll back — we don't know the prior status per-row here, so just
//       // re-sync from the server rather than guessing.
//       refreshProperties();
//       showToast(err.message || "Something went wrong.", "error");
//     }
//   }, [showToast, refreshProperties]);

//   const handleViewProperty = useCallback((propertyId) => router.push(`/admin/Properties/${propertyId}`), [router]);
//   const handleEditProperty = useCallback((propertyId) => router.push(`/admin/addProperty/${propertyId}`), [router]);

//   const handleDeleteProperty = useCallback(async (propertyId) => {
//     if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         showToast("Admin token missing.", "error");
//         return;
//       }
//       const response = await fetch(`${BASE_URL}/deleteProperty/${propertyId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.message || "Failed to delete property.");
//       }
//       setProperties((prev) => prev.filter((p) => p.id !== propertyId));
//       showToast("Property deleted successfully!", "success");
//     } catch (err) {
//       showToast(err.message || "Something went wrong.", "error");
//     }
//   }, [showToast]);

//   const handleAddProperty = useCallback(() => router.push("/admin/addProperty"), [router]);

//   const handleBulkDelete = useCallback(async () => {
//     if (selectedProperties.length === 0) return;
//     if (!confirm(`Delete ${selectedProperties.length} selected properties?`)) return;
//     for (const id of selectedProperties) {
//       await handleDeleteProperty(id);
//     }
//     setSelectedProperties([]);
//   }, [selectedProperties, handleDeleteProperty]);

//   const handleCopyShareLink = useCallback(async (propertyId) => {
//     const origin = typeof window !== "undefined" ? window.location.origin : "";
//     const link = `${origin}/edit-property/${propertyId}`;
//     try {
//       await navigator.clipboard.writeText(link);
//       showToast("Edit link copied to clipboard!", "success");
//     } catch {
//       window.prompt("Copy this edit link:", link);
//     }
//   }, [showToast]);

//   const handleCopyAddPropertyLink = useCallback(async () => {
//     const origin = typeof window !== "undefined" ? window.location.origin : "";
//     const link = `${origin}/open-addproperty`;
//     try {
//       await navigator.clipboard.writeText(link);
//       showToast("Add-property link copied to clipboard!", "success");
//     } catch {
//       window.prompt("Copy this add-property link:", link);
//     }
//   }, [showToast]);

//   const handleExport = useCallback(() => {
//     try {
//       const exportData = filteredProperties.map((property) => ({
//         ID: property.id,
//         Title: property.title,
//         Description: property.description,
//         Price: property.price,
//         "Price Formatted": formatPrice(property.price),
//         "Property Type": property.propertyType,
//         "Property For": property.propertyFor,
//         Status: property.status,
//         Bedrooms: property.bedrooms,
//         Bathrooms: property.bathrooms,
//         Area: `${property.area} sq.ft`,
//         Address: property.address,
//         City: property.city,
//         State: property.state,
//         Pincode: property.pincode,
//         "Owner Name": property.ownerName,
//         "Owner Phone": property.ownerPhone,
//         "Owner Email": property.ownerEmail,
//         "Created At": property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "",
//       }));

//       const headers = Object.keys(exportData[0] || {});
//       const csvRows = [
//         headers.join(","),
//         ...exportData.map((row) =>
//           headers
//             .map((header) => {
//               const value = row[header];
//               if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
//                 return `"${value.replace(/"/g, '""')}"`;
//               }
//               return value;
//             })
//             .join(",")
//         ),
//       ];

//       const csvContent = csvRows.join("\n");
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", `properties_export_${new Date().toISOString().split("T")[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       showToast(`Exported ${exportData.length} properties successfully!`, "success");
//     } catch {
//       showToast("Failed to export properties", "error");
//     }
//   }, [filteredProperties, showToast]);

//   const handleClearFilters = useCallback(() => {
//     setSearchInput("");
//     setSearchTerm("");
//     setStatusFilter("all");
//     setTypeFilter("all");
//     setSortBy("newest");
//     showToast("Filters cleared successfully!", "success");
//   }, [showToast]);

//   const handleToggleSelect = useCallback((id, checked) => {
//     setSelectedProperties((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
//   }, []);

//   const stats = useMemo(
//     () => ({
//       total: properties.length,
//       accepted: properties.filter((p) => p.status === "ACCEPTED").length,
//       pending: properties.filter((p) => p.status === "PENDING").length,
//       rejected: properties.filter((p) => p.status === "REJECT" || p.status === "REJECTED").length,
//     }),
//     [properties]
//   );

//   if (loading) {
//     return (
//       <AdminSidebar>
//         <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
//             <p className="text-gray-500">Loading properties...</p>
//           </div>
//         </div>
//       </AdminSidebar>
//     );
//   }

//   return (
//     <AdminSidebar>
//       <div className="p-4 md:p-8">
//         {/* Toast Notification */}
//         <AnimatePresence>
//           {toastMessage && (
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
//                 toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
//               } text-white`}
//             >
//               {toastMessage.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
//               {toastMessage.message}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                 Manage Properties
//               </h1>
//               <p className="text-gray-500 mt-1">View, edit, and manage all property listings</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" onClick={handleCopyAddPropertyLink} className="gap-2" title="Copy a shareable, no-login link to add a new property">
//                 <Share2 className="h-4 w-4" />
//                 Share Add-Property Link
//               </Button>
//               <Button onClick={handleAddProperty} className="bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add New Property
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard title="Total Properties" value={stats.total} icon={Building} color="from-blue-500 to-cyan-500" />
//           <StatCard title="Accepted" value={stats.accepted} icon={CheckCircle} color="from-green-500 to-emerald-500" />
//           <StatCard title="Pending" value={stats.pending} icon={Clock} color="from-yellow-500 to-orange-500" />
//           <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="from-red-500 to-pink-500" />
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-xl shadow-sm border mb-6">
//           <div className="p-4 border-b">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by title, description, address or owner..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>

//               <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
//                 <Filter className="h-4 w-4" />
//                 Filters
//                 {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//               </Button>

//               <Button variant="outline" onClick={refreshProperties} className="gap-2" disabled={refreshing}>
//                 <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//                 {refreshing ? "Refreshing..." : "Refresh"}
//               </Button>

//               <Button variant="outline" onClick={handleExport} className="gap-2" disabled={filteredProperties.length === 0}>
//                 <Download className="h-4 w-4" />
//                 Export CSV
//               </Button>
//             </div>
//           </div>

//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="p-4 border-t bg-gray-50">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
//                       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
//                         <option value="all">All Status</option>
//                         <option value="accepted">Accepted</option>
//                         <option value="pending">Pending</option>
//                         <option value="reject">Rejected</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
//                       <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
//                         <option value="all">All Types</option>
//                         <option value="apartment">Apartment</option>
//                         <option value="villa">Villa</option>
//                         <option value="house">House</option>
//                         <option value="plot">Plot</option>
//                         <option value="commercial">Commercial</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
//                       <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
//                         <option value="newest">Newest First</option>
//                         <option value="oldest">Oldest First</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="name-asc">Name: A to Z</option>
//                       </select>
//                     </div>

//                     <div className="flex items-end">
//                       <Button variant="outline" onClick={handleClearFilters} className="w-full">
//                         Clear All Filters
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Bulk Actions */}
//         <AnimatePresence>
//           {selectedProperties.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between"
//             >
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-5 w-5 text-blue-600" />
//                 <span className="text-sm text-blue-700">{selectedProperties.length} property(ies) selected</span>
//               </div>
//               <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete Selected
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Properties Table */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           {error ? (
//             <div className="p-8 text-center">
//               <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
//               <p className="text-red-500">{error}</p>
//               <Button onClick={refreshProperties} className="mt-4">Try Again</Button>
//             </div>
//           ) : filteredProperties.length === 0 ? (
//             <div className="p-8 text-center">
//               <Home className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500">No properties found matching your criteria</p>
//               <Button variant="outline" onClick={handleClearFilters} className="mt-4">Clear Filters</Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left">
//                       <input
//                         type="checkbox"
//                         checked={selectedProperties.length === visibleProperties.length && visibleProperties.length > 0}
//                         onChange={(e) => {
//                           setSelectedProperties(e.target.checked ? visibleProperties.map((p) => p.id) : []);
//                         }}
//                         className="rounded border-gray-300"
//                       />
//                     </th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Title</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Price</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Type</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Owner</th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {visibleProperties.map((property) => (
//                     <PropertyRow
//                       key={property.id}
//                       property={property}
//                       selected={selectedProperties.includes(property.id)}
//                       onToggleSelect={handleToggleSelect}
//                       onView={handleViewProperty}
//                       onEdit={handleEditProperty}
//                       onCopyLink={handleCopyShareLink}
//                       onDelete={handleDeleteProperty}
//                       onStatusChange={handleStatusChange}
//                     />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Footer with pagination */}
//           <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <p className="text-sm text-gray-500">
//               Showing {visibleProperties.length} of {filteredProperties.length} properties
//               {filteredProperties.length !== properties.length && ` (filtered from ${properties.length})`}
//             </p>
//             <div className="flex items-center gap-4">
//               {filteredProperties.length > 0 && (
//                 <p className="text-sm text-green-600">
//                   <CheckCircle className="h-3 w-3 inline mr-1" />
//                   {stats.accepted} accepted, {stats.pending} pending
//                 </p>
//               )}
//               {filteredProperties.length > visibleCount && (
//                 <Button variant="outline" size="sm" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
//                   Load {Math.min(PAGE_SIZE, filteredProperties.length - visibleCount)} More
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </AdminSidebar>
//   );
// }








"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { BASE_URL } from "@/app/baseurl";
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Home,
  User,
  Link2,
  Share2,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/admin-sidebar";

const CACHE_KEY = "admin_properties_cache_v2";
const SEARCH_DEBOUNCE_MS = 250;
const PAGE_SIZE = 2000;

/* ------------------------------------------------------------------
   LINKS — two different things, kept deliberately separate:
   • editPropertyLink  -> private, no-login edit form  ("Copy Link" button)
   • publicPropertyLink-> public listing page          ("Share" button)
   Adjust the public path if your route differs.
   ------------------------------------------------------------------ */
const origin = () => (typeof window !== "undefined" ? window.location.origin : "");
const editPropertyLink = (id) => `${origin()}/edit-property/${id}`;
const publicPropertyLink = (id) => `${origin()}/properties/${id}`;
const addPropertyLink = () => `${origin()}/open-addproperty`;

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function formatPrice(price) {
  const n = Number(price);
  if (!isFinite(n)) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
}

/* Message used when sharing a property on WhatsApp. */
function buildShareText(property) {
  return [
    `*${property.title || "Property"}*`,
    property.price ? `Price: ${formatPrice(property.price)}` : null,
    [property.address, property.city].filter(Boolean).join(", ") || null,
    "",
    publicPropertyLink(property.id),
  ]
    .filter((l) => l !== null)
    .join("\n");
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    window.prompt("Copy this:", text);
    return false;
  }
}

function openWhatsApp(text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

/* ------------------------------------------------------------------
   ShareMenu — two choices only: WhatsApp or copy the public link.
   Rendered into document.body via a portal because the table sits in an
   overflow-x-auto wrapper that would otherwise clip it.
   ------------------------------------------------------------------ */
function ShareMenu({ onWhatsApp, onCopyLink, label = "Share", size = "sm" }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const toggle = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const MENU_W = 210;
    setCoords({
      top: r.bottom + 6,
      left: Math.max(8, Math.min(r.left, window.innerWidth - MENU_W - 8)),
    });
    setOpen((o) => !o);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = (fn) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <Button ref={btnRef} variant="outline" size={size} onClick={toggle} className="gap-1" title="Share this property">
        <Share2 className="h-3 w-3" />
        <span className="hidden sm:inline">{label}</span>
      </Button>

      {mounted && open
        ? createPortal(
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: "fixed", top: coords.top, left: coords.left, width: 210, zIndex: 60 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden py-1"
            >
              <button
                onClick={() => run(onWhatsApp)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-green-600 shrink-0" />
                WhatsApp
              </button>
              <button
                onClick={() => run(onCopyLink)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                Copy public link
              </button>
            </motion.div>,
            document.body
          )
        : null}
    </>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function PropertyThumbnail({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Home className="w-5 h-5 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

const PropertyRow = React.memo(function PropertyRow({
  property, selected, onToggleSelect, onView, onEdit, onCopyLink, onDelete, onStatusChange,
  onShareWhatsApp, onShareCopyLink,
}) {
  const thumbSrc =
    (Array.isArray(property.images) ? property.images[0] : null) ||
    property.image ||
    property.thumbnail ||
    property.photo ||
    null;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onToggleSelect(property.id, e.target.checked)}
          className="rounded border-gray-300"
        />
      </td>
      <td className="px-4 py-4">
        <PropertyThumbnail src={thumbSrc} alt={property.title} />
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{property.title}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{property.address}</p>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900 hidden lg:table-cell">
        {formatPrice(property.price)}
      </td>
      <td className="px-6 py-4">
        <Badge variant="outline" className="bg-gray-100">{property.propertyType}</Badge>
      </td>
      <td className="px-6 py-4">
        <select
          value={property.status}
          onChange={(e) => onStatusChange(property.id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary cursor-pointer ${
            property.status === "ACCEPTED"
              ? "bg-green-100 text-green-700"
              : property.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECT">Rejected</option>
        </select>
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm text-gray-600">{property.ownerName}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(property.id)} className="gap-1" title="View full property details">
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => onEdit(property.id)} className="gap-1">
            <Edit2 className="h-3 w-3" />
            <span className="hidden sm:inline">Edit</span>
          </Button>

          {/* Edit link — unchanged, single-purpose button, no menu */}
          <Button variant="outline" size="sm" onClick={() => onCopyLink(property.id)} className="gap-1" title="Copy a shareable, no-login edit link">
            <Link2 className="h-3 w-3" />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>

          {/* Share the public listing — separate from the edit link above */}
          <ShareMenu
            onWhatsApp={() => onShareWhatsApp(property)}
            onCopyLink={() => onShareCopyLink(property)}
          />

          <Button variant="destructive" size="sm" onClick={() => onDelete(property.id)} className="gap-1">
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
});

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => setSearchTerm(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const fetchProperties = useCallback(async (signal) => {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      router.push("/Login");
      return null;
    }

    const response = await fetch(`${BASE_URL}/properties?page=0&size=${PAGE_SIZE}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("admintoken");
      router.push("/Login");
      return null;
    }
    if (!response.ok) throw new Error(`Failed to fetch properties (${response.status}).`);

    const payload = await response.json();
    return toArray(payload);
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    let hadCache = false;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const list = toArray(JSON.parse(cached));
        if (list.length > 0) {
          setProperties(list);
          setLoading(false);
          hadCache = true;
        }
      }
    } catch {
      // Corrupted cache — ignore.
    }

    fetchProperties(controller.signal)
      .then((list) => {
        if (!list) return;
        setProperties(list);
        setError("");
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {}
      })
      .catch((err) => {
        if (err.name !== "AbortError" && !hadCache) {
          setError(err.message || "Something went wrong.");
          showToast(err.message || "Failed to fetch properties", "error");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [fetchProperties, showToast]);

  const refreshProperties = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await fetchProperties();
      if (list) {
        setProperties(list);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {}
        setError("");
        showToast("Properties refreshed successfully!", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to refresh properties", "error");
    } finally {
      setRefreshing(false);
    }
  }, [fetchProperties, showToast]);

  const filteredProperties = useMemo(() => {
    const source = Array.isArray(properties) ? properties : [];
    const term = searchTerm.toLowerCase();

    let filtered = source.filter((property) => {
      if (!property) return false;
      if (
        term &&
        !property.title?.toLowerCase().includes(term) &&
        !property.description?.toLowerCase().includes(term) &&
        !property.address?.toLowerCase().includes(term) &&
        !property.ownerName?.toLowerCase().includes(term)
      )
        return false;
      if (statusFilter !== "all" && property.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (typeFilter !== "all" && property.propertyType?.toLowerCase() !== typeFilter.toLowerCase()) return false;
      return true;
    });

    filtered = [...filtered];
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default:
        break;
    }
    return filtered;
  }, [properties, searchTerm, statusFilter, typeFilter, sortBy]);

  /* ------- Edit link (private, no-login form) — its own action ------- */
  const handleCopyEditLink = useCallback(async (propertyId) => {
    if (await copyToClipboard(editPropertyLink(propertyId))) {
      showToast("Edit link copied to clipboard!", "success");
    }
  }, [showToast]);

  const handleCopyAddPropertyLink = useCallback(async () => {
    if (await copyToClipboard(addPropertyLink())) {
      showToast("Add-property link copied to clipboard!", "success");
    }
  }, [showToast]);

  /* ------- Share property (public listing) — its own action ------- */
  const handleShareWhatsApp = useCallback((property) => {
    openWhatsApp(buildShareText(property));
  }, []);

  const handleShareCopyLink = useCallback(async (property) => {
    if (await copyToClipboard(publicPropertyLink(property.id))) {
      showToast("Property link copied!", "success");
    }
  }, [showToast]);

  const handleStatusChange = useCallback(async (propertyId, newStatus) => {
    setProperties((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
    );
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        showToast("Admin token missing.", "error");
        return;
      }
      const response = await fetch(`${BASE_URL}/updateStatus/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update status.");
      }
      showToast("Property status updated successfully!", "success");
    } catch (err) {
      refreshProperties();
      showToast(err.message || "Something went wrong.", "error");
    }
  }, [showToast, refreshProperties]);

  const handleViewProperty = useCallback((propertyId) => router.push(`/admin/Properties/${propertyId}`), [router]);
  const handleEditProperty = useCallback((propertyId) => router.push(`/admin/addProperty/${propertyId}`), [router]);

  const handleDeleteProperty = useCallback(async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        showToast("Admin token missing.", "error");
        return;
      }
      const response = await fetch(`${BASE_URL}/deleteProperty/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete property.");
      }
      setProperties((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== propertyId));
      showToast("Property deleted successfully!", "success");
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    }
  }, [showToast]);

  const handleAddProperty = useCallback(() => router.push("/admin/addProperty"), [router]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedProperties.length === 0) return;
    if (!confirm(`Delete ${selectedProperties.length} selected properties?`)) return;
    for (const id of selectedProperties) {
      await handleDeleteProperty(id);
    }
    setSelectedProperties([]);
  }, [selectedProperties, handleDeleteProperty]);

  const handleExport = useCallback(() => {
    try {
      if (filteredProperties.length === 0) {
        showToast("Nothing to export", "error");
        return;
      }

      const exportData = filteredProperties.map((property) => ({
        ID: property.id,
        Title: property.title,
        Description: property.description,
        Price: property.price,
        "Price Formatted": formatPrice(property.price),
        "Property Type": property.propertyType,
        "Property For": property.propertyFor,
        Status: property.status,
        Bedrooms: property.bedrooms,
        Bathrooms: property.bathrooms,
        Area: `${property.area} sq.ft`,
        Address: property.address,
        City: property.city,
        State: property.state,
        Pincode: property.pincode,
        "Owner Name": property.ownerName,
        "Owner Phone": property.ownerPhone,
        "Owner Email": property.ownerEmail,
        "Created At": property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "",
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              if (value === null || value === undefined) return "";
              const str = String(value);
              if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(",")
        ),
      ];

      const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `properties_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported ${exportData.length} properties successfully!`, "success");
    } catch {
      showToast("Failed to export properties", "error");
    }
  }, [filteredProperties, showToast]);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
    showToast("Filters cleared successfully!", "success");
  }, [showToast]);

  const handleToggleSelect = useCallback((id, checked) => {
    setSelectedProperties((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }, []);

  const allFilteredSelected =
    filteredProperties.length > 0 && selectedProperties.length === filteredProperties.length;

  const handleToggleSelectAll = useCallback((checked) => {
    setSelectedProperties(checked ? filteredProperties.map((p) => p.id) : []);
  }, [filteredProperties]);

  const stats = useMemo(() => {
    const source = Array.isArray(properties) ? properties : [];
    return {
      total: source.length,
      accepted: source.filter((p) => p?.status === "ACCEPTED").length,
      pending: source.filter((p) => p?.status === "PENDING").length,
      rejected: source.filter((p) => p?.status === "REJECT" || p?.status === "REJECTED").length,
    };
  }, [properties]);

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading properties...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="p-4 md:p-8">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 right-4 z-[70] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {toastMessage.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {toastMessage.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Manage Properties
              </h1>
              <p className="text-gray-500 mt-1">View, edit, and manage all property listings</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCopyAddPropertyLink} className="gap-2" title="Copy a shareable, no-login link to add a new property">
                <Link2 className="h-4 w-4" />
                Share Add-Property Link
              </Button>
              <Button onClick={handleAddProperty} className="bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Properties" value={stats.total} icon={Building} color="from-blue-500 to-cyan-500" />
          <StatCard title="Accepted" value={stats.accepted} icon={CheckCircle} color="from-green-500 to-emerald-500" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="from-yellow-500 to-orange-500" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="from-red-500 to-pink-500" />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description, address or owner..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              <Button variant="outline" onClick={refreshProperties} className="gap-2" disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>

              <Button variant="outline" onClick={handleExport} className="gap-2" disabled={filteredProperties.length === 0}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="all">All Status</option>
                        <option value="accepted">Accepted</option>
                        <option value="pending">Pending</option>
                        <option value="reject">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="all">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="house">House</option>
                        <option value="plot">Plot</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="name-asc">Name: A to Z</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button variant="outline" onClick={handleClearFilters} className="w-full">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">{selectedProperties.length} property(ies) selected</span>
              </div>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Properties Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-500">{error}</p>
              <Button onClick={refreshProperties} className="mt-4">Try Again</Button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-8 text-center">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No properties found matching your criteria</p>
              <Button variant="outline" onClick={handleClearFilters} className="mt-4">Clear Filters</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-600">Photo</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Price</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Owner</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProperties.map((property) => (
                    <PropertyRow
                      key={property.id}
                      property={property}
                      selected={selectedProperties.includes(property.id)}
                      onToggleSelect={handleToggleSelect}
                      onView={handleViewProperty}
                      onEdit={handleEditProperty}
                      onCopyLink={handleCopyEditLink}
                      onDelete={handleDeleteProperty}
                      onStatusChange={handleStatusChange}
                      onShareWhatsApp={handleShareWhatsApp}
                      onShareCopyLink={handleShareCopyLink}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing all {filteredProperties.length} properties
              {filteredProperties.length !== stats.total && ` (filtered from ${stats.total})`}
            </p>
            {filteredProperties.length > 0 && (
              <p className="text-sm text-green-600">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                {stats.accepted} accepted, {stats.pending} pending
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}