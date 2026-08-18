"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building,
  Users,
  TrendingUp,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  PieChart as PieChartIcon,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "../baseurl";
import AdminSidebar from "@/components/admin-sidebar";

const COLORS = ["#4690be", "#16a34a", "#f59e0b", "#dc2626"];

/**
 * Normalizes any API response shape into a plain array.
 * Handles:
 *  - bare arrays                 -> [...]
 *  - Spring Page objects         -> { content: [...], totalElements, ... }
 *  - common wrapper envelopes    -> { data: [...] }
 * Anything else returns [] so .filter/.map/.forEach never throw.
 */
const toArray = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content; // Spring Page
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

/** Pulls the true total from a Spring Page, falling back to the page length. */
const totalOf = (payload: any, list: any[]): number =>
  typeof payload?.totalElements === "number" ? payload.totalElements : list.length;

export default function AdminDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartHeight, setChartHeight] = useState(300);
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

  // Responsive chart height based on viewport width
  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 480) {
        setChartHeight(220);
      } else if (window.innerWidth < 768) {
        setChartHeight(260);
      } else {
        setChartHeight(300);
      }
    };
    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  // Fetch Properties + Enquiries together so `loading` flips once, at the end.
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // --- Properties -------------------------------------------------
      try {
        // size=2000 keeps the counts correct now that the endpoint is paginated.
        // Better long term: a dedicated /properties/stats endpoint on Spring Boot.
        const res = await fetch(`${BASE_URL}/properties?page=0&size=2000`, { headers });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admintoken");
          router.push("/Login");
          return;
        }
        if (!res.ok) throw new Error(`Properties request failed (${res.status})`);

        const payload = await res.json();
        const list = toArray(payload);

        if (!cancelled) {
          setProperties(list);
          setStats((prev) => ({
            ...prev,
            totalProperties: totalOf(payload, list),
            accepted: list.filter((p) => p?.status === "ACCEPTED").length,
            pending: list.filter((p) => p?.status === "PENDING").length,
            rejected: list.filter((p) => p?.status === "REJECT").length,
          }));
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        if (!cancelled) setError("Could not load properties.");
      }

      // --- Enquiries --------------------------------------------------
      try {
        const res = await fetch(`${BASE_URL}/AllProperty-enquiries`, { headers });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admintoken");
          router.push("/Login");
          return;
        }
        if (!res.ok) throw new Error(`Enquiries request failed (${res.status})`);

        const payload = await res.json();
        const list = toArray(payload);

        if (!cancelled) {
          setEnquiries(list);
          setStats((prev) => ({ ...prev, totalEnquiries: totalOf(payload, list) }));
        }
      } catch (err) {
        console.error("Error fetching enquiries:", err);
        if (!cancelled) setError((e) => e ?? "Could not load enquiries.");
      }

      if (!cancelled) setLoading(false);
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const propertyStatusData = [
    { name: "Accepted", value: stats.accepted, color: "#16a34a" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Rejected", value: stats.rejected, color: "#dc2626" },
  ];

  const getWeeklyTrendData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const enquiriesByDay = days.map((day) => ({ day, count: 0 }));

    const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

    safeEnquiries.forEach((enquiry) => {
      const raw = enquiry?.createdAt || enquiry?.visitDate;
      if (!raw) return;

      const date = new Date(raw);
      if (isNaN(date.getTime())) return; // skip unparseable dates

      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dayData = enquiriesByDay.find((d) => d.day === dayName);
      if (dayData) dayData.count++;
    });

    return enquiriesByDay;
  };

  const formatDate = (value: any) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const recentEnquiries = (Array.isArray(enquiries) ? enquiries : []).slice(0, 5);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
      changeType: "up",
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      change: "+8%",
      changeType: "up",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
      change: "-3%",
      changeType: "down",
    },
    {
      title: "Total Enquiries",
      value: stats.totalEnquiries,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      change: "+25%",
      changeType: "up",
    },
  ];

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">Loading dashboard data...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="p-3 xs:p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent break-words">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Welcome back! Here's what's happening with your properties today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Button
                className="gap-2 bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all w-full sm:w-auto justify-center"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Error banner (non-blocking) */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <Badge
                      variant={stat.changeType === "up" ? "default" : "destructive"}
                      className="text-xs font-semibold shrink-0"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {Number(stat.value || 0).toLocaleString()}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{stat.title}</p>
                </div>
                <div
                  className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Pie Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <PieChartIcon className="h-5 w-5 text-primary shrink-0" />
                <span className="truncate">Property Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={chartHeight < 260 ? 45 : 60}
                    outerRadius={chartHeight < 260 ? 75 : 100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "0.8rem" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Area Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-5 w-5 text-primary shrink-0" />
                <span className="truncate">Weekly Enquiry Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <AreaChart data={getWeeklyTrendData()} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4690be" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4690be" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4690be"
                    fill="url(#colorEnquiries)"
                    name="Enquiries"
                  />
                  <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enquiries */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 sm:gap-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-5 w-5 text-primary shrink-0" />
              Recent Property Enquiries
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden xs:inline">Filter</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Mobile / small screens: stacked card list */}
            <div className="space-y-3 md:hidden">
              {recentEnquiries.map((enquiry, idx) => (
                <motion.div
                  key={enquiry?.id ?? idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-lg border border-gray-100 p-3 sm:p-4 bg-gray-50/60"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-semibold text-gray-900 text-sm break-words min-w-0">
                      {enquiry?.fullName || enquiry?.name || "—"}
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs shrink-0"
                    >
                      {formatDate(enquiry?.visitDate || enquiry?.createdAt)}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="flex items-center gap-1.5 break-all">
                      <Mail className="h-3.5 w-3.5 shrink-0" /> {enquiry?.email || "—"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" /> {enquiry?.phone || "—"}
                    </p>
                    {enquiry?.message && (
                      <p className="flex items-start gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{enquiry.message}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
              {recentEnquiries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No enquiries found</p>
                </div>
              )}
            </div>

            {/* Tablet / desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">
                      Message
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Visit Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentEnquiries.map((enquiry, idx) => (
                    <motion.tr
                      key={enquiry?.id ?? idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[160px] truncate">
                        {enquiry?.fullName || enquiry?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                        {enquiry?.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {enquiry?.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate hidden lg:table-cell">
                        {enquiry?.message}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap"
                        >
                          {formatDate(enquiry?.visitDate || enquiry?.createdAt)}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {recentEnquiries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No enquiries found</p>
                </div>
              )}
            </div>

            {stats.totalEnquiries > 0 && (
              <div className="mt-6 text-center">
                <Link href="/admin/propertyEnquiry">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    View All Enquiries ({stats.totalEnquiries})
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
          >
            <div className="p-5 sm:p-6 text-white">
              <Building className="h-8 w-8 sm:h-10 sm:w-10 mb-3 sm:mb-4 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Add New Property</h3>
              <p className="text-sm opacity-90 mb-4">List a new property on the platform</p>
              <Link href="/add-property">
                <Button
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  Add Property
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
          >
            <div className="p-5 sm:p-6 text-white">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 mb-3 sm:mb-4 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Manage Properties</h3>
              <p className="text-sm opacity-90 mb-4">Review and moderate property listings</p>
              <Link href="/admin/Properties">
                <Button
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  Manage Properties
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group sm:col-span-2 md:col-span-1"
          >
            <div className="p-5 sm:p-6 text-white">
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 mb-3 sm:mb-4 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Analytics Report</h3>
              <p className="text-sm opacity-90 mb-4">View detailed analytics and insights</p>
              <Button
                variant="secondary"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
              >
                View Reports
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminSidebar>
  );
}