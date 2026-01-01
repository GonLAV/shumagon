import { israelGovAPI, type MarketTransactionData } from './israelGovAPI'
import { transactionImporter, type ImportedTransaction, type ImportConfig } from './transactionImporter'

export interface MarketDataSyncConfig {
  id: string
  enabled: boolean
  syncInterval: 'realtime' | 'hourly' | 'daily' | 'weekly'
  lastSync?: string
  nextSync?: string
  regions: Array<{
    name: string
    nameHe: string
    coordinates: {
      latitude: number
      longitude: number
    }
    radiusKm: number
  }>
  filters: {
    propertyTypes?: string[]
    minPrice?: number
    maxPrice?: number
    verifiedOnly: boolean
  }
  autoEnrichProperties: boolean
  notifyOnNewData: boolean
}

export interface SyncResult {
  id: string
  timestamp: string
  configId: string
  status: 'success' | 'partial' | 'failed'
  totalFetched: number
  newRecords: number
  updated: number
  errors: number
  errorMessages?: string[]
  duration: number
  regionsProcessed: number
  dataQuality: {
    verified: number
    unverified: number
    complete: number
    incomplete: number
  }
}

export interface EnrichedMarketTransaction extends MarketTransactionData {
  enrichmentData?: {
    planningStatus?: string
    zoningDesignation?: string
    buildingRights?: {
      far: number
      floors: number
    }
    taxAssessment?: number
    municipalData?: {
      neighborhood: string
      statisticalArea: string
    }
    gisData?: {
      elevation: number
      viewQuality: string
    }
  }
  relevanceScore?: number
  comparabilityFactors?: {
    locationSimilarity: number
    sizeSimilarity: number
    ageSimilarity: number
    conditionSimilarity: number
    overallScore: number
  }
}

export interface MarketDataCache {
  region: string
  lastUpdate: string
  transactions: EnrichedMarketTransaction[]
  statistics: {
    avgPricePerSqm: number
    medianPricePerSqm: number
    minPricePerSqm: number
    maxPricePerSqm: number
    totalTransactions: number
    transactionsByMonth: Record<string, number>
    pricePerSqmByPropertyType: Record<string, number>
  }
  trends: {
    priceChange3Months: number
    priceChange6Months: number
    priceChange12Months: number
    volumeChange: number
  }
}

class MarketDataSyncEngine {
  private syncInProgress: Set<string> = new Set()

  async performSync(config: MarketDataSyncConfig): Promise<SyncResult> {
    const startTime = Date.now()
    const syncId = `SYNC-${Date.now()}`

    if (this.syncInProgress.has(config.id)) {
      throw new Error('Sync already in progress for this configuration')
    }

    this.syncInProgress.add(config.id)

    const result: SyncResult = {
      id: syncId,
      timestamp: new Date().toISOString(),
      configId: config.id,
      status: 'success',
      totalFetched: 0,
      newRecords: 0,
      updated: 0,
      errors: 0,
      errorMessages: [],
      duration: 0,
      regionsProcessed: 0,
      dataQuality: {
        verified: 0,
        unverified: 0,
        complete: 0,
        incomplete: 0
      }
    }

    try {
      for (const region of config.regions) {
        try {
          const transactions = await israelGovAPI.fetchMarketTransactions(
            region.coordinates.latitude,
            region.coordinates.longitude,
            region.radiusKm,
            12
          )

          result.totalFetched += transactions.length

          const filteredTransactions = this.applyFilters(transactions, config.filters)

          result.newRecords += filteredTransactions.length

          for (const transaction of filteredTransactions) {
            if (transaction.verified) {
              result.dataQuality.verified++
            } else {
              result.dataQuality.unverified++
            }

            if (this.isTransactionComplete(transaction)) {
              result.dataQuality.complete++
            } else {
              result.dataQuality.incomplete++
            }
          }

          result.regionsProcessed++
        } catch (error) {
          result.errors++
          result.errorMessages?.push(
            `שגיאה באזור ${region.nameHe}: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`
          )
        }
      }

      if (result.errors > 0) {
        result.status = result.newRecords > 0 ? 'partial' : 'failed'
      }
    } catch (error) {
      result.status = 'failed'
      result.errors++
      result.errorMessages?.push(error instanceof Error ? error.message : 'שגיאה כללית')
    } finally {
      this.syncInProgress.delete(config.id)
      result.duration = Date.now() - startTime
    }

    return result
  }

