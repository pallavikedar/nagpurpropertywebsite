"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/baseurl";
import Link from "next/link";
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
  TrendingUp,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
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
      setFilteredProperties(data);
      return data;
    } catch (err) {
      setError(err.message || "Something went wrong.");
      showToast(err.message || "Failed to fetch properties", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshProperties = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
    showToast("Properties refreshed successfully!", "success");
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter and sort properties
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => 
        property.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(property => 
        property.propertyType?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredProperties(filtered);
  }, [searchTerm, statusFilter, typeFilter, sortBy, properties]);

  const handleStatusChange = async (propertyId, newStatus) => {
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

      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, status: newStatus } : p
        )
      );

      showToast("Property status updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    }
  };

  const handleEditProperty = (propertyId) => {
    router.push(`/admin/addProperty/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;

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

      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      showToast("Property deleted successfully!", "success");
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    }
  };

  const handleAddProperty = () => {
    router.push("/admin/addProperty");
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return;
    if (!confirm(`Delete ${selectedProperties.length} selected properties?`)) return;

    for (const id of selectedProperties) {
      await handleDeleteProperty(id);
    }
    setSelectedProperties([]);
  };

  const handleExport = () => {
    try {
      // Prepare data for export
      const exportData = filteredProperties.map(property => ({
        ID: property.id,
        Title: property.title,
        Description: property.description,
        Price: property.price,
        'Price Formatted': formatPrice(property.price),
        'Property Type': property.propertyType,
        'Property For': property.propertyFor,
        Status: property.status,
        Bedrooms: property.bedrooms,
        Bathrooms: property.bathrooms,
        Area: `${property.area} sq.ft`,
        Address: property.address,
        City: property.city,
        State: property.state,
        Pincode: property.pincode,
        'Owner Name': property.ownerName,
        'Owner Phone': property.ownerPhone,
        'Owner Email': property.ownerEmail,
        'Created At': new Date(property.createdAt).toLocaleDateString(),
      }));

      // Create CSV content
      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that contain commas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `properties_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(`Exported ${exportData.length} properties successfully!`, "success");
    } catch (err) {
      showToast("Failed to export properties", "error");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
    showToast("Filters cleared successfully!", "success");
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const stats = {
    total: properties.length,
    accepted: properties.filter(p => p.status === "ACCEPTED").length,
    pending: properties.filter(p => p.status === "PENDING").length,
    rejected: properties.filter(p => p.status === "REJECT" || p.status === "REJECTED").length,
  };

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
              className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {toastMessage.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
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
              <p className="text-gray-500 mt-1">
                View, edit, and manage all property listings
              </p>
            </div>
            <Button 
              onClick={handleAddProperty}
              className="bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
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
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description, address or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Toggle Button */}
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {/* Refresh Button */}
              <Button 
                variant="outline" 
                onClick={refreshProperties} 
                className="gap-2"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              
              {/* Export Button */}
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="gap-2"
                disabled={filteredProperties.length === 0}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
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
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Status</option>
                        <option value="accepted">Accepted</option>
                        <option value="pending">Pending</option>
                        <option value="reject">Rejected</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
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
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="name-asc">Name: A to Z</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={handleClearFilters}
                        className="w-full"
                      >
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
                <span className="text-sm text-blue-700">
                  {selectedProperties.length} property(ies) selected
                </span>
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
              <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProperties(filteredProperties.map(p => p.id));
                          } else {
                            setSelectedProperties([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Price</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Owner</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProperties.map((property, index) => (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProperties([...selectedProperties, property.id]);
                            } else {
                              setSelectedProperties(selectedProperties.filter(id => id !== property.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
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
                        <Badge variant="outline" className="bg-gray-100">
                          {property.propertyType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property.id, e.target.value)}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property.id)}
                            className="gap-1"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Footer with pagination info */}
          <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {filteredProperties.length} of {properties.length} properties
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