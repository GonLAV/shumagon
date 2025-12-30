import type { Property, Comparable, PropertyCondition } from './types'

export interface ValuationResult {
  method: 'comparable-sales' | 'cost-approach' | 'income-approach' | 'hybrid'
  estimatedValue: number
  valueRange: { min: number; max: number }
  confidence: number
  methodology: string
  calculations: ValuationCalculation[]
  reconciliation: string
  assumptions: string[]
  limitations: string[]
}

export interface ValuationCalculation {
  step: string
  description: string
  formula: string
  inputs: Record<string, number | string>
  result: number
}

export interface AdjustmentFactors {
  location: number
  size: number
  condition: number
  floor: number
  age: number
  features: number
}

const CONDITION_MULTIPLIERS: Record<PropertyCondition, number> = {
  'new': 1.15,
  'excellent': 1.08,
  'good': 1.00,
  'fair': 0.92,
  'poor': 0.80,
  'renovation-needed': 0.70
}

const FLOOR_ADJUSTMENTS: Record<number, number> = {
  0: -0.05,
  1: 0,
  2: 0.02,
  3: 0.03,
  4: 0.04,
  5: 0.04,
  6: 0.03,
  7: 0.02,
  8: 0.01
}

const FEATURE_VALUES = {
  elevator: 0.05,
  parking: 0.07,
  storage: 0.03,
  balcony: 0.04,
  accessible: 0.03,
  airConditioning: 0.02,
  securityDoor: 0.01,
  renovated: 0.08,
  waterHeating: 0.01
}

export class ValuationEngine {
  
  static calculateComparableSalesApproach(
    property: Property,
    comparables: Comparable[]
  ): ValuationResult {
    const selectedComps = comparables.filter(c => c.selected)
    
    if (selectedComps.length === 0) {
      throw new Error('אין נכסים להשוואה שנבחרו')
    }

    const calculations: ValuationCalculation[] = []
    
    const adjustedPrices = selectedComps.map(comp => {
      const adjustments = this.calculateAdjustments(property, comp)
      return {
        comparable: comp,
        adjustments,
        adjustedPrice: comp.salePrice * (1 + adjustments.total)
      }
    })

    const avgAdjustedPrice = adjustedPrices.reduce((sum, item) => sum + item.adjustedPrice, 0) / adjustedPrices.length
    
    calculations.push({
      step: 'ממוצע מחירים מתואמים',
      description: `ממוצע ${selectedComps.length} עסקאות דומות לאחר התאמות`,
      formula: 'Σ(מחיר עסקה × (1 + התאמות)) / מספר עסקאות',
      inputs: {
        'מספר עסקאות': selectedComps.length,
        'טווח מחירים': `₪${Math.min(...adjustedPrices.map(p => p.adjustedPrice)).toLocaleString()} - ₪${Math.max(...adjustedPrices.map(p => p.adjustedPrice)).toLocaleString()}`
      },
      result: avgAdjustedPrice
    })

    const weightedValue = this.applyWeightedReconciliation(adjustedPrices)
    
    calculations.push({
      step: 'שווי משוקלל',
      description: 'ערך סופי לאחר שקלול עסקאות לפי רלוונטיות',
      formula: 'Σ(מחיר מתואם × משקל דמיון) / Σ(משקלות)',
      inputs: {
        'משקלול': 'לפי ציון דמיון'
      },
      result: weightedValue
    })

    const finalValue = Math.round(weightedValue / 1000) * 1000
    const standardDeviation = this.calculateStandardDeviation(adjustedPrices.map(p => p.adjustedPrice))
    const valueRange = {
      min: Math.round((finalValue - standardDeviation) / 1000) * 1000,
      max: Math.round((finalValue + standardDeviation) / 1000) * 1000
    }

    const confidence = this.calculateConfidence(selectedComps, standardDeviation, avgAdjustedPrice)

    return {
      method: 'comparable-sales',
      estimatedValue: finalValue,
      valueRange,
      confidence,
      methodology: this.generateComparableMethodology(selectedComps.length, property),
      calculations,
      reconciliation: this.generateReconciliation(adjustedPrices, finalValue, confidence),
      assumptions: this.generateAssumptions('comparable-sales'),
      limitations: this.generateLimitations('comparable-sales', selectedComps.length)
    }
  }

