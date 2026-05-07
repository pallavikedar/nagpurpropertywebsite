"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Shield,
  Key,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(null);

  // Get token on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("usertoken");
    const adminToken = localStorage.getItem("admintoken");
    const currentToken = userToken || adminToken;
    
    if (!currentToken) {
      setError("Please login to continue");
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } else {
      setToken(currentToken);
    }
  }, [router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.oldPassword) {
      setError("Please enter your current password");
      return false;
    }
    if (!formData.newPassword) {
      setError("Please enter a new password");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your new password");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }
    if (formData.oldPassword === formData.newPassword) {
      setError("New password cannot be the same as old password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Check token again before submitting
    const currentToken = localStorage.getItem("usertoken") || localStorage.getItem("admintoken");
    if (!currentToken) {
      setError("Session expired. Please login again.");
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BASE_URL}/changePassword`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        setError("Your session has expired. Please login again.");
        localStorage.removeItem("usertoken");
        localStorage.removeItem("admintoken");
        setTimeout(() => {
          router.push("/Login");
        }, 2000);
        setLoading(false);
        return;
      }

      // Check if response is JSON or text
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        data = { message: textResponse };
      }

      if (!response.ok) {
        throw new Error(data.message || data || "Failed to change password");
      }

      setSuccess(data.message || "Password changed successfully!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Show success message and redirect to login
      setTimeout(() => {
        // Clear all tokens
        localStorage.removeItem("usertoken");
        localStorage.removeItem("admintoken");
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("adminLoggedIn");
        
        alert("Password changed successfully! Please login again with your new password.");
        router.push("/Login");
      }, 2000);
      
    } catch (err) {
      console.error("Password change error:", err);
      
      // Handle specific error messages
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("usertoken");
        localStorage.removeItem("admintoken");
       
      } else if (err.message.includes("old password") || err.message.includes("current password")) {
        setError("Current password is incorrect");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // If no token, show loading or redirect message
  if (!token && !error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Checking authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 shadow-lg mb-4">
              <Key className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Change Password
            </h1>
            <p className="text-gray-500 mt-2">
              Update your account password
            </p>
          </motion.div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Password Settings
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword" className="text-gray-700 font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        className="pr-10 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password (min 6 characters)"
                        className="pr-10 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        className="pr-10 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
                    </div>
                    <ul className="text-xs text-gray-500 space-y-1 ml-6 list-disc">
                      <li>Minimum 6 characters long</li>
                      <li>Cannot be the same as current password</li>
                      <li>Should be unique and secure</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/70"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Changing...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/profile")}
                      className="flex-1 gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>

                {/* Debug info - Remove in production */}
                {process.env.NODE_ENV === "development" && token && (
                  <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-500">
                    <p>Debug: Token exists ✓</p>
                    <p>API URL: {BASE_URL}/auth/changePassword</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}