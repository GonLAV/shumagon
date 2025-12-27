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
  similarityScore?: number
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

export interface ARMeasurement {
  id: string
  type: 'distance' | 'area' | 'height' | 'volume'
  value: number
  unit: string
  points: { x: number; y: number; z?: number }[]
  timestamp: string
  createdBy: string
}

export interface ARAnnotation {
  id: string
  position: { x: number; y: number; z?: number }
  text: string
  type: 'info' | 'warning' | 'feature' | 'improvement' | 'issue' | 'question'
  timestamp: string
  createdBy: string
  replies?: ARAnnotationReply[]
}

export interface ARAnnotationReply {
  id: string
  text: string
  timestamp: string
  createdBy: string
}

export interface ARParticipant {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'appraiser' | 'client' | 'inspector' | 'viewer'
  joinedAt: string
  isActive: boolean
  cursor?: { x: number; y: number }
  color: string
}

export interface ARSession {
  id: string
  propertyId: string
  title: string
  description?: string
  type: 'solo' | 'collaborative'
  status: 'active' | 'paused' | 'completed' | 'archived'
  measurements: ARMeasurement[]
  annotations: ARAnnotation[]
  photos: ARPhoto[]
  videoRecordings: ARVideo[]
  participants: ARParticipant[]
  hostId: string
  environmentalData?: {
    light: number
    temperature: number
    humidity: number
    noise: number
    timestamp: string
  }[]
  duration: number
  startedAt: string
  completedAt?: string
  shareLink?: string
  shareCode?: string
  isPublic: boolean
  allowedViewers?: string[]
}

export interface ARPhoto {
  id: string
  dataUrl: string
  timestamp: string
  capturedBy: string
  annotations?: string[]
  environmentalData?: {
    light: number
    temperature: number
    humidity: number
    noise: number
  }
}

export interface ARVideo {
  id: string
  dataUrl: string
  duration: number
  timestamp: string
  capturedBy: string
  thumbnailUrl?: string
}