  static calculateCostApproach(property: Property, landValue: number, constructionCostPerSqm: number): ValuationResult {
    const calculations: ValuationCalculation[] = []
    
    const buildingAge = new Date().getFullYear() - property.details.buildYear
    const effectiveAge = this.calculateEffectiveAge(buildingAge, property.details.condition)
    const economicLife = 60
    
    calculations.push({
      step: 'ערך קרקע',
      description: 'שווי הקרקע כפי שנקבע',
      formula: 'ערך קרקע',
      inputs: {
        'ערך קרקע מוערך': `₪${landValue.toLocaleString()}`
      },
      result: landValue
    })

    const buildingCost = property.details.builtArea * constructionCostPerSqm
    
    calculations.push({
      step: 'עלות בנייה',
      description: 'עלות בנייה חדשה של המבנה',
      formula: 'שטח בנוי × עלות בנייה למ"ר',
      inputs: {
        'שטח בנוי': property.details.builtArea,
        'עלות למ"ר': constructionCostPerSqm
      },
      result: buildingCost
    })

    const depreciationRate = effectiveAge / economicLife
    const depreciation = buildingCost * depreciationRate
    
    calculations.push({
      step: 'פחת',
      description: 'פחת מצטבר בגין גיל ובלאי',
      formula: '(גיל אפקטיבי / אורך חיים כלכלי) × עלות בנייה',
      inputs: {
        'גיל אפקטיבי': effectiveAge,
        'אורך חיים כלכלי': economicLife,
        'שיעור פחת': `${(depreciationRate * 100).toFixed(1)}%`
      },
      result: depreciation
    })

    const buildingValue = buildingCost - depreciation
    const totalValue = Math.round((landValue + buildingValue) / 1000) * 1000

    calculations.push({
      step: 'שווי כולל',
      description: 'ערך קרקע + ערך מבנה לאחר פחת',
      formula: 'ערך קרקע + (עלות בנייה - פחת)',
      inputs: {
        'ערך קרקע': landValue,
        'ערך מבנה': buildingValue
      },
      result: totalValue
    })

    const valueRange = {
      min: Math.round(totalValue * 0.90 / 1000) * 1000,
      max: Math.round(totalValue * 1.10 / 1000) * 1000
    }

    return {
      method: 'cost-approach',
      estimatedValue: totalValue,
      valueRange,
      confidence: 75,
      methodology: this.generateCostMethodology(property, landValue, constructionCostPerSqm),
      calculations,
      reconciliation: `שווי הנכס נקבע בשיטת העלות, המתבססת על ערך הקרקע בתוספת עלות בנייה חלופית בניכוי פחת. המבנה בגיל ${buildingAge} שנים (גיל אפקטיבי ${effectiveAge} שנים) עם שיעור פחת של ${(depreciationRate * 100).toFixed(1)}%.`,
      assumptions: this.generateAssumptions('cost-approach'),
      limitations: this.generateLimitations('cost-approach', 0)
    }
  }

