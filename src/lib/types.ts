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

export interface Report {
  id: string
  propertyId: string
  clientId: string
  title: string
  format: 'pdf' | 'word' | 'html'
  template: 'standard' | 'detailed' | 'summary' | 'bank'
  status: 'draft' | 'pending-review' | 'completed' | 'delivered'
  sections: ReportSection[]
  appraiserName: string
  appraiserLicense: string
  generatedAt: string
  deliveredAt?: string
  downloadUrl?: string
  notes?: string
  watermark: boolean
}

export interface ReportSection {
  id: string
  title: string
  content: string
  type: 'text' | 'table' | 'chart' | 'image' | 'list'
  order: number
  required: boolean
  enabled: boolean
}

export interface UpdateRequest {
  id: string
  propertyId: string
  clientId: string
  reportId?: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-review' | 'in-progress' | 'completed' | 'rejected'
  requestedAt: string
  updatedAt: string
  completedAt?: string
  response?: string
  attachments?: string[]
  internalNotes?: string
}

export interface ClientActivity {
  id: string
  clientId: string
  type: 'login' | 'view-report' | 'download-report' | 'create-request' | 'message' | 'update-request'
  description: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface ClientPortalAccess {
  clientId: string
  email: string
  password?: string
  isActive: boolean
  lastLogin?: string
  notifications: boolean
  emailNotifications: boolean
}

export interface Invoice {
  id: string
  propertyId: string
  clientId: string
  invoiceNumber: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issueDate: string
  dueDate: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  balance: number
  paymentTerms: string
  notes?: string
  paymentMethod?: 'cash' | 'check' | 'bank-transfer' | 'credit-card'
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceLineItem {
  id: string
  description: string
  serviceType: ServiceType
  quantity: number
  unitPrice: number
  amount: number
}

export type ServiceType = 
  | 'residential-appraisal'
  | 'commercial-appraisal'
  | 'land-appraisal'
  | 'rental-appraisal'
  | 'complex-appraisal'
  | 'consultation'
  | 'site-inspection'
  | 'additional-report'
  | 'rush-fee'
  | 'travel-expenses'
  | 'other'

export interface PricingTemplate {
  id: string
  name: string
  serviceType: ServiceType
  basePrice: number
  pricePerSqm?: number
  minimumPrice?: number
  maximumPrice?: number
  description: string
  isActive: boolean
}

export interface DigitalSignature {
  id: string
  documentId: string
  documentType: 'report' | 'invoice' | 'contract'
  signedBy: string
  signerName: string
  signerLicense?: string
  signatureData: string
  timestamp: string
  ipAddress: string
  hash: string
  verified: boolean
}

export interface AuditLog {
  id: string
  entityType: 'property' | 'report' | 'invoice' | 'client'
  entityId: string
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | 'signed'
  userId: string
  userName: string
  timestamp: string
  changes?: Record<string, { before: any; after: any }>
  metadata?: Record<string, any>
}
