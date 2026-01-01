export const DATA_GOV_IL_BASE_URL = "https://data.gov.il/api/3/action/datastore_search"
export const NADLAN_RESOURCE_ID = "8f714b7f-c35c-4b40-a0e7-547b675eee0e"

export interface RawTransaction {
  _id?: number
  dealAmount?: string | number
  dealDate?: string
  assetType?: string
  city?: string
  street?: string
  houseNumber?: string | number
  area?: string | number
  rooms?: string | number
  floor?: string | number
  dealNature?: string
  propertyStatus?: string
  [key: string]: any
}

export interface CleanTransaction {
  id: string
  price: number
  pricePerSqm: number
  area: number
  date: string
  city: string
  street: string
  houseNumber: string
  floor: number
  rooms: number
  assetType: string
  dealNature: string
  propertyStatus: string
  dataSource: 'data.gov.il'
  verified: boolean
}

export interface ValuationResult {
  estimatedValue: number
  pricePerSqm: number
  valueRange: {
    min: number
    max: number
  }
  sampleSize: number
  confidence: 'low' | 'medium' | 'high'
  method: 'comparative' | 'income' | 'cost'
  calculationDate: string
  dataQuality: number
}

export async function fetchTransactionsFromDataGov(params: {
  city: string
  street?: string
  limit?: number
  offset?: number
}): Promise<RawTransaction[]> {
  const { city, street, limit = 100, offset = 0 } = params

  try {
    const filters: Record<string, string> = {
      city: city
    }
    
    if (street) {
      filters.street = street
    }

    const url = new URL(DATA_GOV_IL_BASE_URL)
    url.searchParams.append('resource_id', NADLAN_RESOURCE_ID)
    url.searchParams.append('limit', limit.toString())
    url.searchParams.append('offset', offset.toString())
    url.searchParams.append('filters', JSON.stringify(filters))

    console.log('[DataGov API] Fetching from:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Data.gov.il API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error('API returned success: false')
    }

    const records = data.result?.records || []
    console.log(`[DataGov API] Fetched ${records.length} raw transactions`)
    
    return records

  } catch (error) {
    console.error('[DataGov API] Fetch error:', error)
    throw error
  }
}

export function normalizeTransactions(rawRecords: RawTransaction[]): CleanTransaction[] {
  const cleaned: CleanTransaction[] = []

  for (const record of rawRecords) {
    const price = parseNumber(record.dealAmount)
    const area = parseNumber(record.area)

    if (!price || !area || price <= 0 || area <= 0) {
      continue
    }

    const pricePerSqm = price / area

    if (pricePerSqm < 1000 || pricePerSqm > 200000) {
      continue
    }

    cleaned.push({
      id: record._id?.toString() || generateId(),
      price,
      pricePerSqm,
      area,
      date: record.dealDate || new Date().toISOString().split('T')[0],
      city: String(record.city || ''),
      street: String(record.street || ''),
      houseNumber: String(record.houseNumber || ''),
      floor: parseNumber(record.floor) || 0,
      rooms: parseNumber(record.rooms) || 0,
      assetType: String(record.assetType || 'דירה'),
      dealNature: String(record.dealNature || 'רגיל'),
      propertyStatus: String(record.propertyStatus || 'חדש'),
      dataSource: 'data.gov.il',
      verified: true
    })
  }

  console.log(`[DataGov API] Normalized: ${rawRecords.length} → ${cleaned.length} valid transactions`)
  
  return cleaned
}