  static calculateIncomeApproach(
    property: Property,
    monthlyRent: number,
    vacancyRate: number = 0.05,
    operatingExpenseRatio: number = 0.30,
    capitalizationRate: number = 0.05
  ): ValuationResult {
    const calculations: ValuationCalculation[] = []
    
    const annualGrossIncome = monthlyRent * 12
    
    calculations.push({
      step: 'הכנסה ברוטו שנתית',
      description: 'הכנסת שכירות צפויה לשנה',
      formula: 'שכירות חודשית × 12',
      inputs: {
        'שכירות חודשית': monthlyRent
      },
      result: annualGrossIncome
    })

    const vacancyLoss = annualGrossIncome * vacancyRate
    const effectiveGrossIncome = annualGrossIncome - vacancyLoss
    
    calculations.push({
      step: 'הכנסה אפקטיבית',
      description: 'הכנסה ברוטו בניכוי אובדן פינויים',
      formula: 'הכנסה ברוטו × (1 - שיעור פינויים)',
      inputs: {
        'הכנסה ברוטו': annualGrossIncome,
        'שיעור פינויים': `${(vacancyRate * 100)}%`
      },
      result: effectiveGrossIncome
    })

    const operatingExpenses = effectiveGrossIncome * operatingExpenseRatio
    const netOperatingIncome = effectiveGrossIncome - operatingExpenses
    
    calculations.push({
      step: 'הכנסה תפעולית נטו (NOI)',
      description: 'הכנסה אפקטיבית בניכוי הוצאות תפעול',
      formula: 'הכנסה אפקטיבית × (1 - יחס הוצאות)',
      inputs: {
        'הכנסה אפקטיבית': effectiveGrossIncome,
        'יחס הוצאות': `${(operatingExpenseRatio * 100)}%`,
        'הוצאות שנתיות': operatingExpenses
      },
      result: netOperatingIncome
    })

    const estimatedValue = Math.round((netOperatingIncome / capitalizationRate) / 1000) * 1000
    
    calculations.push({
      step: 'שווי לפי היוון',
      description: 'ערך הנכס על בסיס הכנסה והיוון',
      formula: 'NOI / שיעור היוון',
      inputs: {
        'NOI': netOperatingIncome,
        'שיעור היוון': `${(capitalizationRate * 100)}%`
      },
      result: estimatedValue
    })

    const valueRange = {
      min: Math.round((netOperatingIncome / (capitalizationRate + 0.005)) / 1000) * 1000,
      max: Math.round((netOperatingIncome / (capitalizationRate - 0.005)) / 1000) * 1000
    }

    const yieldPercent = (netOperatingIncome / estimatedValue * 100).toFixed(2)

    return {
      method: 'income-approach',
      estimatedValue,
      valueRange,
      confidence: 80,
      methodology: this.generateIncomeMethodology(monthlyRent, capitalizationRate, vacancyRate),
      calculations,
      reconciliation: `שווי הנכס נקבע בשיטת ההיוון המבוססת על הכנסה מהשכרה. תשואה צפויה של ${yieldPercent}% בשיעור היוון של ${(capitalizationRate * 100)}%. הכנסה תפעולית נטו שנתית של ₪${netOperatingIncome.toLocaleString()}.`,
      assumptions: this.generateAssumptions('income-approach'),
      limitations: this.generateLimitations('income-approach', 0)
    }
  }

  private static calculateAdjustments(property: Property, comparable: Comparable): AdjustmentFactors & { total: number } {
    const locationAdj = this.calculateLocationAdjustment(property, comparable)
    const sizeAdj = this.calculateSizeAdjustment(property.details.builtArea, comparable.builtArea)
    const conditionAdj = this.calculateConditionAdjustment(property.details.condition)
    const floorAdj = this.calculateFloorAdjustment(property.details.floor, comparable.floor)
    const ageAdj = this.calculateAgeAdjustment(property.details.buildYear, new Date().getFullYear() - 20)
    const featuresAdj = this.calculateFeaturesAdjustment(property)

    const total = locationAdj + sizeAdj + conditionAdj + floorAdj + ageAdj + featuresAdj

    return {
      location: locationAdj,
      size: sizeAdj,
      condition: conditionAdj,
      floor: floorAdj,
      age: ageAdj,
      features: featuresAdj,
      total
    }
  }

  private static calculateLocationAdjustment(property: Property, comparable: Comparable): number {
    if (comparable.distance < 0.3) return 0
    if (comparable.distance < 0.5) return -0.02
    if (comparable.distance < 1.0) return -0.05
    if (comparable.distance < 2.0) return -0.08
    return -0.12
  }

