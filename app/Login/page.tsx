"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/baseurl";
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useLanguage } from "@/context/language-context";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
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
      console.log("Response data:", data); // Log the response data for debugging
  
      if (response.ok) {
        setIsLoggedIn(true);
        // localStorage.setItem("token", data.jwtToken); // Save token
        // localStorage.setItem("isLoggedIn", "true"); // Save login status
  
        // Extract roleName based on whether admin or user is present
        let roleName = null;
        if (data.admin) {
          roleName = data.admin.role[0].roleName; // Extract roleName from admin
          localStorage.setItem("admintoken", data.jwtToken);
          localStorage.setItem("adminLoggedIn", "true");
        } else if (data.user) {
          roleName = data.user.role[0].roleName; // Extract roleName from user
          localStorage.setItem("usertoken", data.jwtToken);
          localStorage.setItem("userLoggedIn", "true");
        }
  
        console.log("Role Name:", roleName); // Log the role name for debugging
        localStorage.setItem("role", roleName); // Save role in localStorage
  
        alert("Login Successful!");
  
        // Redirect based on role
        if (roleName === "Admin") {
          router.push("/admin"); // Redirect to admin dashboard
          
        } else if (roleName === "User") {
          router.push("/"); // Redirect to user dashboard
         
        } else {
          console.error("Unknown role:", roleName);
          setError("Unknown role. Please contact support.");
        }
      } else {
        console.error("Error response:", data); // Log the error response
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error or server issue. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterRedirect = () => {
    router.push("/user/Register"); // Navigate to registration page
  };

  return (
    <div className="min-h-screen flex flex-col">
              <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t.Login}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="userId">{t.email}</Label>
              <Input
                id="email"
                placeholder={t.enterEmail}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.enterPassword}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 font-medium">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.Loggingin : t.Login}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t.Donthaveanaccount}{" "}
              <Button
                variant="link"
                className="text-primary font-medium"
                onClick={handleRegisterRedirect}
              >
               {t.UserRegistration}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer />
      </div>
  );
}
