/**
 * Nadlan.gov.il Real API Integration
 * נדל"ן - מאגר הנתונים הממשלתי למקרקעין
 * 
 * Official Government Real Estate Database
 * https://www.nadlan.gov.il
 * 
 * This provides REAL market transaction data from the official Israeli government database
 */

export interface NadlanTransaction {
  // פרטי עסקה
  dealId: string
  dealDate: string
  dealAmount: number
  pricePerMeter: number
  
  // פרטי נכס
  propertyType: string // דירה, משרד, מגרש, וכו׳
  rooms: number
  area: number
  floor?: number
  
  // מיקום
  city: string
  street: string
  houseNumber?: string
  neighborhood?: string
  gush?: string
  helka?: string
  
  // פרטים נוספים
  buildYear?: number
  parking?: boolean
  elevator?: boolean
  balcony?: boolean
  renovated?: boolean
  
  // סטטוס
  verified: boolean
  dealType: 'sale' | 'rent' | 'both'
  
  // קואורדינטות
  lat?: number
  lng?: number
}

export interface NadlanSearchParams {
  city?: string
  street?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  fromDate?: string
  toDate?: string
  gush?: string
  helka?: string
  radius?: number // km
  lat?: number
  lng?: number
}

export class NadlanGovAPI {
  private baseURL = 'https://www.nadlan.gov.il/api'
  private timeout = 15000
  
  // Nadlan.gov.il is public but has rate limiting
  private rateLimitDelay = 500
  private lastRequestTime = 0

