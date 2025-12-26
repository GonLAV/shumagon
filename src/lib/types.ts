export type PropertyType = 'apartment' | 'house' | 'penthouse' | 'garden-apartment' | 'duplex' | 'studio' | 'commercial' | 'land'
export type PropertyStatus = 'draft' | 'in-progress' | 'completed' | 'sent'
export type PropertyCondition = 'new' | 'excellent' | 'good' | 'fair' | 'poor' | 'renovation-needed'
export type ValuationMethod = 'comparable-sales' | 'cost-approach' | 'income-approach'

export interface Property {
  id: string
  clientId: string
  status: PropertyStatus
  address: {
    street: string
    city: string
    neighborhood: string
    postalCode: string
  }
  type: PropertyType
  details: {
    builtArea: number
    totalArea?: number
    rooms: number
    bedrooms: number
    bathrooms: number
    floor: number
    totalFloors: number
    buildYear: number
    condition: PropertyCondition
    parking: number
    storage: boolean
    balcony: boolean
    elevator: boolean
    accessible: boolean
  }
  features: string[]
  description: string
  photos: string[]
  createdAt: string
  updatedAt: string
  valuationData?: {
    estimatedValue: number
    valueRange: { min: number; max: number }
    confidence: number
    method: ValuationMethod
    comparables: string[]
    notes: string
  }
}

export interface Comparable {
  id: string
  address: string
  type: PropertyType
  salePrice: number
  saleDate: string
  builtArea: number
  rooms: number
  floor: number
  distance: number
  adjustments: {
    location: number
    size: number
    condition: number
    floor: number
    age: number
    features: number
    total: number
  }
  adjustedPrice: number
  pricePerSqm: number
  selected: boolean
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  avatar?: string
  properties: string[]
  notes: string
  createdAt: string
}

export interface MarketTrend {
  period: string
  avgPrice: number
  avgPricePerSqm: number
  sales: number
  avgDaysOnMarket: number
}

export interface NeighborhoodData {
  name: string
  schools: Array<{ name: string; distance: number; rating: number }>
  amenities: Array<{ name: string; type: string; distance: number }>
  transit: Array<{ name: string; type: string; distance: number }>
  demographics?: {
    population: number
    avgAge: number
    avgIncome: number
  }
}