  private static calculateSizeAdjustment(subjectSize: number, compSize: number): number {
    const diff = (subjectSize - compSize) / compSize
    if (Math.abs(diff) < 0.05) return 0
    return diff * 0.15
  }

  private static calculateConditionAdjustment(condition: PropertyCondition): number {
    const multiplier = CONDITION_MULTIPLIERS[condition]
    return multiplier - 1
  }

  private static calculateFloorAdjustment(subjectFloor: number, compFloor: number): number {
    const subjectAdj = FLOOR_ADJUSTMENTS[Math.min(subjectFloor, 8)] || 0
    const compAdj = FLOOR_ADJUSTMENTS[Math.min(compFloor, 8)] || 0
    return subjectAdj - compAdj
  }

  private static calculateAgeAdjustment(subjectYear: number, compYear: number): number {
    const ageDiff = Math.abs(subjectYear - compYear)
    if (ageDiff < 5) return 0
    if (ageDiff < 10) return -0.03
    if (ageDiff < 20) return -0.06
    return -0.10
  }

  private static calculateFeaturesAdjustment(property: Property): number {
    let adjustment = 0
    if (property.details.elevator) adjustment += FEATURE_VALUES.elevator
    if (property.details.parking > 0) adjustment += FEATURE_VALUES.parking * property.details.parking
    if (property.details.storage) adjustment += FEATURE_VALUES.storage
    if (property.details.balcony) adjustment += FEATURE_VALUES.balcony
    if (property.details.accessible) adjustment += FEATURE_VALUES.accessible
    return adjustment
  }

  private static calculateEffectiveAge(actualAge: number, condition: PropertyCondition): number {
    const conditionFactor = {
      'new': 0.5,
      'excellent': 0.7,
      'good': 1.0,
      'fair': 1.3,
      'poor': 1.6,
      'renovation-needed': 2.0
    }[condition]
    
    return Math.round(actualAge * conditionFactor)
  }

  private static applyWeightedReconciliation(adjustedPrices: Array<{ comparable: Comparable; adjustedPrice: number }>): number {
    const totalWeight = adjustedPrices.reduce((sum, item) => sum + (item.comparable.similarityScore || 50), 0)
    const weightedSum = adjustedPrices.reduce((sum, item) => {
      const weight = item.comparable.similarityScore || 50
      return sum + (item.adjustedPrice * weight)
    }, 0)
    
    return weightedSum / totalWeight
  }