  /**
   * חיפוש עסקאות לפי פרמטרים
   */
  async searchTransactions(params: NadlanSearchParams): Promise<NadlanTransaction[]> {
    try {
      await this.respectRateLimit()
      
      console.log('[Nadlan] Searching transactions with params:', params)
      
      // Build query parameters
      const queryParams = new URLSearchParams()
      
      if (params.city) queryParams.append('city', params.city)
      if (params.street) queryParams.append('street', params.street)
      if (params.propertyType) queryParams.append('propertyType', params.propertyType)
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())
      if (params.minArea) queryParams.append('minArea', params.minArea.toString())
      if (params.maxArea) queryParams.append('maxArea', params.maxArea.toString())
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      if (params.gush) queryParams.append('gush', params.gush)
      if (params.helka) queryParams.append('helka', params.helka)
      
      const url = `${this.baseURL}/transactions?${queryParams.toString()}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      })
      
      if (!response.ok) {
        throw new Error(`Nadlan API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Filter by radius if lat/lng provided
      let transactions = this.normalizeTransactions(data)
      
      if (params.lat && params.lng && params.radius) {
        transactions = this.filterByRadius(
          transactions,
          params.lat,
          params.lng,
          params.radius
        )
      }
      
      console.log(`[Nadlan] Found ${transactions.length} transactions`)
      return transactions
      
    } catch (error) {
      console.error('[Nadlan] Search failed:', error)
      throw new Error(`נכשל בשליפת נתונים מנדל"ן: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  /**
   * קבלת עסקאות לפי גוש וחלקה
   */
  async getTransactionsByParcel(gush: string, helka: string): Promise<NadlanTransaction[]> {
    return this.searchTransactions({ gush, helka })
  }

  /**
   * קבלת עסקאות לפי כתובת
   */
  async getTransactionsByAddress(city: string, street: string, houseNumber?: string): Promise<NadlanTransaction[]> {
    const params: NadlanSearchParams = {
      city,
      street
    }
    return this.searchTransactions(params)
  }

  /**
   * קבלת עסקאות ברדיוס ממיקום
   */
  async getTransactionsNearby(lat: number, lng: number, radius: number, filters?: Partial<NadlanSearchParams>): Promise<NadlanTransaction[]> {
    return this.searchTransactions({
      ...filters,
      lat,
      lng,
      radius
    })
  }

  /**
   * חישוב שווי שוק ממוצע לפי עסקאות
   */
  calculateMarketValue(transactions: NadlanTransaction[], targetArea: number): {
    averagePrice: number
    medianPrice: number
    minPrice: number
    maxPrice: number
    avgPricePerSqm: number
    estimatedValue: number
    transactionCount: number
    confidence: 'high' | 'medium' | 'low'
  } {
    if (transactions.length === 0) {
      throw new Error('אין עסקאות לחישוב')
    }

    const prices = transactions.map(t => t.pricePerMeter).sort((a, b) => a - b)
    const sum = prices.reduce((acc, p) => acc + p, 0)
    const avgPricePerSqm = sum / prices.length
    const medianPrice = prices[Math.floor(prices.length / 2)]
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    const estimatedValue = avgPricePerSqm * targetArea

    // Determine confidence based on number of transactions
    let confidence: 'high' | 'medium' | 'low'
    if (transactions.length >= 10) {
      confidence = 'high'
    } else if (transactions.length >= 5) {
      confidence = 'medium'
    } else {
      confidence = 'low'
    }

    return {
      averagePrice: Math.round(avgPricePerSqm),
      medianPrice: Math.round(medianPrice),
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      avgPricePerSqm: Math.round(avgPricePerSqm),
      estimatedValue: Math.round(estimatedValue),
      transactionCount: transactions.length,
      confidence
    }
  }

  /**
   * Rate limiting
   */
  private async respectRateLimit() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest))
    }
    
    this.lastRequestTime = Date.now()
  }

  /**
   * Normalize API response to standard format
   */
  private normalizeTransactions(apiData: any): NadlanTransaction[] {
    if (!apiData || !Array.isArray(apiData.transactions)) {
      return []
    }

    return apiData.transactions.map((item: any) => ({
      dealId: item.deal_id || item.dealId || String(Math.random()),
      dealDate: item.deal_date || item.dealDate || new Date().toISOString().split('T')[0],
      dealAmount: Number(item.deal_amount || item.dealAmount || item.price || 0),
      pricePerMeter: Number(item.price_per_meter || item.pricePerMeter || item.price_sqm || 0),
      
      propertyType: item.property_type || item.propertyType || item.asset_type || 'דירה',
      rooms: Number(item.rooms || item.room_count || 0),
      area: Number(item.area || item.net_area || item.size || 0),
      floor: item.floor ? Number(item.floor) : undefined,
      
      city: item.city || item.settlement_name || '',
      street: item.street || item.street_name || '',
      houseNumber: item.house_number || item.houseNumber,
      neighborhood: item.neighborhood || item.district,
      gush: item.gush || item.parcel_gush,
      helka: item.helka || item.parcel_helka,
      
      buildYear: item.build_year || item.buildYear ? Number(item.build_year || item.buildYear) : undefined,
      parking: item.parking === true || item.parking === 1,
      elevator: item.elevator === true || item.elevator === 1,
      balcony: item.balcony === true || item.balcony === 1,
      renovated: item.renovated === true || item.renovated === 1,
      
      verified: item.verified === true || item.verified === 1,
      dealType: item.deal_type || item.dealType || 'sale',
      
      lat: item.lat || item.latitude ? Number(item.lat || item.latitude) : undefined,
      lng: item.lng || item.longitude ? Number(item.lng || item.longitude) : undefined
    }))
  }

  /**
   * Filter transactions by radius from point
   */
  private filterByRadius(
    transactions: NadlanTransaction[],
    lat: number,
    lng: number,
    radiusKm: number
  ): NadlanTransaction[] {
    return transactions.filter(t => {
      if (!t.lat || !t.lng) return false
      const distance = this.calculateDistance(lat, lng, t.lat, t.lng)
      return distance <= radiusKm
    })
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Radius of Earth in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLng = this.deg2rad(lng2 - lng1)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

// Export singleton instance
export const nadlanAPI = new NadlanGovAPI()
