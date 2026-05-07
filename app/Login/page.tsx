"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/app/baseurl";
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useLanguage } from "@/context/language-context";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  Building,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react";

export default function LoginPage() {
  const { translations } = useLanguage();
  const t = translations;
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix: Only access localStorage after component mounts
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        setFormData(prev => ({ ...prev, email: rememberedEmail }));
        setRememberMe(true);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        let roleName = null;
        
        // Only access localStorage in browser
        if (typeof window !== 'undefined') {
          if (data.admin) {
            roleName = data.admin.role[0].roleName;
            localStorage.setItem("admintoken", data.jwtToken);
            localStorage.setItem("adminLoggedIn", "true");
            if (data.admin.name) localStorage.setItem("adminName", data.admin.name);
            if (data.admin.email) localStorage.setItem("adminEmail", data.admin.email);
          } else if (data.user) {
            roleName = data.user.role[0].roleName;
            localStorage.setItem("usertoken", data.jwtToken);
            localStorage.setItem("userLoggedIn", "true");
            if (data.user.name) localStorage.setItem("userName", data.user.name);
            if (data.user.email) localStorage.setItem("userEmail", data.user.email);
          }

          if (rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          localStorage.setItem("role", roleName);
        }

        // Redirect based on role
        if (roleName === "Admin") {
          router.push("/admin");
        } else if (roleName === "User") {
          router.push("/");
        } else {
          setError("Unknown role. Please contact support.");
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error or server issue. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/user/Register");
  };

  // Don't render until mounted to avoid hydration errors
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/70 shadow-lg mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to your account to continue
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-800">
                  {t.Login || "Login"}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-8 pb-6 px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {t.email || "Email Address"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.enterEmail || "Enter your email"}
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-4 py-3 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      {t.password || "Password"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t.enterPassword || "Enter your password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-4 pr-10 py-3 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all duration-300 py-6 text-base font-semibold rounded-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        {t.Loggingin || "Logging in..."}
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        {t.Login || "Login"}
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRegisterRedirect}
                    className="w-full border-2 hover:bg-gray-50 transition-all duration-300 py-6 text-base rounded-xl"
                  >
                    <UserPlus className="h-5 w-5 mr-2 text-primary" />
                    {t.UserRegistration || "Create New Account"}
                  </Button>
                </form>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-gray-500">
                    Your credentials are securely encrypted. We never share your data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-sm text-gray-500 mt-8"
          >
            Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
          </motion.p>
        </div>
      </div>

      <Footer />
    </div>
  );
}