  private applyFilters(
    transactions: MarketTransactionData[],
    filters: MarketDataSyncConfig['filters']
  ): MarketTransactionData[] {
    return transactions.filter(transaction => {
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(transaction.propertyType)) return false
      }

      if (filters.minPrice && transaction.price < filters.minPrice) return false
      if (filters.maxPrice && transaction.price > filters.maxPrice) return false

      if (filters.verifiedOnly && !transaction.verified) return false

      return true
    })
  }

  private isTransactionComplete(transaction: MarketTransactionData): boolean {
    return !!(
      transaction.address &&
      transaction.price > 0 &&
      transaction.area > 0 &&
      transaction.pricePerSqm > 0 &&
      transaction.transactionDate &&
      transaction.propertyType
    )
  }

  async enrichTransactionData(
    transaction: MarketTransactionData,
    referenceProperty?: {
      address: string
      area: number
      age: number
      condition: string
    }
  ): Promise<EnrichedMarketTransaction> {
    const enriched: EnrichedMarketTransaction = { ...transaction }

    try {
      const [planning, taxData, municipal, gis] = await Promise.allSettled([
        israelGovAPI.fetchPlanningData(transaction.address),
        israelGovAPI.fetchTaxAssessmentData(transaction.transactionId),
        israelGovAPI.fetchMunicipalData(transaction.address),
        israelGovAPI.fetchGISData(32.0853, 34.7818)
      ])

      enriched.enrichmentData = {}

      if (planning.status === 'fulfilled') {
        enriched.enrichmentData.planningStatus = planning.value.statusHe
        enriched.enrichmentData.zoningDesignation = planning.value.zoningDesignationHe
        enriched.enrichmentData.buildingRights = {
          far: planning.value.buildingRights.far,
          floors: planning.value.buildingRights.heightFloors
        }
      }

      if (taxData.status === 'fulfilled') {
        enriched.enrichmentData.taxAssessment = taxData.value.taxAssessedValue
      }

      if (municipal.status === 'fulfilled') {
        enriched.enrichmentData.municipalData = {
          neighborhood: municipal.value.neighborhood,
          statisticalArea: municipal.value.statisticalArea
        }
      }

      if (gis.status === 'fulfilled') {
        enriched.enrichmentData.gisData = {
          elevation: gis.value.elevation,
          viewQuality: gis.value.viewshed.viewQuality
        }
      }

      if (referenceProperty) {
        enriched.comparabilityFactors = this.calculateComparabilityScore(
          transaction,
          referenceProperty
        )
      }
    } catch (error) {
      console.warn('Failed to enrich transaction:', error)
    }

    return enriched
  }

  private calculateComparabilityScore(
    transaction: MarketTransactionData,
    reference: {
      address: string
      area: number
      age: number
      condition: string
    }
  ) {
    const sizeSimilarity = 1 - Math.min(Math.abs(transaction.area - reference.area) / reference.area, 1)
    
    const ageSimilarity = 1 - Math.min(Math.abs(transaction.age - reference.age) / Math.max(reference.age, 1), 1)
    
    const conditionSimilarity = transaction.condition === reference.condition ? 1.0 : 0.5
    
    const locationSimilarity = 0.8

    const overallScore = (
      locationSimilarity * 0.35 +
      sizeSimilarity * 0.30 +
      ageSimilarity * 0.20 +
      conditionSimilarity * 0.15
    )

    return {
      locationSimilarity,
      sizeSimilarity,
      ageSimilarity,
      conditionSimilarity,
      overallScore
    }
  }

  async fetchTransactionsForDate(
    latitude: number,
    longitude: number,
    radiusKm: number,
    targetDate: string,
    monthsWindow: number = 6
  ): Promise<MarketTransactionData[]> {
    const allTransactions = await israelGovAPI.fetchMarketTransactions(
      latitude,
      longitude,
      radiusKm,
      monthsWindow * 2
    )

    const targetDateTime = new Date(targetDate).getTime()
    const windowMs = monthsWindow * 30 * 24 * 60 * 60 * 1000

    return allTransactions.filter(transaction => {
      const transactionTime = new Date(transaction.transactionDate).getTime()
      const timeDiff = Math.abs(transactionTime - targetDateTime)
      return timeDiff <= windowMs
    })
  }

  calculateMarketValueAtDate(
    transactions: MarketTransactionData[],
    targetDate: string,
    propertyArea: number,
    propertyType: string
  ): {
    valuePerSqm: number
    totalValue: number
    confidence: 'high' | 'medium' | 'low'
    dataPoints: number
    range: { min: number, max: number }
    median: number
  } {
    const relevantTransactions = transactions.filter(t => t.propertyType === propertyType)

    if (relevantTransactions.length === 0) {
      return {
        valuePerSqm: 0,
        totalValue: 0,
        confidence: 'low',
        dataPoints: 0,
        range: { min: 0, max: 0 },
        median: 0
      }
    }

    const pricesPerSqm = relevantTransactions.map(t => t.pricePerSqm).sort((a, b) => a - b)
    
    const median = pricesPerSqm[Math.floor(pricesPerSqm.length / 2)]
    const avg = pricesPerSqm.reduce((sum, p) => sum + p, 0) / pricesPerSqm.length
    
    const min = Math.min(...pricesPerSqm)
    const max = Math.max(...pricesPerSqm)

    const valuePerSqm = median

    let confidence: 'high' | 'medium' | 'low' = 'low'
    if (relevantTransactions.length >= 10) confidence = 'high'
    else if (relevantTransactions.length >= 5) confidence = 'medium'

    return {
      valuePerSqm,
      totalValue: valuePerSqm * propertyArea,
      confidence,
      dataPoints: relevantTransactions.length,
      range: { min, max },
      median
    }
  }

  async generateMarketReport(
    latitude: number,
    longitude: number,
    radiusKm: number,
    months: number = 12
  ): Promise<{
    summary: string
    transactions: MarketTransactionData[]
    statistics: MarketDataCache['statistics']
    trends: MarketDataCache['trends']
    insights: string[]
  }> {
    const transactions = await israelGovAPI.fetchMarketTransactions(
      latitude,
      longitude,
      radiusKm,
      months
    )

    const statistics = this.calculateStatistics(transactions)
    const trends = this.calculateTrends(transactions)
    const insights = this.generateInsights(statistics, trends)

    const summary = `
נמצאו ${transactions.length} עסקאות ב-${months} חודשים האחרונים.
מחיר ממוצע למ"ר: ₪${statistics.avgPricePerSqm.toLocaleString('he-IL')}
מחיר חציוני למ"ר: ₪${statistics.medianPricePerSqm.toLocaleString('he-IL')}
מגמת מחירים (12 חודשים): ${trends.priceChange12Months > 0 ? '+' : ''}${trends.priceChange12Months.toFixed(1)}%
    `.trim()

    return {
      summary,
      transactions,
      statistics,
      trends,
      insights
    }
  }

  private calculateStatistics(transactions: MarketTransactionData[]): MarketDataCache['statistics'] {
    if (transactions.length === 0) {
      return {
        avgPricePerSqm: 0,
        medianPricePerSqm: 0,
        minPricePerSqm: 0,
        maxPricePerSqm: 0,
        totalTransactions: 0,
        transactionsByMonth: {},
        pricePerSqmByPropertyType: {}
      }
    }

    const pricesPerSqm = transactions.map(t => t.pricePerSqm).sort((a, b) => a - b)
    
    const avgPricePerSqm = pricesPerSqm.reduce((sum, p) => sum + p, 0) / pricesPerSqm.length
    const medianPricePerSqm = pricesPerSqm[Math.floor(pricesPerSqm.length / 2)]
    const minPricePerSqm = Math.min(...pricesPerSqm)
    const maxPricePerSqm = Math.max(...pricesPerSqm)

    const transactionsByMonth = transactions.reduce((acc, t) => {
      const month = t.transactionDate.substring(0, 7)
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const pricePerSqmByPropertyType = transactions.reduce((acc, t) => {
      if (!acc[t.propertyType]) {
        const typeTransactions = transactions.filter(tx => tx.propertyType === t.propertyType)
        const avgPrice = typeTransactions.reduce((sum, tx) => sum + tx.pricePerSqm, 0) / typeTransactions.length
        acc[t.propertyType] = avgPrice
      }
      return acc
    }, {} as Record<string, number>)

    return {
      avgPricePerSqm,
      medianPricePerSqm,
      minPricePerSqm,
      maxPricePerSqm,
      totalTransactions: transactions.length,
      transactionsByMonth,
      pricePerSqmByPropertyType
    }
  }

  private calculateTrends(transactions: MarketTransactionData[]): MarketDataCache['trends'] {
    const now = new Date()
    
    const get3MonthsAgo = () => {
      const date = new Date(now)
      date.setMonth(date.getMonth() - 3)
      return date
    }

    const get6MonthsAgo = () => {
      const date = new Date(now)
      date.setMonth(date.getMonth() - 6)
      return date
    }

    const get12MonthsAgo = () => {
      const date = new Date(now)
      date.setMonth(date.getMonth() - 12)
      return date
    }

    const recent3Months = transactions.filter(t => new Date(t.transactionDate) >= get3MonthsAgo())
    const months3to6 = transactions.filter(t => {
      const date = new Date(t.transactionDate)
      return date >= get6MonthsAgo() && date < get3MonthsAgo()
    })

    const recent6Months = transactions.filter(t => new Date(t.transactionDate) >= get6MonthsAgo())
    const months6to12 = transactions.filter(t => {
      const date = new Date(t.transactionDate)
      return date >= get12MonthsAgo() && date < get6MonthsAgo()
    })

    const calcAvg = (txs: MarketTransactionData[]) => 
      txs.length > 0 ? txs.reduce((sum, t) => sum + t.pricePerSqm, 0) / txs.length : 0

    const avg3Months = calcAvg(recent3Months)
    const avg3to6Months = calcAvg(months3to6)
    const avg6Months = calcAvg(recent6Months)
    const avg6to12Months = calcAvg(months6to12)

    const priceChange3Months = avg3to6Months > 0
      ? ((avg3Months - avg3to6Months) / avg3to6Months) * 100
      : 0

    const priceChange6Months = avg6to12Months > 0
      ? ((avg6Months - avg6to12Months) / avg6to12Months) * 100
      : 0

    const priceChange12Months = priceChange6Months

    const volumeChange = months6to12.length > 0
      ? ((recent6Months.length - months6to12.length) / months6to12.length) * 100
      : 0

    return {
      priceChange3Months,
      priceChange6Months,
      priceChange12Months,
      volumeChange
    }
  }

  private generateInsights(
    statistics: MarketDataCache['statistics'],
    trends: MarketDataCache['trends']
  ): string[] {
    const insights: string[] = []

    if (trends.priceChange12Months > 5) {
      insights.push('⬆️ שוק חם - מחירים עולים בקצב מהיר')
    } else if (trends.priceChange12Months < -5) {
      insights.push('⬇️ שוק קריר - מחירים יורדים')
    } else {
      insights.push('➡️ שוק יציב - מחירים ללא שינוי משמעותי')
    }

    if (trends.volumeChange > 20) {
      insights.push('📈 פעילות עסקאות גבוהה - ביקוש חזק')
    } else if (trends.volumeChange < -20) {
      insights.push('📉 פעילות עסקאות נמוכה - ביקוש חלש')
    }

    const priceSpread = statistics.maxPricePerSqm - statistics.minPricePerSqm
    const spreadPercent = (priceSpread / statistics.avgPricePerSqm) * 100

    if (spreadPercent > 50) {
      insights.push('⚠️ שוק לא הומוגני - פערי מחירים גדולים')
    } else if (spreadPercent < 20) {
      insights.push('✅ שוק הומוגני - מחירים עקביים')
    }

    if (statistics.totalTransactions < 5) {
      insights.push('⚠️ מעט נתונים - רמת ביטחון נמוכה')
    } else if (statistics.totalTransactions >= 20) {
      insights.push('✅ נתונים מספקים - רמת ביטחון גבוהה')
    }

    return insights
  }

  async autoFetchForBettermentLevy(
    determiningDate: string,
    location: { latitude: number; longitude: number },
    radiusKm: number = 2
  ): Promise<{
    transactions: MarketTransactionData[]
    marketValue: {
      valuePerSqm: number
      confidence: 'high' | 'medium' | 'low'
      dataPoints: number
    }
    report: string
  }> {
    const transactions = await this.fetchTransactionsForDate(
      location.latitude,
      location.longitude,
      radiusKm,
      determiningDate,
      6
    )

    const marketValue = this.calculateMarketValueAtDate(
      transactions,
      determiningDate,
      100,
      'apartment'
    )

    const report = `
📅 מועד קובע: ${new Date(determiningDate).toLocaleDateString('he-IL')}
📍 רדיוס חיפוש: ${radiusKm} ק"מ
📊 נמצאו ${transactions.length} עסקאות רלוונטיות
💰 שווי שוק למ"ר: ₪${marketValue.valuePerSqm.toLocaleString('he-IL')}
🎯 רמת ביטחון: ${marketValue.confidence === 'high' ? 'גבוהה' : marketValue.confidence === 'medium' ? 'בינונית' : 'נמוכה'}
📈 טווח מחירים: ₪${marketValue.range.min.toLocaleString('he-IL')} - ₪${marketValue.range.max.toLocaleString('he-IL')}
    `.trim()

    return {
      transactions,
      marketValue: {
        valuePerSqm: marketValue.valuePerSqm,
        confidence: marketValue.confidence,
        dataPoints: marketValue.dataPoints
      },
      report
    }
  }
}

export const marketDataSync = new MarketDataSyncEngine()

export function createDefaultSyncConfig(): MarketDataSyncConfig {
  return {
    id: `SYNC-CONFIG-${Date.now()}`,
    enabled: true,
    syncInterval: 'daily',
    lastSync: undefined,
    nextSync: undefined,
    regions: [
      {
        name: 'Tel Aviv Center',
        nameHe: 'תל אביב מרכז',
        coordinates: { latitude: 32.0853, longitude: 34.7818 },
        radiusKm: 2
      },
      {
        name: 'Jerusalem Center',
        nameHe: 'ירושלים מרכז',
        coordinates: { latitude: 31.7683, longitude: 35.2137 },
        radiusKm: 2
      },
      {
        name: 'Haifa Center',
        nameHe: 'חיפה מרכז',
        coordinates: { latitude: 32.7940, longitude: 34.9896 },
        radiusKm: 2
      }
    ],
    filters: {
      propertyTypes: ['apartment'],
      minPrice: 500000,
      maxPrice: 10000000,
      verifiedOnly: true
    },
    autoEnrichProperties: true,
    notifyOnNewData: true
  }
}
