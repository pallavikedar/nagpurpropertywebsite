"use client";
import React, { useState } from 'react';
import { BASE_URL } from '@/app/baseurl';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
const UserRegistration = () => {
  const router =useRouter()
  const {translations} = useLanguage();
  const t = translations;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/registerUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        setSuccess('User registered successfully!');
        // clear fields
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again later.');
    }
  };
 const handleRegisterRedirect = () => {
    router.push("/Login"); // Navigate to registration page
  };
  return (
     <div className="min-h-screen flex flex-col">
          <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {t.UserRegistration}
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border">
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-500 text-sm text-center">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium">{t.name}</label>
              <input
                id="name"
                type="text"
                className="w-full border rounded p-2"
                value={name}
                placeholder={t.enterName}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">{t.email}</label>
              <input
                id="email"
                type="email"
                className="w-full border rounded p-2"
                value={email}
                placeholder={t.enterEmail}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">{t.password}</label>
              <input
                id="password"
                type="password"
                className="w-full border rounded p-2"
                value={password}
                placeholder={t.enterPassword}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block font-medium">{t.PhoneNumber}</label>
              <input
                id="phone"
                type="text"
                className="w-full border rounded p-2"
                value={phone}
                placeholder={t.Enterphonenumber}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white py-2 rounded  transition"
            >
             {t.Register}
            </Button>
          </form>
          <div style={{textAlign:"right"}} className="mt-4 text-center ">
            <p className="text-sm text-muted-foreground">
              {t.Backto}{" "}
           <Button
                variant="link"
                className="text-primary font-medium"
                onClick={handleRegisterRedirect}
              >
               {t.Login}
              </Button>
              </p>
              </div>
        </div>
        
      </div>
    </div>
     <Footer />
  </div>
  );
};

export default UserRegistration;