export function calculateBasicValuation(
  transactions: CleanTransaction[],
  targetArea: number
): ValuationResult {
  if (transactions.length === 0) {
    throw new Error('No transactions available for valuation')
  }

  const pricesPerSqm = transactions.map(t => t.pricePerSqm)
  
  const avgPricePerSqm = average(pricesPerSqm)
  const medianPricePerSqm = median(pricesPerSqm)
  const stdDev = standardDeviation(pricesPerSqm)

  const estimatedPricePerSqm = medianPricePerSqm
  const estimatedValue = Math.round(estimatedPricePerSqm * targetArea)

  const minValue = Math.round((estimatedPricePerSqm - stdDev) * targetArea)
  const maxValue = Math.round((estimatedPricePerSqm + stdDev) * targetArea)

  const confidence = determineConfidence(transactions.length, stdDev / avgPricePerSqm)
  const dataQuality = calculateDataQuality(transactions)

  return {
    estimatedValue,
    pricePerSqm: Math.round(estimatedPricePerSqm),
    valueRange: {
      min: minValue,
      max: maxValue
    },
    sampleSize: transactions.length,
    confidence,
    method: 'comparative',
    calculationDate: new Date().toISOString(),
    dataQuality
  }
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function average(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}

function median(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

function standardDeviation(numbers: number[]): number {
  const avg = average(numbers)
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2))
  const avgSquareDiff = average(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

function determineConfidence(
  sampleSize: number,
  coefficientOfVariation: number
): 'low' | 'medium' | 'high' {
  if (sampleSize < 5 || coefficientOfVariation > 0.3) return 'low'
  if (sampleSize < 10 || coefficientOfVariation > 0.15) return 'medium'
  return 'high'
}

function calculateDataQuality(transactions: CleanTransaction[]): number {
  let score = 0
  const total = transactions.length

  const hasRooms = transactions.filter(t => t.rooms > 0).length
  const hasFloor = transactions.filter(t => t.floor !== 0).length
  const hasStreet = transactions.filter(t => t.street.length > 0).length

  score += (hasRooms / total) * 30
  score += (hasFloor / total) * 30
  score += (hasStreet / total) * 40

  return Math.round(score)
}

function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function performCompleteValuation(params: {
  city: string
  street?: string
  targetArea: number
  propertyDetails?: {
    rooms?: number
    floor?: number
    assetType?: string
  }
}): Promise<{
  valuation: ValuationResult
  transactions: CleanTransaction[]
  rawData: RawTransaction[]
}> {
  console.log('[DataGov Valuation] Starting complete valuation:', params)

  const rawData = await fetchTransactionsFromDataGov({
    city: params.city,
    street: params.street,
    limit: 100
  })

  const transactions = normalizeTransactions(rawData)

  if (transactions.length === 0) {
    throw new Error('לא נמצאו עסקאות מתאימות לנכס זה. נסה להרחיב את קריטריוני החיפוש.')
  }

  const valuation = calculateBasicValuation(transactions, params.targetArea)

  console.log('[DataGov Valuation] Complete:', {
    sampleSize: transactions.length,
    estimatedValue: valuation.estimatedValue,
    confidence: valuation.confidence
  })

  return {
    valuation,
    transactions,
    rawData
  }
}

export function generateAppraisalPrompt(params: {
  propertyDetails: {
    city: string
    street: string
    area: number
    rooms?: number
    floor?: number
    assetType?: string
  }
  transactions: CleanTransaction[]
  valuationResult: ValuationResult
}): string {
  const { propertyDetails, transactions, valuationResult } = params

  return `אתה שמאי מקרקעין מוסמך בישראל עם ניסיון של 15 שנה.

קיבלת משימה להעריך שווי נכס על בסיס נתונים אמיתיים ממאגר data.gov.il.

**כללים חשובים:**
- אל תשתמש בידע חיצוני או נתונים שלא סופקו
- אל תנחש מחירים או תעשה הנחות
- הסבר כל שלב בצורה מפורטת ומקצועית
- ציין את המגבלות והאי-ודאויות

**פרטי הנכס הנשום:**
- כתובת: ${propertyDetails.street}, ${propertyDetails.city}
- שטח: ${propertyDetails.area} מ"ר
${propertyDetails.rooms ? `- חדרים: ${propertyDetails.rooms}` : ''}
${propertyDetails.floor ? `- קומה: ${propertyDetails.floor}` : ''}
${propertyDetails.assetType ? `- סוג: ${propertyDetails.assetType}` : ''}

**עסקאות להשוואה מ-data.gov.il (${transactions.length} עסקאות):**
${transactions.slice(0, 10).map((t, i) => `
${i + 1}. ${t.street} ${t.houseNumber}, ${t.city}
   - מחיר: ₪${t.price.toLocaleString('he-IL')}
   - מחיר למ"ר: ₪${t.pricePerSqm.toLocaleString('he-IL')}
   - שטח: ${t.area} מ"ר
   - תאריך: ${t.date}
   ${t.rooms ? `- חדרים: ${t.rooms}` : ''}
   ${t.floor ? `- קומה: ${t.floor}` : ''}
`).join('\n')}

**ניתוח סטטיסטי ראשוני:**
- הערכת שווי (חציון): ₪${valuationResult.estimatedValue.toLocaleString('he-IL')}
- מחיר למ"ר (חציון): ₪${valuationResult.pricePerSqm.toLocaleString('he-IL')}
- טווח ערכים: ₪${valuationResult.valueRange.min.toLocaleString('he-IL')} - ₪${valuationResult.valueRange.max.toLocaleString('he-IL')}
- גודל מדגם: ${valuationResult.sampleSize} עסקאות
- רמת ודאות: ${valuationResult.confidence === 'high' ? 'גבוהה' : valuationResult.confidence === 'medium' ? 'בינונית' : 'נמוכה'}

**נדרש להחזיר:**
1. **הערכת שווי סופית** - הסבר את הערכת השווי שלך והאם אתה מאמץ את החציון או מתאים אותו
2. **מחיר למ"ר מומלץ** - מה המחיר למ"ר שאתה ממליץ עליו
3. **נימוקים מקצועיים** - הסבר מפורט למה הגעת למסקנה זו, אילו עסקאות רלוונטיות יותר ולמה
4. **התאמות** - אילו התאמות צריך לעשות (קומה, מצב, מיקום וכו')
5. **רמת ודאות** - האם ההערכה בעלת ודאות נמוכה/בינונית/גבוהה ולמה
6. **המלצות להמשך** - האם יש צורך בנתונים נוספים או בדיקות

**פורמט התשובה:**
השב בעברית בפורמט מקצועי וממוקד, כ-300-500 מילים.`
}
