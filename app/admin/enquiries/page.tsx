"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, 
  Handshake, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Tag,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/app/baseurl";
import AdminSidebar from "@/components/admin-sidebar";

const EnquiryTable = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const showToast = (message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Admin token is missing. Please log in again.");
        router.push("/Login");
        return;
      }

      const response = await fetch(`${BASE_URL}/show-Enquire`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch enquiries. Please try again.");
      }

      const data = await response.json();
      setEnquiries(data);
      setFilteredEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setError(error.message || "Failed to fetch enquiries");
      showToast(error.message || "Failed to fetch enquiries", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter enquiries
  useEffect(() => {
    let filtered = [...enquiries];

    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phone?.includes(searchTerm) ||
        enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.requredService?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter(enquiry =>
        enquiry.requredService?.toLowerCase() === serviceFilter.toLowerCase()
      );
    }

    setFilteredEnquiries(filtered);
  }, [searchTerm, serviceFilter, enquiries]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEnquiries();
    showToast("Enquiries refreshed successfully!", "success");
  };

  const handleExport = () => {
    try {
      const exportData = filteredEnquiries.map(enquiry => ({
        Name: enquiry.fullname,
        Email: enquiry.email,
        Phone: enquiry.phone,
        Service: enquiry.requredService,
        Message: enquiry.message,
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
      link.setAttribute('download', `legal_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(`Exported ${exportData.length} enquiries successfully!`, "success");
    } catch (err) {
      showToast("Failed to export enquiries", "error");
    }
  };

  const viewEnquiryDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const closeModal = () => {
    setSelectedEnquiry(null);
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

  // Get unique services for filter
  const uniqueServices = [...new Set(enquiries.map(e => e.requredService))];

  // Service type badges mapping
  const getServiceBadge = (service) => {
    const badges = {
      "Property Documentation": "bg-blue-100 text-blue-700",
      "Title Verification": "bg-green-100 text-green-700",
      "Agreement Drafting": "bg-purple-100 text-purple-700",
      "Legal Compliance": "bg-orange-100 text-orange-700",
      "Dispute Resolution": "bg-red-100 text-red-700",
      "Other": "bg-gray-100 text-gray-700",
    };
    return badges[service] || "bg-gray-100 text-gray-700";
  };

  const stats = {
    total: enquiries.length,
    pending: enquiries.length,
    services: uniqueServices.length,
  };

  if (loading && enquiries.length === 0) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading legal enquiries...</p>
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
                  Legal Consultancy Enquiries
                </h1>
                <p className="text-gray-500 mt-1">
                  View and manage all legal service consultation requests
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="gap-2"
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? "Refreshing..." : "Refresh"}
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
            <StatCard title="Service Types" value={stats.services} icon={Briefcase} color="from-purple-500 to-pink-500" />
            <StatCard title="Active Requests" value={stats.pending} icon={Clock} color="from-green-500 to-emerald-500" />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, phone, service or message..."
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
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
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
                    <div className="pt-4 mt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
                          <select
                            value={serviceFilter}
                            onChange={(e) => setServiceFilter(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="all">All Services</option>
                            {uniqueServices.map((service, index) => (
                              <option key={index} value={service.toLowerCase()}>{service}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSearchTerm("");
                              setServiceFilter("all");
                            }}
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
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-500">{error}</p>
                <Button onClick={handleRefresh} className="mt-4">Try Again</Button>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center">
                <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No legal enquiries found</p>
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
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">Service</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Message</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEnquiries.map((enquiry, index) => (
                      <motion.tr
                        key={enquiry.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.fullname}</p>
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
                        <td className="px-6 py-4">
                          <Badge className={getServiceBadge(enquiry.requredService)}>
                            {enquiry.requredService}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate hidden md:table-cell">
                          {enquiry.message}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewEnquiryDetails(enquiry)}
                            className="gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredEnquiries.length} of {enquiries.length} enquiries
                </p>
                {filteredEnquiries.length > 0 && (
                  <p className="text-sm text-green-600">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    {uniqueServices.length} service types available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Details Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Handshake className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Enquiry Details
                    </h2>
                    <p className="text-sm text-gray-500">Legal Consultation Request</p>
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
                {/* Client Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Client Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEnquiry.fullname}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-900">{selectedEnquiry.phone}</p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Email Address</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-900">{selectedEnquiry.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Service Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Service Required</p>
                      <Badge className={`mt-1 ${getServiceBadge(selectedEnquiry.requredService)}`}>
                        {selectedEnquiry.requredService}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Message / Requirements</p>
                      <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                        {selectedEnquiry.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 gap-2"
                      onClick={() => window.location.href = `mailto:${selectedEnquiry.email}`}
                    >
                      <Mail className="h-4 w-4" />
                      Reply via Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => window.location.href = `tel:${selectedEnquiry.phone}`}
                    >
                      <Phone className="h-4 w-4" />
                      Call Client
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminSidebar>
  );
};

export default EnquiryTable;