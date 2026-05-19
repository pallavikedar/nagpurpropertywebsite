"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Home,
  Users,
  TrendingUp,
  Activity,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "../baseurl";
import AdminSidebar from "@/components/admin-sidebar";

const COLORS = ["#4690be", "#16a34a", "#f59e0b", "#dc2626"];

export default function AdminDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    totalEnquiries: 0,
  });

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      router.push("/Login");
    }
  }, [router]);

  // Fetch Properties
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) return;
      
      try {
        const res = await fetch(`${BASE_URL}/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProperties(data);
        
        setStats(prev => ({
          ...prev,
          totalProperties: data.length,
          accepted: data.filter(p => p.status === "ACCEPTED").length,
          pending: data.filter(p => p.status === "PENDING").length,
          rejected: data.filter(p => p.status === "REJECT").length,
        }));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  // Fetch Enquiries
  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) return;
      
      try {
        const res = await fetch(`${BASE_URL}/AllProperty-enquiries`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setEnquiries(data);
        setStats(prev => ({ ...prev, totalEnquiries: data.length }));
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const propertyStatusData = [
    { name: "Accepted", value: stats.accepted, color: "#16a34a" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Rejected", value: stats.rejected, color: "#dc2626" },
  ];

  const getWeeklyTrendData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // Group enquiries by day of week
    const enquiriesByDay = days.map(day => ({ day, count: 0 }));
    
    enquiries.forEach(enquiry => {
      const date = new Date(enquiry.createdAt || enquiry.visitDate);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dayData = enquiriesByDay.find(d => d.day === dayName);
      if (dayData) dayData.count++;
    });
    
    return enquiriesByDay;
  };

  const statCards = [
    { 
      title: "Total Properties", 
      value: stats.totalProperties, 
      icon: Building, 
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
      changeType: "up"
    },
    { 
      title: "Accepted", 
      value: stats.accepted, 
      icon: CheckCircle, 
      gradient: "from-green-500 to-emerald-500",
      change: "+8%",
      changeType: "up"
    },
    { 
      title: "Pending", 
      value: stats.pending, 
      icon: Clock, 
      gradient: "from-yellow-500 to-orange-500",
      change: "-3%",
      changeType: "down"
    },
    { 
      title: "Total Enquiries", 
      value: stats.totalEnquiries, 
      icon: Users, 
      gradient: "from-purple-500 to-pink-500",
      change: "+25%",
      changeType: "up"
    },
  ];

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Here's what's happening with your properties today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button> */}
              <Button 
                className="gap-2 bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant={stat.changeType === "up" ? "default" : "destructive"} 
                      className="text-xs font-semibold"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
                  <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Property Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Area Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Weekly Enquiry Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getWeeklyTrendData()}>
                  <defs>
                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4690be" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4690be" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4690be" 
                    fill="url(#colorEnquiries)" 
                    name="Enquiries"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enquiries Table */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Property Enquiries
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Message</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Visit Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {enquiries.slice(0, 5).map((enquiry, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {enquiry.fullName || enquiry.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {enquiry.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {enquiry.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate hidden md:table-cell">
                        {enquiry.message}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {new Date(enquiry.visitDate || enquiry.createdAt).toLocaleDateString()}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {enquiries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No enquiries found</p>
              </div>
            )}
            
            {enquiries.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/admin/propertyEnquiry">
                  <Button variant="outline" className="gap-2">
                    View All Enquiries ({enquiries.length})
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
          >
            <div className="p-6 text-white">
              <Building className="h-10 w-10 mb-4 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Add New Property</h3>
              <p className="text-sm opacity-90 mb-4">List a new property on the platform</p>
              <Link href="/add-property">
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  Add Property
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
          >
            <div className="p-6 text-white">
              <Users className="h-10 w-10 mb-4 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Manage Properties</h3>
              <p className="text-sm opacity-90 mb-4">Review and moderate property listings</p>
              <Link href="/admin/Properties">
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  Manage Properties
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
          >
            <div className="p-6 text-white">
              <TrendingUp className="h-10 w-10 mb-4 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Analytics Report</h3>
              <p className="text-sm opacity-90 mb-4">View detailed analytics and insights</p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                View Reports
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminSidebar>
  );
}