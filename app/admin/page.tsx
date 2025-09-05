"use client"

import { Label } from "@/components/ui/label"

import { useState,useEffect } from "react"
import Link from "next/link"
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { properties } from "@/lib/data"
import { useRouter } from "next/navigation";


export default function AdminDashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

 const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }
 useEffect(() => {
  // Check if the user is logged in
  const adminLoggedIn = Boolean(localStorage.getItem("adminLoggedIn")); // Replace with actual logic
  setIsLoggedIn(adminLoggedIn);

  // Redirect based on login status
  if (!adminLoggedIn) {
    router.push("/Login"); // Redirect to login if not logged in
  } else {
    router.push("/admin"); // Redirect to admin dashboard if logged in
  }
}, [router]);

if (!isLoggedIn) {
  return null; // Prevent rendering until redirection is complete
}
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
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
              href="/admin/settings"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
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

        {/* Main Content */}
        <div className="flex-1 md:ml-64 pt-16 md:pt-0">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your admin dashboard</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Properties</p>
                    <h3 className="text-2xl font-bold">{properties.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">For Sale</p>
                    <h3 className="text-2xl font-bold">{properties.filter((p) => p.type === "buy").length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">For Rent</p>
                    <h3 className="text-2xl font-bold">{properties.filter((p) => p.type === "rent").length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enquiries</p>
                    <h3 className="text-2xl font-bold">24</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <Tabs defaultValue="properties">
                <TabsList className="mb-4">
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
                </TabsList>

                <TabsContent value="properties">
                  <div className="space-y-4">
                    {properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-muted rounded-md flex-shrink-0"></div>
                          <div>
                            <h3 className="font-medium">{property.title}</h3>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={property.type === "rent" ? "secondary" : "default"}>
                            {property.type === "rent" ? "For Rent" : "For Sale"}
                          </Badge>
                          <Button variant="ghost" size="sm" className="ml-2">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="enquiries">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">John Doe</h3>
                          <p className="text-sm text-muted-foreground">Enquiry for Legal Consultancy</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline">New</Badge>
                          <Button variant="ghost" size="sm" className="ml-2">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="h-auto py-4 justify-start">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Property
                </Button>
                <Button variant="outline" className="h-auto py-4 justify-start">
                  <ListFilter className="h-5 w-5 mr-2" />
                  Manage Properties
                </Button>
                <Button variant="outline" className="h-auto py-4 justify-start">
                  <Users className="h-5 w-5 mr-2" />
                  View Enquiries
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// function AdminLogin({ onLogin }: { onLogin: () => void }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//             Nagpur Properties
//           </h1>
//           <p className="text-muted-foreground mt-2">Admin Dashboard</p>
//         </div>

//         <div className="bg-white p-8 rounded-lg shadow-md border">
//           <h2 className="text-xl font-bold mb-6">Login to Admin Panel</h2>
//           <form
//             className="space-y-4"
//             onSubmit={(e) => {
//               e.preventDefault()
//               onLogin()
//             }}
//           >
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="Enter your email" defaultValue="admin@nagpurproperties.com" />
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password">Password</Label>
//                 <Link href="#" className="text-sm text-primary hover:underline">
//                   Forgot password?
//                 </Link>
//               </div>
//               <Input id="password" type="password" placeholder="Enter your password" defaultValue="admin123" />
//             </div>

//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//           </form>

//           <div className="mt-6 text-center text-sm">
//             <Link href="/" className="text-primary hover:underline">
//               Return to Website
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
