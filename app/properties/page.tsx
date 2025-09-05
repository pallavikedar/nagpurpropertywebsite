// "use client"
// import { Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
// import PropertyCard from "@/components/property-card"
// import { LanguageProvider, useLanguage } from "@/context/language-context"
// import { properties } from "@/lib/data"
// export default function PropertiesPage(){
// return(
//   <LanguageProvider>
//         <Propertiesdash/>
//   </LanguageProvider>
// )
// }
//  function Propertiesdash() {
//   const {translations } = useLanguage()
//   const t = translations
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <section className="bg-muted py-12">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold tracking-tight">{t.Properties}</h1>
//                 <p className="text-muted-foreground">{t.Browseourlistingstofindyourperfectproperty}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Input placeholder="Search properties..." className="w-full md:w-auto min-w-[200px]" />
//                 <Button variant="outline" size="icon">
//                   <Filter className="h-4 w-4" />
//                   <span className="sr-only">{t.Filter}</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-12 px-4 md:px-6">
//           <div className="container">
//             <div className="flex flex-col md:flex-row gap-8">
//               {/* Filters Sidebar */}
//               <div className="w-full md:w-64 shrink-0">
//                 <div className="sticky top-20 space-y-6">
//                   <div>
//                     <h3 className="font-semibold mb-4">{t.PropertyType}</h3>
//                     <div className="space-y-2">
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.Apartment}</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.House}</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.Villa}</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.Plot}</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.Commercial}</span>
//                       </label>
//                     </div>
//                   </div>

//                   <Separator/>

//                   <div>
//                     <h3 className="font-semibold mb-4">{t.PriceRange}</h3>
//                     <div className="grid grid-cols-2 gap-2">
//                       <Input placeholder="Min" type="number" />
//                       <Input placeholder="Max" type="number" />
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <h3 className="font-semibold mb-4">{t.Bedrooms}</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {[1, 2, 3, 4, "5+"].map((num) => (
//                         <Button key={num} variant="outline" size="sm" className="min-w-[40px]">
//                           {num}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <h3 className="font-semibold mb-4">{t.PropertyStatus}</h3>
//                     <div className="space-y-2">
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.ForSell}</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                         />
//                         <span>{t.ForRent}</span>
//                       </label>
//                     </div>
//                   </div>

//                   <Button className="w-full">{t.ApplyFilters}</Button>
//                 </div>
//               </div>

//               {/* Property Listings */}
//               <div className="flex-1">
//                 <div className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
//                  <PropertyCard/>
//                 </div>

//                 <div className="flex justify-center mt-12">
//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="icon" disabled>
//                       &lt;
//                     </Button>
//                     <Button variant="default" size="icon">
//                       1
//                     </Button>
//                     <Button variant="outline" size="icon">
//                       2
//                     </Button>
//                     <Button variant="outline" size="icon">
//                       3
//                     </Button>
//                     <Button variant="outline" size="icon">
//                       &gt;
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   )
// }

"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { useLanguage, LanguageProvider} from "@/context/language-context";
import { properties } from "@/lib/data";


export default function PropertiesPage() {
  return <Propertiesdash />
   
 
}

function Propertiesdash() {
  const { translations } = useLanguage(); // Use the client-side hook
  const t = translations;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t.Properties}</h1>
                <p className="text-muted-foreground">{t.Browseourlistingstofindyourperfectproperty}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Search Properties" className="w-full md:w-auto min-w-[200px]" />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">{t.Filter}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="w-full md:w-64 shrink-0">
                <div className="sticky top-20 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">{t.PropertyType}</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.Apartment}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.House}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.Villa}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.Plot}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.Commercial}</span>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">{t.PriceRange}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Min" type="number" />
                      <Input placeholder="Max" type="number" />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">{t.Bedrooms}</h3>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, "5+"].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="min-w-[40px]">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">{t.PropertyStatus}</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.ForSell}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t.ForRent}</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full">{t.ApplyFilters}</Button>
                </div>
              </div>

              {/* Property Listings */}
              <div className="flex-1">
               
                  <PropertyCard />
                

                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" disabled>
                      &lt;
                    </Button>
                    <Button variant="default" size="icon">
                      1
                    </Button>
                    <Button variant="outline" size="icon">
                      2
                    </Button>
                    <Button variant="outline" size="icon">
                      3
                    </Button>
                    <Button variant="outline" size="icon">
                      &gt;
                    </Button>
                  </div>
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