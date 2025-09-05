"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";
import { useLanguage, LanguageProvider} from "@/context/language-context";

export default function LegalConsultancyPage() {
  const { translations } = useLanguage(); // Use the client-side hook
  const t = translations;
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    requredService: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/Enquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      alert("Enquiry submitted successfully!");
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        requredService: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ... other sections remain unchanged ... */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920&auto=format&fit=crop')",
            }}
          ></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-up">
                {t.LegalConsultancyServices}
              </h1>
              <p
                className="text-primary-foreground/90 text-lg md:text-xl animate-fade-up"
                style={{ animationDelay: "100ms" }}
              >
               {t.expertlegaladvice}
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left section remains unchanged */}
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                  {t.OurLegalServices}
                </h2>
                <div className="space-y-6">
                  <div
                    className="flex gap-4 animate-slide-in-left"
                    style={{ animationDelay: "100ms" }}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                      {t.PropertyDocumentation}
                      </h3>
                      <p className="text-muted-foreground">
                        {t.Weensureallyourpropertydocumentsarelegallyverifiedandinorderprotectingyoufromfuturedisputes}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex gap-4 animate-slide-in-left"
                    style={{ animationDelay: "200ms" }}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t.TitleVerification}
                      </h3>
                      <p className="text-muted-foreground">
                       {t.Ourexpertsthoroughlyverifypropertytitlestoensuretheyareclearandfreefromanyencumbrances}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex gap-4 animate-slide-in-left"
                    style={{ animationDelay: "300ms" }}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t.AgreementDrafting}
                      </h3>
                      <p className="text-muted-foreground">
                       {t.Wedraftlegallysoundagreementsforsalepurchaseleaseandotherpropertytransactions}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex gap-4 animate-slide-in-left"
                    style={{ animationDelay: "400ms" }}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                       {t.LegalCompliance}
                      </h3>
                      <p className="text-muted-foreground">
                        {t.Weensureyourpropertytransactionscomplywithallrelevantlawsandregulations}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex gap-4 animate-slide-in-left"
                    style={{ animationDelay: "500ms" }}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t.DisputeResolution}
                      </h3>
                      <p className="text-muted-foreground">
                        {t.Ourlegalexpertshelpresolvepropertyrelateddisputesefficientlyandeffectively}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-white p-8 rounded-lg shadow-md border animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <h2 className="text-2xl font-bold mb-6">
                 {t.EnquireforLegalConsultancy}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="fullname">{t.FullName}</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder={t.Enteryourfullname}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">{t.EmailAddress}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.Enteryouremail}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">{t.PhoneNumber}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.Enteryourphonenumber}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="requredService">{t.ServiceRequired}</Label>
                    <select
                      id="requredService"
                      name="requredService"
                      value={formData.requredService}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">{t.Selectaservice}</option>
                      <option value="documentation">
                       {t.PropertyDocumentation}
                      </option>
                      <option value="title">{t.TitleVerification}</option>
                      <option value="agreement">{t.AgreementDrafting}</option>
                      <option value="compliance">{t.LegalCompliance}</option>
                      <option value="dispute">{t.DisputeResolution}</option>
                      <option value="other">{t.Other}</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">{t.YourMessage}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.Pleasedescribeyourlegalrequirements}
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full transition-transform hover:scale-105"
                  >
                   {t.SubmitEnquiry}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ... other sections remain unchanged ... */}
        <section className="py-16 bg-muted">
          <div className="container px-4 md:px-6">
            {" "}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 animate-fade-up">
                {" "}
               {t.WhyChooseOurLegalServices}{" "}
              </h2>{" "}
              <p
                className="text-muted-foreground mb-8 animate-fade-up"
                style={{ animationDelay: "100ms" }}
              >
                {" "}
                {t.Ourteamofexperiencedlegalprofessionalsensuresthatyourpropertytransactionsaresecureandhasslefree}
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                {" "}
                <div
                  className="bg-white p-6 rounded-lg shadow-sm transition-transform hover:scale-105 animate-zoom-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    15+
                  </div>
                  <p className="text-muted-foreground">{t.YearsofExperience}</p>
                </div>
                <div
                  className="bg-white p-6 rounded-lg shadow-sm transition-transform hover:scale-105 animate-zoom-in"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    500+
                  </div>
                  <p className="text-muted-foreground">{t.SatisfiedClients}</p>
                </div>
                <div
                  className="bg-white p-6 rounded-lg shadow-sm transition-transform hover:scale-105 animate-zoom-in"
                  style={{ animationDelay: "400ms" }}
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    100%
                  </div>
                  <p className="text-muted-foreground">{t.LegalCompliance}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
