import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  Building, 
  Calculator as CalcIcon, 
  TrendUp, 
  FileText, 
  MapPin,
  Ruler,
  CheckCircle,
  Warning,
  Info,
  CurrencyDollar,
  ChartBar,
  FileArrowDown,
  CloudArrowDown,
  CheckCircle as CheckIcon,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  OfficeProperty, 
  OfficeComparable, 
  OfficeValuationResult,
  OfficeValuationCalculator as ValuationEngine 
} from '@/lib/calculators/officeValuationCalculator'
import { NadlanGovAPI, type NadlanTransaction } from '@/lib/nadlanGovAPI'
import { RentalYieldAnalysis } from '@/components/RentalYieldAnalysis'

export function OfficeValuationCalculator() {
  const [property, setProperty] = useState<Partial<OfficeProperty>>({
    address: '',
    city: 'תל אביב',
    area: 'מרכז',
    totalArea: 100,
    floor: 3,
    totalFloors: 10,
    condition: 'good',
    buildYear: 2015,
    hasElevator: true,
    parkingSpaces: 1,
    officeClass: 'B',
    buildingType: 'mid-rise',
    accessibility: {
      publicTransport: true,
      highway: false,
      metro: false
    },
    amenities: {
      lobby: true,
      security24: false,
      conferenceRooms: false,
      kitchenette: true,
      airConditioning: true,
      raisedFloor: false,
      dataInfrastructure: true
    },
    layout: 'mixed',
    ceilingHeight: 2.7,
    windows: 'perimeter',
    currentUse: 'owner-occupied'
  })

  const [comparables, setComparables] = useState<Partial<OfficeComparable>[]>([
    {
      id: '1',
      address: 'רחוב הארבעה 7, תל אביב',
      salePrice: 2500000,
      pricePerSqm: 25000,
      saleDate: '2024-10-15',
      area: 100,
      floor: 4,
      condition: 'excellent',
      officeClass: 'B',
      parkingSpaces: 1,
      buildYear: 2016,
      distance: 300
    },
    {
      id: '2',
      address: 'דרך מנחם בגין 23, תל אביב',
      salePrice: 3000000,
      pricePerSqm: 30000,
      saleDate: '2024-09-20',
      area: 100,
      floor: 8,
      condition: 'excellent',
      officeClass: 'A',
      parkingSpaces: 2,
      buildYear: 2020,
      distance: 800
    },
    {
      id: '3',
      address: 'רחוב קפלן 6, תל אביב',
      salePrice: 2200000,
      pricePerSqm: 22000,
      saleDate: '2024-08-10',
      area: 100,
      floor: 2,
      condition: 'good',
      officeClass: 'B',
      parkingSpaces: 1,
      buildYear: 2010,
      distance: 500
    }
  ])

  const [result, setResult] = useState<OfficeValuationResult | null>(null)
  const [calculationMethod, setCalculationMethod] = useState<'comparable-sales' | 'income-approach' | 'cost-approach'>('comparable-sales')
  const [showDetails, setShowDetails] = useState(false)
  const [isLoadingNadlan, setIsLoadingNadlan] = useState(false)
  const [nadlanTransactions, setNadlanTransactions] = useState<NadlanTransaction[]>([])
  const [showNadlanResults, setShowNadlanResults] = useState(false)

  const handleFetchNadlanTransactions = async () => {
    if (!property.city) {
      toast.error('יש להזין עיר לפני שליפת עסקאות')
      return
    }

    setIsLoadingNadlan(true)
    try {
      const nadlanAPI = new NadlanGovAPI()
      
      const searchParams = {
        city: property.city,
        street: property.address || undefined,
        propertyType: 'משרד',
        minArea: property.totalArea ? property.totalArea * 0.7 : 50,
        maxArea: property.totalArea ? property.totalArea * 1.3 : 200,
        fromDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
      }

      console.log('[OfficeValuation] Fetching Nadlan transactions with params:', searchParams)
      const transactions = await nadlanAPI.searchTransactions(searchParams)
      
      if (transactions.length === 0) {
        toast.warning('לא נמצאו עסקאות מתאימות בנדל"ן', {
          description: 'ניתן להזין עסקאות השוואה ידנית'
        })
      } else {
        setNadlanTransactions(transactions)
        setShowNadlanResults(true)
        toast.success(`נמצאו ${transactions.length} עסקאות מתאימות מנדל"ן`, {
          description: 'בחר עסקאות להוספה למחשבון'
        })
      }
    } catch (error) {
      console.error('[OfficeValuation] Failed to fetch Nadlan transactions:', error)
      toast.error('שגיאה בשליפת נתונים מנדל"ן', {
        description: error instanceof Error ? error.message : 'נסה שוב מאוחר יותר'
      })
    } finally {
      setIsLoadingNadlan(false)
    }
  }

  const handleAddNadlanTransaction = (transaction: NadlanTransaction) => {
    const newComparable: Partial<OfficeComparable> = {
      id: transaction.dealId,
      address: `${transaction.street} ${transaction.houseNumber || ''}, ${transaction.city}`.trim(),
      salePrice: transaction.dealAmount,
      pricePerSqm: transaction.pricePerMeter,
      saleDate: transaction.dealDate,
      area: transaction.area,
      floor: transaction.floor,
      condition: transaction.renovated ? 'excellent' : 'good',
      officeClass: 'B',
      parkingSpaces: transaction.parking ? 1 : 0,
      buildYear: transaction.buildYear,
      distance: 0
    }

    setComparables(prev => [...prev, newComparable])
    toast.success('עסקה נוספה להשוואה')
  }

  const handleCalculate = () => {
    try {
      let calculationResult: OfficeValuationResult

      if (calculationMethod === 'comparable-sales') {
        if (comparables.length === 0) {
          toast.error('נדרשות לפחות עסקה אחת להשוואה')
          return
        }
        calculationResult = ValuationEngine.calculateComparableSalesValue(
          property as OfficeProperty,
          comparables
        )
      } else if (calculationMethod === 'income-approach') {
        if (!property.rentalIncome) {
          toast.error('נדרש מידע על הכנסה משכירות לשיטת היוון')
          return
        }
        calculationResult = ValuationEngine.calculateIncomeApproach(property as OfficeProperty)
      } else {
        calculationResult = ValuationEngine.calculateCostApproach(property as OfficeProperty)
      }

      setResult(calculationResult)
      toast.success('החישוב הושלם בהצלחה')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'שגיאה בחישוב')
    }
  }

  const addComparable = () => {
    setComparables([
      ...comparables,
      {
        id: Date.now().toString(),
        address: '',
        salePrice: 0,
        pricePerSqm: 0,
        saleDate: new Date().toISOString().split('T')[0],
        area: 100,
        floor: 1,
        condition: 'good',
        officeClass: 'B',
        parkingSpaces: 0,
        buildYear: 2015,
        distance: 0
      }
    ])
  }

  const removeComparable = (id: string) => {
    setComparables(comparables.filter(c => c.id !== id))
  }

  const updateComparable = (id: string, field: string, value: any) => {
    setComparables(comparables.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value }
        if (field === 'salePrice' && updated.area && updated.salePrice) {
          updated.pricePerSqm = updated.salePrice / updated.area
        }
        if (field === 'area' && updated.salePrice && updated.area) {
          updated.pricePerSqm = updated.salePrice / updated.area
        }
        return updated
      }
      return c
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10">
          <Building className="w-8 h-8 text-primary" weight="duotone" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">מחשבון שווי משרדים</h1>
          <p className="text-muted-foreground">חישוב שווי מקצועי לנכסי משרדים</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-accent/10 border-2 border-accent/30">
        <div className="flex gap-3">
          <Info className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" weight="duotone" />
          <div className="space-y-2">
            <h3 className="font-bold text-accent text-lg">✅ חיבור למאגר נדל"ן ממשלתי</h3>
            <div className="text-sm space-y-2 text-foreground">
              <p className="font-semibold">
                🟢 <strong>המערכת מחוברת למאגר נדל"ן הממשלתי (nadlan.gov.il)</strong>
              </p>
              <div className="bg-background/60 p-3 rounded-lg space-y-1">
                <p>📊 <strong>עסקאות אמיתיות:</strong></p>
                <p className="mr-6 text-muted-foreground">
                  לחץ על כפתור <strong className="text-accent">"שלוף מנדל"ן"</strong> בטאב "עסקאות השוואה" 
                  כדי לשלוף עסקאות משרדים אמיתיות מהמאגר הממשלתי.
                </p>
                <p className="mr-6 text-muted-foreground">
                  המערכת תחפש עסקאות דומות לפי: עיר, רחוב, טווח שטח, ותקופה (12 חודשים אחרונים).
                </p>
              </div>
              <div className="bg-background/60 p-3 rounded-lg space-y-1">
                <p>🔄 <strong>מנגנון Fallback:</strong></p>
                <p className="mr-6 text-muted-foreground">
                  אם השרת הממשלתי לא זמין או אין עסקאות תואמות, ניתן להזין עסקאות ידנית.
                </p>
              </div>
              <div className="bg-warning/20 p-3 rounded-lg border border-warning/40 mt-3">
                <p className="font-semibold text-warning">
                  ⚠️ <strong>לתשומת לב:</strong>
                </p>
                <p className="text-sm text-foreground mt-1">
                  מחשבון זה משתמש בנתונים אמיתיים אך הוא כלי עזר בלבד. לשומה מקצועית מחייבת נדרש:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground mr-4 mt-2 space-y-1">
                  <li>שמאי מקרקעין מוסמך עם רישיון פעיל</li>
                  <li>ביקור שטח ובדיקה פיזית של הנכס</li>
                  <li>ניתוח נוסף של מאפייני הנכס והסביבה</li>
                  <li>התחשבות במגמות שוק מקומיות ומאקרו</li>
                </ul>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg border border-accent/30 mt-3">
                <p className="font-semibold text-accent flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" weight="duotone" />
                  <strong>יתרונות המערכת:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-foreground mr-4 mt-2 space-y-1">
                  <li>גישה מהירה לעסקאות אמיתיות מהמאגר הממשלתי</li>
                  <li>חישובי התאמה מתקדמים לעסקאות דומות</li>
                  <li>תמיכה במספר שיטות שמאות מקצועיות</li>
                  <li>ממשק ידידותי לשמאים וקציני הערכה</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="property" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="property">
            <Building className="w-4 h-4 ml-2" />
            פרטי נכס
          </TabsTrigger>
          <TabsTrigger value="comparables">
            <ChartBar className="w-4 h-4 ml-2" />
            עסקאות השוואה
          </TabsTrigger>
          <TabsTrigger value="income">
            <CurrencyDollar className="w-4 h-4 ml-2" />
            נתוני הכנסה
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>
            <FileArrowDown className="w-4 h-4 ml-2" />
            תוצאות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" weight="duotone" />
                מיקום ופרטים כלליים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>כתובת</Label>
                  <Input
                    value={property.address}
                    onChange={(e) => setProperty({ ...property, address: e.target.value })}
                    placeholder="רחוב ומספר"
                  />
                </div>
                <div className="space-y-2">
                  <Label>עיר</Label>
                  <Select
                    value={property.city}
                    onValueChange={(value) => setProperty({ ...property, city: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="תל אביב">תל אביב</SelectItem>
                      <SelectItem value="רמת גן">רמת גן</SelectItem>
                      <SelectItem value="גבעתיים">גבעתיים</SelectItem>
                      <SelectItem value="הרצליה">הרצליה</SelectItem>
                      <SelectItem value="ירושלים">ירושלים</SelectItem>
                      <SelectItem value="חיפה">חיפה</SelectItem>
                      <SelectItem value="באר שבע">באר שבע</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>שטח (מ"ר)</Label>
                  <Input
                    type="number"
                    value={property.totalArea}
                    onChange={(e) => setProperty({ ...property, totalArea: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>קומה</Label>
                  <Input
                    type="number"
                    value={property.floor}
                    onChange={(e) => setProperty({ ...property, floor: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>סה"כ קומות</Label>
                  <Input
                    type="number"
                    value={property.totalFloors}
                    onChange={(e) => setProperty({ ...property, totalFloors: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>דירוג משרד</Label>
                  <Select
                    value={property.officeClass}
                    onValueChange={(value: 'A' | 'B' | 'C') => setProperty({ ...property, officeClass: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - יוקרתי</SelectItem>
                      <SelectItem value="B">B - סטנדרטי</SelectItem>
                      <SelectItem value="C">C - בסיסי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>מצב</Label>
                  <Select
                    value={property.condition}
                    onValueChange={(value: any) => setProperty({ ...property, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">חדש</SelectItem>
                      <SelectItem value="excellent">מצוין</SelectItem>
                      <SelectItem value="good">טוב</SelectItem>
                      <SelectItem value="fair">בינוני</SelectItem>
                      <SelectItem value="poor">דורש שיפוץ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>שנת בנייה</Label>
                  <Input
                    type="number"
                    value={property.buildYear}
                    onChange={(e) => setProperty({ ...property, buildYear: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>מספר חניות</Label>
                  <Input
                    type="number"
                    value={property.parkingSpaces}
                    onChange={(e) => setProperty({ ...property, parkingSpaces: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>גובה תקרה (מ')</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={property.ceilingHeight}
                    onChange={(e) => setProperty({ ...property, ceilingHeight: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>נגישות ותשתיות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>תחבורה ציבורית</Label>
                  <Switch
                    checked={property.accessibility?.publicTransport}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        accessibility: { ...property.accessibility!, publicTransport: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>קרבה לכביש ראשי</Label>
                  <Switch
                    checked={property.accessibility?.highway}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        accessibility: { ...property.accessibility!, highway: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>רכבת קלה/מטרו</Label>
                  <Switch
                    checked={property.accessibility?.metro}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        accessibility: { ...property.accessibility!, metro: checked }
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>לובי מפואר</Label>
                  <Switch
                    checked={property.amenities?.lobby}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        amenities: { ...property.amenities!, lobby: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>אבטחה 24/7</Label>
                  <Switch
                    checked={property.amenities?.security24}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        amenities: { ...property.amenities!, security24: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>חדרי ישיבות</Label>
                  <Switch
                    checked={property.amenities?.conferenceRooms}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        amenities: { ...property.amenities!, conferenceRooms: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>מיזוג אוויר</Label>
                  <Switch
                    checked={property.amenities?.airConditioning}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        amenities: { ...property.amenities!, airConditioning: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>רצפה מוגבהת</Label>
                  <Switch
                    checked={property.amenities?.raisedFloor}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        amenities: { ...property.amenities!, raisedFloor: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>תשתית תקשורת מתקדמת</Label>
                  <Switch
                    checked={property.amenities?.dataInfrastructure}
                    onCheckedChange={(checked) => 
                      setProperty({ 
                        ...property, 
                        amenities: { ...property.amenities!, dataInfrastructure: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparables" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>עסקאות השוואה</CardTitle>
                  <CardDescription>
                    הוסף עסקאות דומות לניתוח השוואתי - מומלץ 3-7 עסקאות
                  </CardDescription>
                </div>
                <Button
                  onClick={handleFetchNadlanTransactions}
                  disabled={isLoadingNadlan || !property.city}
                  variant="default"
                  className="gap-2"
                >
                  {isLoadingNadlan ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      טוען...
                    </>
                  ) : (
                    <>
                      <CloudArrowDown className="w-5 h-5" weight="duotone" />
                      שלוף מנדל"ן
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showNadlanResults && nadlanTransactions.length > 0 && (
                <>
                  <div className="p-4 border-2 border-primary/30 rounded-xl bg-primary/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-5 h-5 text-primary" weight="duotone" />
                        <div>
                          <div className="font-semibold">נמצאו {nadlanTransactions.length} עסקאות מנדל"ן</div>
                          <div className="text-sm text-muted-foreground">לחץ על עסקה להוספה למחשבון</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNadlanResults(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {nadlanTransactions.map((transaction) => {
                        const isAlreadyAdded = comparables.some(c => c.id === transaction.dealId)
                        
                        return (
                          <div
                            key={transaction.dealId}
                            className="p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-1">
                                <div className="font-medium">
                                  {transaction.street} {transaction.houseNumber}, {transaction.city}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                                  <div>
                                    <span className="font-medium">מחיר:</span> {transaction.dealAmount.toLocaleString('he-IL')} ₪
                                  </div>
                                  <div>
                                    <span className="font-medium">למ"ר:</span> {transaction.pricePerMeter.toLocaleString('he-IL')} ₪
                                  </div>
                                  <div>
                                    <span className="font-medium">שטח:</span> {transaction.area} מ"ר
                                  </div>
                                  <div>
                                    <span className="font-medium">תאריך:</span> {new Date(transaction.dealDate).toLocaleDateString('he-IL')}
                                  </div>
                                </div>
                                {transaction.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    <CheckIcon className="w-3 h-3 ml-1" />
                                    מאומת
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAddNadlanTransaction(transaction)}
                                disabled={isAlreadyAdded}
                                variant={isAlreadyAdded ? "outline" : "default"}
                              >
                                {isAlreadyAdded ? 'נוסף' : 'הוסף'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">עסקאות נבחרות ({comparables.length})</h3>
              </div>
              {comparables.map((comp, index) => (
                <Card key={comp.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">עסקה #{index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeComparable(comp.id!)}
                      >
                        הסר
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">כתובת</Label>
                        <Input
                          value={comp.address}
                          onChange={(e) => updateComparable(comp.id!, 'address', e.target.value)}
                          placeholder="כתובת מלאה"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">תאריך עסקה</Label>
                        <Input
                          type="date"
                          value={comp.saleDate}
                          onChange={(e) => updateComparable(comp.id!, 'saleDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">מחיר (₪)</Label>
                        <Input
                          type="number"
                          value={comp.salePrice}
                          onChange={(e) => updateComparable(comp.id!, 'salePrice', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">שטח (מ"ר)</Label>
                        <Input
                          type="number"
                          value={comp.area}
                          onChange={(e) => updateComparable(comp.id!, 'area', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">קומה</Label>
                        <Input
                          type="number"
                          value={comp.floor}
                          onChange={(e) => updateComparable(comp.id!, 'floor', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">מרחק (מ')</Label>
                        <Input
                          type="number"
                          value={comp.distance}
                          onChange={(e) => updateComparable(comp.id!, 'distance', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">דירוג</Label>
                        <Select
                          value={comp.officeClass}
                          onValueChange={(value) => updateComparable(comp.id!, 'officeClass', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">שנת בנייה</Label>
                        <Input
                          type="number"
                          value={comp.buildYear}
                          onChange={(e) => updateComparable(comp.id!, 'buildYear', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">חניות</Label>
                        <Input
                          type="number"
                          value={comp.parkingSpaces}
                          onChange={(e) => updateComparable(comp.id!, 'parkingSpaces', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {comp.pricePerSqm && comp.pricePerSqm > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium">
                          מחיר למ"ר: {comp.pricePerSqm.toLocaleString('he-IL')} ₪
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                onClick={addComparable}
                variant="outline"
                className="w-full"
              >
                <Building className="w-4 h-4 ml-2" />
                הוסף עסקה
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>נתוני הכנסה - שיטת היוון</CardTitle>
              <CardDescription>
                נתונים אלו נדרשים לחישוב שווי בשיטת היוון (Income Approach)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>הכנסה חודשית משכירות (₪)</Label>
                  <Input
                    type="number"
                    value={property.rentalIncome || ''}
                    onChange={(e) => setProperty({ ...property, rentalIncome: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>שיעור תפוסה (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={property.occupancyRate ? property.occupancyRate * 100 : 95}
                    onChange={(e) => setProperty({ ...property, occupancyRate: Number(e.target.value) / 100 })}
                  />
                </div>
              </div>

              {property.rentalIncome && (
                <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                  <div className="text-sm font-medium">תחזית שנתית:</div>
                  <div className="text-2xl font-bold text-primary">
                    {(property.rentalIncome * 12 * (property.occupancyRate || 0.95)).toLocaleString('he-IL')} ₪
                  </div>
                  <div className="text-xs text-muted-foreground">
                    הכנסה ברוטו לשנה (לאחר תפוסה)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {result && (
            <>
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalcIcon className="w-6 h-6 text-primary" weight="duotone" />
                    תוצאות שומה
                  </CardTitle>
                  <CardDescription>
                    שיטת חישוב: {
                      result.method === 'comparable-sales' ? 'השוואת עסקאות' :
                      result.method === 'income-approach' ? 'שיטת היוון' :
                      'שיטת העלות'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">שווי מוערך</div>
                      <div className="text-3xl font-bold text-primary">
                        {result.adjustedValue.toLocaleString('he-IL')} ₪
                      </div>
                    </div>
                    <div className="p-4 bg-accent/10 rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">מחיר למ"ר</div>
                      <div className="text-3xl font-bold text-accent-foreground">
                        {result.valuePerSqm.toLocaleString('he-IL')} ₪
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">רמת ביטחון</div>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold">
                          {(result.confidence * 100).toFixed(0)}%
                        </div>
                        <Badge variant={result.confidence > 0.8 ? 'default' : 'secondary'}>
                          {result.confidence > 0.8 ? 'גבוהה' : 'בינונית'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">טווח שווי</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">מינימום</div>
                        <div className="text-lg font-semibold">
                          {result.valueRange.min.toLocaleString('he-IL')} ₪
                        </div>
                      </div>
                      <div className="text-muted-foreground">←→</div>
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground">מקסימום</div>
                        <div className="text-lg font-semibold">
                          {result.valueRange.max.toLocaleString('he-IL')} ₪
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.adjustmentSummary && result.adjustmentSummary.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendUp className="w-5 h-5" />
                        התאמות ומקדמים
                      </h3>
                      <div className="space-y-2">
                        {result.adjustmentSummary.map((adj, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">{adj.category}</div>
                              <div className="text-sm text-muted-foreground">{adj.reasoning}</div>
                            </div>
                            <Badge variant={adj.adjustment > 0 ? 'default' : adj.adjustment < 0 ? 'destructive' : 'secondary'}>
                              {adj.adjustment > 0 ? '+' : ''}{adj.adjustment.toFixed(1)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.comparables && result.comparables.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <ChartBar className="w-5 h-5" />
                        עסקאות שנכללו בחישוב
                      </h3>
                      <div className="space-y-2">
                        {result.comparables.map((comp, i) => (
                          <div key={i} className="p-3 bg-card border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium">{comp.address}</div>
                              <Badge variant="outline">משקל: {comp.weight.toFixed(2)}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">מחיר: </span>
                                {comp.pricePerSqm.toLocaleString('he-IL')} ₪/מ"ר
                              </div>
                              <div>
                                <span className="text-muted-foreground">מותאם: </span>
                                {comp.adjustedPrice.toLocaleString('he-IL')} ₪/מ"ר
                              </div>
                              <div>
                                <span className="text-muted-foreground">התאמה: </span>
                                <span className={comp.adjustments.total > 0 ? 'text-green-600' : comp.adjustments.total < 0 ? 'text-red-600' : ''}>
                                  {comp.adjustments.total > 0 ? '+' : ''}{comp.adjustments.total.toFixed(1)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">מרחק: </span>
                                {comp.distance}מ'
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.incomeData && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CurrencyDollar className="w-5 h-5" />
                        ניתוח הכנסה
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground">הכנסה ברוטו</div>
                          <div className="font-semibold">{result.incomeData.grossIncome.toLocaleString('he-IL')} ₪</div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground">הוצאות</div>
                          <div className="font-semibold">{result.incomeData.expenses.toLocaleString('he-IL')} ₪</div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <div className="text-xs text-muted-foreground">NOI</div>
                          <div className="font-semibold text-primary">{result.incomeData.noi.toLocaleString('he-IL')} ₪</div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground">Cap Rate</div>
                          <div className="font-semibold">{(result.incomeData.capRate * 100).toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        המלצות
                      </h3>
                      <div className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => setShowDetails(!showDetails)}
                      variant="outline"
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 ml-2" />
                      {showDetails ? 'הסתר' : 'הצג'} פירוט חישוב
                    </Button>
                  </div>

                  {showDetails && result.calculationDetails && (
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-2">נוסחת חישוב:</div>
                        <div className="p-3 bg-background rounded border font-mono text-sm">
                          {result.calculationDetails.formula}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">שלבי חישוב:</div>
                        <ol className="space-y-2">
                          {result.calculationDetails.steps.map((step, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="font-semibold text-primary">{i + 1}.</span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">מקורות:</div>
                        <ul className="space-y-1">
                          {result.calculationDetails.sources.map((source, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {result.disclaimers && result.disclaimers.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                      <div className="flex items-start gap-2 mb-2">
                        <Warning className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">הסתייגויות חשובות</h3>
                      </div>
                      <ul className="space-y-1 mr-7">
                        {result.disclaimers.map((disclaimer, i) => (
                          <li key={i} className="text-sm text-yellow-800 dark:text-yellow-300">
                            • {disclaimer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <RentalYieldAnalysis
                propertyValue={result.adjustedValue}
                propertyType="office"
                monthlyRent={property.rentalIncome}
                autoCalculate={false}
                showAdvancedSettings={true}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label>שיטת חישוב</Label>
              <Select
                value={calculationMethod}
                onValueChange={(value: any) => setCalculationMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comparable-sales">השוואת עסקאות (Comparable Sales)</SelectItem>
                  <SelectItem value="income-approach">שיטת היוון (Income Approach)</SelectItem>
                  <SelectItem value="cost-approach">שיטת העלות (Cost Approach)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCalculate}
                size="lg"
                className="w-full md:w-auto"
              >
                <CalcIcon className="w-5 h-5 ml-2" weight="duotone" />
                חשב שווי
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
