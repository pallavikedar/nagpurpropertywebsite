"use client";

import { useEffect, useState } from "react";
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
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  User,
  Shield,
  Crown,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/app/baseurl";
import AdminSidebar from "@/components/admin-sidebar";

export default function UserListAndTable() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const showToast = (message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setError("Authorization token is missing");
        router.push("/Login");
        return;
      }

      const response = await fetch(`${BASE_URL}/Alluser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      showToast(err.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user =>
        user.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    showToast("Users refreshed successfully!", "success");
  };

  const handleExport = () => {
    try {
      const exportData = filteredUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Role: user.role || "User",
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
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(`Exported ${exportData.length} users successfully!`, "success");
    } catch (err) {
      showToast("Failed to export users", "error");
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const getRoleBadge = (role) => {
    if (role === "Admin" || role === "admin") {
      return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Admin</Badge>;
    }
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">User</Badge>;
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "Admin" || u.role === "admin").length,
    users: users.filter(u => u.role !== "Admin" && u.role !== "admin").length,
  };

  if (loading && users.length === 0) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading users...</p>
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
                  User Management
                </h1>
                <p className="text-gray-500 mt-1">
                  View and manage all registered users on the platform
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
                  disabled={filteredUsers.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard 
              title="Total Users" 
              value={stats.total} 
              icon={Users} 
              color="from-blue-500 to-cyan-500"
              subtitle="Registered accounts"
            />
            <StatCard 
              title="Administrators" 
              value={stats.admins} 
              icon={Crown} 
              color="from-purple-500 to-pink-500"
              subtitle="With admin privileges"
            />
            <StatCard 
              title="Regular Users" 
              value={stats.users} 
              icon={UserCheck} 
              color="from-green-500 to-emerald-500"
              subtitle="Standard account holders"
            />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email or phone number..."
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
                          <label className="text-sm font-medium text-gray-700 mb-2 block">User Role</label>
                          <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSearchTerm("");
                              setRoleFilter("all");
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

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-500">{error}</p>
                <Button onClick={handleRefresh} className="mt-4">Try Again</Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No users found</p>
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
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">User</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">Phone</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Role</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500 lg:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewUserDetails(user)}
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
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                {filteredUsers.length > 0 && (
                  <p className="text-sm text-green-600">
                    <UserCheck className="h-3 w-3 inline mr-1" />
                    {stats.admins} Admins, {stats.users} Regular Users
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      User Details
                    </h2>
                    <p className="text-sm text-gray-500">Profile Information</p>
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
                {/* User Information */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-bold text-2xl">
                        {selectedUser.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <Mail className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <p className="text-sm text-gray-900">{selectedUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <Shield className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-gray-500">Account Type</p>
                          <p className="text-sm text-gray-900 capitalize">{selectedUser.role || "User"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-gray-500">Member Since</p>
                          <p className="text-sm text-gray-900">
                            {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t">
                    <div className="flex flex-col gap-3">
                      <Button 
                        className="w-full gap-2"
                        onClick={() => window.location.href = `mailto:${selectedUser.email}`}
                      >
                        <Mail className="h-4 w-4" />
                        Send Email
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => window.location.href = `tel:${selectedUser.phone}`}
                      >
                        <Phone className="h-4 w-4" />
                        Call User
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminSidebar>
  );
}