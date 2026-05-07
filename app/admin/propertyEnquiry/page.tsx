"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/baseurl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Users,
  Handshake,
  Eye,
  X,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Tag,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSidebar from "@/components/admin-sidebar";

export default function PropertyEnquiryPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/AllProperty-enquiries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch property enquiries");

        const data = await response.json();
        setEnquiries(data);
        setFilteredEnquiries(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
        showToast(err.message || "Failed to fetch enquiries", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Filter enquiries
  useEffect(() => {
    let filtered = [...enquiries];

    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phone?.includes(searchTerm) ||
        enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEnquiries(filtered);
  }, [searchTerm, enquiries]);

  const handleShowProperty = async (propertyId) => {
    setSelectedProperty(null);
    setError("");
    setLoading(true);

    const token = localStorage.getItem("admintoken");
    if (!token) {
      setError("Authorization token is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/property/${propertyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch property details");

      const data = await response.json();
      setSelectedProperty(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      showToast(err.message || "Failed to fetch property details", "error");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelectedProperty(null);

  const handleExport = () => {
    try {
      const exportData = filteredEnquiries.map(enquiry => ({
        Name: enquiry.fullName,
        Email: enquiry.email,
        Phone: enquiry.phone,
        Message: enquiry.message,
        'Visit Date': enquiry.visitDate,
        'Property ID': enquiry.propertyId,
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
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
      link.setAttribute('download', `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(`Exported ${exportData.length} enquiries successfully!`, "success");
    } catch (err) {
      showToast("Failed to export enquiries", "error");
    }
  };

  const refreshData = async () => {
    setLoading(true);
    const token = localStorage.getItem("admintoken");
    try {
      const response = await fetch(`${BASE_URL}/AllProperty-enquiries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEnquiries(data);
      setFilteredEnquiries(data);
      showToast("Data refreshed successfully!", "success");
    } catch (err) {
      showToast("Failed to refresh data", "error");
    } finally {
      setLoading(false);
    }
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
    total: enquiries.length,
    today: enquiries.filter(e => e.visitDate === new Date().toISOString().split('T')[0]).length,
    thisWeek: enquiries.filter(e => {
      const date = new Date(e.visitDate);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };

  if (loading && enquiries.length === 0) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading enquiries...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                  Property Enquiries
                </h1>
                <p className="text-gray-500 mt-1">
                  View and manage all customer enquiries for properties
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={refreshData}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  className="gap-2"
                  disabled={filteredEnquiries.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard title="Total Enquiries" value={stats.total} icon={MessageSquare} color="from-blue-500 to-cyan-500" />
            <StatCard title="Today's Enquiries" value={stats.today} icon={Calendar} color="from-green-500 to-emerald-500" />
            <StatCard title="This Week" value={stats.thisWeek} icon={Clock} color="from-purple-500 to-pink-500" />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, phone or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-500">{error}</p>
                <Button onClick={refreshData} className="mt-4">Try Again</Button>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No enquiries found</p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">Phone</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Message</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">Visit Date</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEnquiries.map((enquiry, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.fullName}</p>
                            <p className="text-xs text-gray-500 lg:hidden">{enquiry.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                          {enquiry.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{enquiry.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate hidden md:table-cell">
                          {enquiry.message}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(enquiry.visitDate).toLocaleDateString()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            size="sm"
                            onClick={() => handleShowProperty(enquiry.propertyId)}
                            className="gap-1 bg-primary hover:bg-primary/90"
                          >
                            <Eye className="h-3 w-3" />
                            View Property
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing {filteredEnquiries.length} of {enquiries.length} enquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedProperty.title}
                    </h2>
                    <p className="text-sm text-gray-500">Property Details</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedProperty.description}</p>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Property For:</span>
                      <Badge variant="outline" className="bg-green-50">
                        {selectedProperty.propertyFor}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900 font-medium">{selectedProperty.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Price:</span>
                      <span className="text-gray-900 font-semibold">
                        ₹{selectedProperty.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Square className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Area:</span>
                      <span className="text-gray-900">{selectedProperty.area} sq.ft</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Bedrooms:</span>
                      <span className="text-gray-900">{selectedProperty.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bath className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Bathrooms:</span>
                      <span className="text-gray-900">{selectedProperty.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Furnishing:</span>
                      <span className="text-gray-900">{selectedProperty.furnishing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-gray-500">Status:</span>
                      <Badge className={`
                        ${selectedProperty.status === "ACCEPTED" ? "bg-green-500" : 
                          selectedProperty.status === "PENDING" ? "bg-yellow-500" : "bg-red-500"}
                      `}>
                        {selectedProperty.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-100">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Location</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-gray-600">
                      {selectedProperty.address}, {selectedProperty.locality}, {selectedProperty.city}, {selectedProperty.state} - {selectedProperty.pincode}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Owner/Agent Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-gray-600">{selectedProperty.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-gray-600">{selectedProperty.ownerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-gray-600">{selectedProperty.ownerEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Images */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Property Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProperty.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Property ${i + 1}`}
                          className="rounded-lg h-48 w-full object-cover border hover:shadow-md transition-shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
                <Button onClick={closeModal} variant="outline">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminSidebar>
  );
}