  private static calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
    return Math.sqrt(variance)
  }

  private static calculateConfidence(comparables: Comparable[], stdDev: number, avgPrice: number): number {
    const coefficientOfVariation = (stdDev / avgPrice) * 100
    let confidence = 90
    
    if (comparables.length < 3) confidence -= 15
    if (comparables.length < 5) confidence -= 10
    if (coefficientOfVariation > 20) confidence -= 15
    if (coefficientOfVariation > 30) confidence -= 10
    
    const avgSimilarity = comparables.reduce((sum, c) => sum + (c.similarityScore || 50), 0) / comparables.length
    if (avgSimilarity < 60) confidence -= 10
    if (avgSimilarity < 50) confidence -= 10
    
    return Math.max(confidence, 40)
  }

  private static generateComparableMethodology(compCount: number, property: Property): string {
    return `שיטת ההשוואה מתבססת על ניתוח ${compCount} עסקאות דומות באזור ${property.address.neighborhood}, ${property.address.city}. העסקאות נבחרו על בסיס דמיון במאפיינים: סוג נכס, גודל, מיקום, מצב ותקופת מכירה. לכל עסקה בוצעו התאמות במקדמים מקובלים בשוק הנדל"ן לצורך השוואה מדויקת לנכס הנשוא. הערך הסופי נקבע על בסיס שקלול העסקאות לפי רמת הדמיון והרלוונטיות.`
  }

  private static generateCostMethodology(property: Property, landValue: number, costPerSqm: number): string {
    return `שיטת העלות מתבססת על הערכת שווי הקרקע (₪${landValue.toLocaleString()}) בתוספת עלות בנייה חלופית (₪${costPerSqm.toLocaleString()} למ"ר) בניכוי פחת מצטבר. השיטה מתאימה במיוחד כאשר אין מספיק עסקאות דומות או כאשר הנכס הינו ייחודי. עלויות הבנייה מבוססות על נתוני שוק עדכניים באזור ${property.address.city}.`
  }

  private static generateIncomeMethodology(monthlyRent: number, capRate: number, vacancyRate: number): string {
    return `שיטת ההיוון מתבססת על הכנסה צפויה מהשכרה (₪${monthlyRent.toLocaleString()} לחודש) בניכוי פינויים צפויים (${(vacancyRate * 100)}%) והוצאות תפעול. שיעור ההיוון (${(capRate * 100)}%) נקבע על בסיס ניתוח שוק והשוואה לנכסים דומים באזור. השיטה מתאימה לנכסים מניבים ומשקפת את תפיסת המשקיעים בשוק.`
  }

  private static generateReconciliation(adjustedPrices: Array<{ comparable: Comparable; adjustedPrice: number }>, finalValue: number, confidence: number): string {
    const prices = adjustedPrices.map(p => p.adjustedPrice)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const range = ((maxPrice - minPrice) / finalValue * 100).toFixed(1)
    
    return `לאחר ניתוח ${adjustedPrices.length} עסקאות והתאמתן לנכס הנשוא, התקבל טווח ערכים של ₪${minPrice.toLocaleString()} עד ₪${maxPrice.toLocaleString()} (סטיית ${range}%). השווי הסופי נקבע על ₪${finalValue.toLocaleString()} בשקלול העסקאות הרלוונטיות ביותר. רמת הביטחון בשומה: ${confidence}%.`
  }

  private static generateAssumptions(method: string): string[] {
    const common = [
      'השומה מבוססת על מצב הנכס במועד הבדיקה',
      'השומה מניחה שימוש חוקי ותקין בנכס',
      'לא בוצע בדיקה מבנית מעמיקה',
      'הנתונים התקבלו מהמזמין והם נכונים למיטב ידיעתו'
    ]

    const specific: Record<string, string[]> = {
      'comparable-sales': [
        'העסקאות שנבחרו משקפות את תנאי השוק הרלוונטיים',
        'ההתאמות בוצעו על בסיס ניתוח שוק ונתונים היסטוריים'
      ],
      'cost-approach': [
        'עלויות הבנייה מבוססות על נתוני שוק עדכניים',
        'שיעור הפחת משקף את מצב הנכס ואורך החיים הכלכלי הצפוי'
      ],
      'income-approach': [
        'דמי השכירות משקפים שוק שכירות פעיל ותקין',
        'ההוצאות והפינויים מבוססים על ממוצעי שוק'
      ]
    }

    return [...common, ...(specific[method] || [])]
  }

  private static generateLimitations(method: string, compCount: number): string[] {
    const limitations = [
      'השומה תקפה למועד הקובע בלבד ואינה מתחשבת בשינויים עתידיים',
      'השומה מתייחסת לנכס כפי שהוא ואינה כוללת שיפורים עתידיים',
      'השווי עשוי להשתנות בהתאם לתנאי השוק ולמצב הכלכלי'
    ]

    if (method === 'comparable-sales' && compCount < 5) {
      limitations.push('מספר העסקאות הדומות מוגבל, מומלץ להשלים בשיטת שומה נוספת')
    }

    if (method === 'cost-approach') {
      limitations.push('שיטת העלות אינה משקפת בהכרח את המחיר בשוק החופשי')
    }

    if (method === 'income-approach') {
      limitations.push('התוצאה תלויה בהנחות לגבי הכנסות, הוצאות ושיעור היוון')
    }

    return limitations
  }
}
