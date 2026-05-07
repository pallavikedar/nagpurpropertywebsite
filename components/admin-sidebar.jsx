"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Home,
  LayoutDashboard,
  Users,
  LogOut,
  Handshake,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Mail,
  FileText,
  TrendingUp,
  Bell,
  HelpCircle,
  Shield,
  Menu,
  X,
  User,
  Phone,
  Mail as MailIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const menuItems = [
  { 
    href: "/admin", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
    description: "Overview & statistics"
  },
  { 
    href: "/admin/Properties", 
    label: "Properties", 
    icon: Building,
    color: "from-purple-500 to-pink-500",
    description: "Manage property listings"
  },
  { 
    href: "/admin/propertyEnquiry", 
    label: "Property Enquiries", 
    icon: Users,
    color: "from-green-500 to-emerald-500",
    description: "View property enquiries"
  },
  { 
    href: "/admin/enquiries", 
    label: "Legal Enquiries", 
    icon: Handshake,
    color: "from-orange-500 to-red-500",
    description: "Legal consultancy requests"
  },
  { 
    href: "/admin/getusers", 
    label: "Users", 
    icon: Settings,
    color: "from-indigo-500 to-purple-500",
    description: "Manage user accounts"
  },
];

export default function AdminSidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("admin@nagpurproperties.com");

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
    
    const storedName = localStorage.getItem("adminName");
    const storedEmail = localStorage.getItem("adminEmail");
    if (storedName) setAdminName(storedName);
    if (storedEmail) setAdminEmail(storedEmail);
  }, []);

  // Save sidebar state
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    router.push("/Login");
  };

  const menuItemVariants = {
    expanded: { width: "auto", opacity: 1, display: "inline-block" },
    collapsed: { width: 0, opacity: 0, display: "none" }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-primary to-primary/70 text-white p-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className={cn(
          "fixed left-0 top-0 h-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white z-40",
          "shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col",
          isMobileOpen ? "block" : "hidden md:flex"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-gray-700/50 sticky top-0 bg-gray-900 z-10",
          isCollapsed ? "justify-center" : "px-6 justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                Nagpur Props
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin" className="group">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="h-4 w-4" />
              </div>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 transition-all hover:scale-110"
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        {/* Admin Profile */}
        <div className={cn(
          "border-b border-gray-700/50 py-6",
          isCollapsed ? "px-4" : "px-6"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="relative group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-xl font-bold">
                  {adminName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={menuItemVariants}
                className="overflow-hidden"
              >
                <p className="font-semibold text-sm text-white">{adminName}</p>
                <p className="text-xs text-gray-400 truncate max-w-[140px]">{adminEmail}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Menu - Scrollable Area */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className={cn(
            "mb-6",
            !isCollapsed && "px-6"
          )}>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Main Menu
              </p>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                      isCollapsed && "justify-center",
                      isActive
                        ? "bg-primary/20 text-primary shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className="relative">
                      <Icon className={cn(
                        "h-5 w-5 transition-all group-hover:scale-110",
                        isActive && "text-primary"
                      )} />
                      {isActive && !isCollapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"
                        />
                      )}
                    </div>
                    {!isCollapsed && (
                      <>
                        <motion.span
                          initial="expanded"
                          animate={isCollapsed ? "collapsed" : "expanded"}
                          variants={menuItemVariants}
                          className="text-sm font-medium"
                        >
                          {item.label}
                        </motion.span>
                        
                      </>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout Button - Fixed at Bottom */}
        <div className={cn(
          "border-t border-gray-700/50 py-4 mt-auto",
          isCollapsed ? "px-4" : "px-6"
        )}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 group",
              "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
            {!isCollapsed && (
              <motion.span
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={menuItemVariants}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-red-500/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Logout
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area with Dynamic Margin */}
      <motion.main
        animate={{
          marginLeft: isCollapsed ? 80 : 280,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {/* Mobile Spacing */}
        <div className="md:hidden h-16" />
        
        {children}
      </motion.main>
    </>
  );
}