export interface Property {
  id: string
  title: string
  description?: string
  price: number
  address: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  type: "rent" | "buy"
  category: "apartment" | "house" | "villa" | "plot" | "commercial"
  ownerName: string
  featured?: boolean
}
