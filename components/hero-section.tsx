// "use client"; // Mark this file as a client component

// import { useState } from "react";
// import { Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLanguage } from "@/context/language-context";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function HeroSection() {
//   const { translations } = useLanguage(); // Use the translations from the context
//   const t = translations;
//   const [searchTab, setSearchTab] = useState("buy");

//   return (
//     <section className="relative">
//       <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 mix-blend-multiply" />
//       <div
//         className="relative h-[600px] bg-cover bg-center flex items-center"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1920&auto=format&fit=crop')",
//         }}
//       >
//         <div className="container px-4 md:px-6">
//           <div className="max-w-3xl">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-up animate-once animate-duration-[800ms] animate-delay-100">
//               {t.FindYourDreamPropertyinNagpur}
//             </h1>
//             <p className="text-xl text-white/90 mb-8 animate-fade-up animate-once animate-duration-[800ms] animate-delay-200">
//               {t.DiscovertheperfectpropertyforyourneedswithNagpursmosttrustedrealestatepartner}
//             </p>
//           </div>

//           <div className="bg-white rounded-lg p-4 shadow-lg max-w-4xl animate-fade-up animate-once animate-duration-[800ms] animate-delay-300">
//             <Tabs defaultValue="buy" onValueChange={setSearchTab}>
//               <TabsList className="grid grid-cols-3 mb-4">
//                 <TabsTrigger value="buy">{t.Buy}</TabsTrigger>
//                 <TabsTrigger value="rent">{t.Rent}</TabsTrigger>
//                 <TabsTrigger value="sell">{t.Sell}</TabsTrigger>
//               </TabsList>

//               <TabsContent value="buy" className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="location-buy">{t.Location}</Label>
//                     <Input id="location-buy" placeholder="EnterLocation" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="property-type-buy">{t.PropertyType}</Label>
//                     <Select>
//                       <SelectTrigger id="property-type-buy">
//                         <SelectValue placeholder= "Select Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="apartment">{t.Apartment}</SelectItem>
//                         <SelectItem value="house">{t.House}</SelectItem>
//                         <SelectItem value="villa">{t.Villa}</SelectItem>
//                         <SelectItem value="plot">{t.Plot}</SelectItem>
//                         <SelectItem value="commercial">{t.Commercial}</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="budget-buy">{t.Budget}</Label>
//                     <Select>
//                       <SelectTrigger id="budget-buy">
//                         <SelectValue placeholder="Select Budget" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="1000000">{t.UndertenLakhs}</SelectItem>
//                         <SelectItem value="2500000">{t.tentwentyfiveLakhs}</SelectItem>
//                         <SelectItem value="5000000">{t.twentyfiftyLakhs}</SelectItem>
//                         <SelectItem value="10000000">{t.fiftyoneCrore}</SelectItem>
//                         <SelectItem value="20000000">{t.AboveoneCrore}</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <Button className="mt-auto">
//                     <Search className="h-4 w-4 mr-2" />
//                     {t.Search}
//                   </Button>
//                 </div>
//               </TabsContent>

     

//               <TabsContent value="sell" className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="location-sell">{t.Location}</Label>
//                     <Input id="location-sell" placeholder="Enter location" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="property-type-sell">{t.PropertyType}</Label>
//                     <Select>
//                       <SelectTrigger id="property-type-sell">
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="apartment">{t.Apartment}</SelectItem>
//                         <SelectItem value="house">{t.House}</SelectItem>
//                         <SelectItem value="villa">{t.Villa}</SelectItem>
//                         <SelectItem value="plot">{t.Plot}</SelectItem>
//                         <SelectItem value="commercial">{t.Commercial}</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="col-span-2">
//                     <Button className="w-full">{t.ListYourProperty}</Button>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"; // Mark this file as a client component

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeroSection() {
  const { translations } = useLanguage(); // Use the translations from the context
  const t = translations;
  const [searchTab, setSearchTab] = useState("buy");

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 mix-blend-multiply" />
      <div
        className="relative h-[600px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1920&auto=format&fit=crop')",
        }}
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-up animate-once animate-duration-[800ms] animate-delay-100">
              {t.FindYourDreamPropertyinNagpur}
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-up animate-once animate-duration-[800ms] animate-delay-200">
              {t.DiscovertheperfectpropertyforyourneedswithNagpursmosttrustedrealestatepartner}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg max-w-4xl animate-fade-up animate-once animate-duration-[800ms] animate-delay-300">
            <Tabs defaultValue="buy" onValueChange={setSearchTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="buy">{t.Buy}</TabsTrigger>
                <TabsTrigger value="rent">{t.Rent}</TabsTrigger>
                <TabsTrigger value="sell">{t.Sell}</TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location-buy">{t.Location}</Label>
                    <Input id="location-buy" placeholder="Enter Location"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-type-buy">{t.PropertyType}</Label>
                    <Select>
                      <SelectTrigger id="property-type-buy">
                        <SelectValue placeholder="Select Type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">{t.Apartment}</SelectItem>
                        <SelectItem value="house">{t.House}</SelectItem>
                        <SelectItem value="villa">{t.Villa}</SelectItem>
                        <SelectItem value="plot">{t.Plot}</SelectItem>
                        <SelectItem value="commercial">{t.Commercial}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget-buy">{t.Budget}</Label>
                    <Select>
                      <SelectTrigger id="budget-buy">
                        <SelectValue placeholder="Select Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000000">{t.UndertenLakhs}</SelectItem>
                        <SelectItem value="2500000">{t.tentwentyfiveLakhs}</SelectItem>
                        <SelectItem value="5000000">{t.twentyfiftyLakhs}</SelectItem>
                        <SelectItem value="10000000">{t.fiftyoneCrore}</SelectItem>
                        <SelectItem value="20000000">{t.AboveoneCrore}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-auto">
                    <Search className="h-4 w-4 mr-2" />
                    {t.Search}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location-sell">{t.Location}</Label>
                    <Input id="location-sell" placeholder="Enter Location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-type-sell">{t.PropertyType}</Label>
                    <Select>
                      <SelectTrigger id="property-type-sell">
                        <SelectValue placeholder="Select Type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">{t.Apartment}</SelectItem>
                        <SelectItem value="house">{t.House}</SelectItem>
                        <SelectItem value="villa">{t.Villa}</SelectItem>
                        <SelectItem value="plot">{t.Plot}</SelectItem>
                        <SelectItem value="commercial">{t.Commercial}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Button className="w-full">{t.ListYourProperty}</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}