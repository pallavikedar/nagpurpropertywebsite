import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function Footer() {
  const { translations } = useLanguage()
  const t = translations
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t.appName}</h3>
            <p className="text-gray-400 mb-4">
              {t.YourtrustedpartnerforrealestatesolutionsinNagpurWehelpyoufindbuysellandrentpropertieswithease}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">{t.Facebook}</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">{t.Twitter}</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">{t.Instagram}</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t.QuickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  {t.Properties}
                </Link>
              </li>
              <li>
                <Link href="/add-property" className="text-gray-400 hover:text-white transition-colors">
                 {t.AddProperty}
                </Link>
              </li>
              <li>
                <Link href="/enquiry/legal" className="text-gray-400 hover:text-white transition-colors">
                  {t.LegalConsultancy}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t.Contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t.PropertyTypes}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?category=residential"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.Residential}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?category=commercial"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                {t.Commercial}
                </Link>
              </li>
              <li>
                <Link href="/properties?category=land" className="text-gray-400 hover:text-white transition-colors">
                  {t.LandPlots}
                </Link>
              </li>
              <li>
                <Link href="/properties?type=rent" className="text-gray-400 hover:text-white transition-colors">
                 {t.RentalProperties}
                </Link>
              </li>
              <li>
                <Link href="/properties?type=buy" className="text-gray-400 hover:text-white transition-colors">
                 {t.PropertiesforSale}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t.ContactUs}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">{t.addtress}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">{t.mbnumber}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">{t.mail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {t.footer}</p>
        </div>
      </div>
    </footer>
  )
}
