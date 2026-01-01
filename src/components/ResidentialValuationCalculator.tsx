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
  Buildings, 
  Calculator as CalcIcon, 
  MapPin,
  Ruler,
  Info,
  CloudArrowDown,
  CheckCircle,
  X,
  TrendUp,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  ResidentialProperty, 
  ResidentialComparable, 
  ResidentialValuationResult,
  ResidentialValuationCalculator as ValuationEngine
} from '@/lib/calculators/residentialValuationCalculator'
import { realIsraeliGovDataAPI, type NationalTransactionData } from '@/lib/realIsraeliGovDataAPI'
import { RentalYieldAnalysis } from '@/components/RentalYieldAnalysis'

export function ResidentialValuationCalculator() {
  const [property, setProperty] = useState<Partial<ResidentialProperty>>({
    address: '',
    city: 'תל אביב',
    area: 90,
    rooms: 3,
    floor: 3,
    totalFloors: 5,
    condition: 'good',
    buildYear: 2010,
    hasElevator: true,
    hasParkingSpot: false,
    hasBalcony: true,
    hasStorage: false,
    hasPenthouse: false,
    hasGarden: false,
    propertyType: 'apartment'
  })

  const [comparables, setComparables] = useState<Partial<ResidentialComparable>[]>([])
  const [result, setResult] = useState<ResidentialValuationResult | null>(null)
  const [isLoadingNadlan, setIsLoadingNadlan] = useState(false)
  const [nadlanTransactions, setNadlanTransactions] = useState<NationalTransactionData[]>([])
  const [showNadlanResults, setShowNadlanResults] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')

  const handleFetchNadlanTransactions = async () => {
    setIsLoadingNadlan(true)
    try {
      const cities = property.city ? [property.city] : undefined
      const districts = selectedDistrict ? [selectedDistrict] : undefined
      
      const searchParams = {
        cities,
        districts,
        propertyTypes: ['דירה', 'דירת גן', 'פנטהאוז'],
        minArea: property.area ? property.area * 0.8 : 60,
        maxArea: property.area ? property.area * 1.2 : 120,
        fromDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        verifiedOnly: false,
        limit: 50
      }

      console.log('[ResidentialValuation] 🇮🇱 Fetching transactions from all over Israel:', searchParams)
      const transactions = await realIsraeliGovDataAPI.searchNationalTransactions(searchParams)
      
      const statistics = realIsraeliGovDataAPI.calculateNationalStatistics(transactions)
      
      if (transactions.length === 0) {
        toast.warning('לא נמצאו עסקאות', {
          description: 'נסה להרחיב את קריטריוני החיפוש'
        })
      } else {
        setNadlanTransactions(transactions)
        setShowNadlanResults(true)
        
        const citiesFound = Object.keys(statistics.byCity).length
        const districtsFound = Object.keys(statistics.byDistrict).length
        
        toast.success(`נמצאו ${transactions.length} עסקאות דירות מכל רחבי ישראל! 🇮🇱`, {
          description: `${citiesFound} ערים | ${districtsFound} מחוזות | מחיר ממוצע: ₪${statistics.avgPricePerSqm.toLocaleString()}/מ"ר`,
          duration: 6000
        })
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error('שגיאה בשליפת נתונים')
    } finally {
      setIsLoadingNadlan(false)
    }
  }

  const handleAddNadlanTransaction = (transaction: NationalTransactionData) => {
    const newComparable: Partial<ResidentialComparable> = {
      id: transaction.dealId,
      address: `${transaction.street} ${transaction.houseNumber || ''}, ${transaction.city}, ${transaction.districtHe}`.trim(),
      salePrice: transaction.dealAmount,
      pricePerSqm: transaction.pricePerMeter,
      saleDate: transaction.dealDate,
      area: transaction.area,
      rooms: transaction.rooms,
      floor: transaction.floor,
      condition: transaction.renovated ? 'excellent' : transaction.conditionHe === 'חדש' ? 'excellent' : 'good',
      buildYear: transaction.buildYear,
      hasElevator: transaction.elevator || false,
      hasParkingSpot: transaction.parking || false,
      hasBalcony: transaction.balcony || false,
      distance: 0
    }

    setComparables(prev => [...prev, newComparable])
    toast.success(`עסקה נוספה מ${transaction.city}`)
  }

  const handleCalculate = () => {
    try {
      if (comparables.length === 0) {
        toast.error('נדרשות לפחות עסקה אחת להשוואה')
        return
      }

      const calculationResult = ValuationEngine.calculateComparableSalesValue(
        property as ResidentialProperty,
        comparables
      )

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
        area: 90,
        rooms: 3,
        floor: 3,
        condition: 'good',
        buildYear: 2010,
        hasElevator: true,
        hasParkingSpot: false,
        hasBalcony: true,
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
          <Buildings className="w-8 h-8 text-primary" weight="duotone" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">מחשבון שווי דירות מגורים</h1>
          <p className="text-muted-foreground">חישוב שווי מקצועי לנכסי מגורים</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-accent/10 border-2 border-accent/30">
        <div className="flex gap-3">
          <Info className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" weight="duotone" />
          <div>
            <h3 className="font-bold text-accent text-lg">✅ חיבור למאגר נדל"ן ממשלתי</h3>
            <p className="text-sm mt-1">
              המערכת מחוברת למאגר נדל"ן הממשלתי (nadlan.gov.il) ושולפת עסקאות אמיתיות לדירות מגורים.
              לחץ על "שלוף מנדל"ן" בטאב עסקאות השוואה.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="property" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="property">פרטי הנכס</TabsTrigger>
          <TabsTrigger value="comparables">עסקאות השוואה</TabsTrigger>
          <TabsTrigger value="results">תוצאות</TabsTrigger>
        </TabsList>

        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>מיקום</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>עיר</Label>
                  <Input
                    value={property.city || ''}
                    onChange={(e) => setProperty({ ...property, city: e.target.value })}
                    placeholder="תל אביב"
                  />
                </div>
                <div className="space-y-2">
                  <Label>רחוב</Label>
                  <Input
                    value={property.address || ''}
                    onChange={(e) => setProperty({ ...property, address: e.target.value })}
                    placeholder="רחוב דיזנגוף"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מאפיינים בסיסיים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>שטח (מ״ר)</Label>
                  <Input
                    type="number"
                    value={property.area || ''}
                    onChange={(e) => setProperty({ ...property, area: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>חדרים</Label>
                  <Input
                    type="number"
                    value={property.rooms || ''}
                    onChange={(e) => setProperty({ ...property, rooms: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>קומה</Label>
                  <Input
                    type="number"
                    value={property.floor || ''}
                    onChange={(e) => setProperty({ ...property, floor: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>מצב</Label>
                  <Select 
                    value={property.condition || 'good'} 
                    onValueChange={(value) => setProperty({ ...property, condition: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">חדש</SelectItem>
                      <SelectItem value="excellent">מצוין</SelectItem>
                      <SelectItem value="good">טוב</SelectItem>
                      <SelectItem value="fair">בינוני</SelectItem>
                      <SelectItem value="poor">ירוד</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>שנת בנייה</Label>
                  <Input
                    type="number"
                    value={property.buildYear || ''}
                    onChange={(e) => setProperty({ ...property, buildYear: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מאפיינים נוספים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label>מעלית</Label>
                  <Switch
                    checked={property.hasElevator}
                    onCheckedChange={(checked) => setProperty({ ...property, hasElevator: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>חניה</Label>
                  <Switch
                    checked={property.hasParkingSpot}
                    onCheckedChange={(checked) => setProperty({ ...property, hasParkingSpot: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>מרפסת</Label>
                  <Switch
                    checked={property.hasBalcony}
                    onCheckedChange={(checked) => setProperty({ ...property, hasBalcony: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>מחסן</Label>
                  <Switch
                    checked={property.hasStorage}
                    onCheckedChange={(checked) => setProperty({ ...property, hasStorage: checked })}
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
                  <CardDescription>שלוף עסקאות ממאגר נדל"ן או הזן ידנית</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleFetchNadlanTransactions}
                    disabled={isLoadingNadlan}
                    variant="default"
                    className="gap-2"
                  >
                    <CloudArrowDown size={20} weight="duotone" />
                    {isLoadingNadlan ? 'שולף...' : 'שלוף מנדל"ן'}
                  </Button>
                  <Button onClick={addComparable} variant="outline" className="gap-2">
                    <CalcIcon size={20} />
                    הוסף ידנית
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showNadlanResults && nadlanTransactions.length > 0 && (
                <div className="space-y-2 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="text-accent" size={20} weight="fill" />
                    נמצאו {nadlanTransactions.length} עסקאות מנדל"ן
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {nadlanTransactions.map(transaction => (
                      <div key={transaction.dealId} className="flex items-center justify-between p-3 bg-background rounded border">
                        <div className="flex-1">
                          <div className="font-medium">{transaction.street}, {transaction.city}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.area} מ״ר • {transaction.rooms} חדרים • {transaction.pricePerMeter.toLocaleString()} ₪/מ״ר
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddNadlanTransaction(transaction)}
                          className="gap-2"
                        >
                          <CheckCircle size={16} />
                          הוסף
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comparables.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Buildings size={48} className="mx-auto mb-4 opacity-50" />
                  <p>אין עסקאות השוואה</p>
                  <p className="text-sm">שלוף עסקאות מנדל"ן או הוסף ידנית</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comparables.map((comp) => (
                    <Card key={comp.id} className="border-2">
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">עסקה {comp.id}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeComparable(comp.id!)}
                            >
                              <X size={18} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">כתובת</Label>
                              <Input
                                value={comp.address || ''}
                                onChange={(e) => updateComparable(comp.id!, 'address', e.target.value)}
                                placeholder="רחוב X, תל אביב"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">תאריך</Label>
                              <Input
                                type="date"
                                value={comp.saleDate || ''}
                                onChange={(e) => updateComparable(comp.id!, 'saleDate', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">מחיר (₪)</Label>
                              <Input
                                type="number"
                                value={comp.salePrice || ''}
                                onChange={(e) => updateComparable(comp.id!, 'salePrice', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">שטח (מ״ר)</Label>
                              <Input
                                type="number"
                                value={comp.area || ''}
                                onChange={(e) => updateComparable(comp.id!, 'area', Number(e.target.value))}
                              />
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            ₪{comp.pricePerSqm?.toLocaleString() || 0} למ״ר
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleCalculate} 
            size="lg"
            className="w-full gap-2"
            disabled={comparables.length === 0}
          >
            <CalcIcon size={24} weight="duotone" />
            חשב שווי
          </Button>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {result ? (
            <>
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendUp className="text-primary" size={28} weight="duotone" />
                    שווי משוער
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">
                      ₪{result.adjustedValue.toLocaleString()}
                    </div>
                    <div className="text-xl text-muted-foreground mt-2">
                      ₪{result.valuePerSqm.toLocaleString()} למ״ר
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">טווח שווי</div>
                      <div className="font-semibold">
                        ₪{result.valueRange.min.toLocaleString()} - ₪{result.valueRange.max.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">רמת ביטחון</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.confidence > 0.8 ? 'default' : 'secondary'}>
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {result.adjustmentSummary && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2">גורמים חיוביים</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.adjustmentSummary.positiveFactors.map((factor, i) => (
                              <Badge key={i} variant="default" className="gap-1">
                                <CheckCircle size={14} weight="fill" />
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {result.adjustmentSummary.negativeFactors.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">גורמים שליליים</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.adjustmentSummary.negativeFactors.map((factor, i) => (
                                <Badge key={i} variant="destructive" className="gap-1">
                                  <Warning size={14} weight="fill" />
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {result.recommendations && result.recommendations.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">המלצות</h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Info size={16} className="text-accent mt-0.5 flex-shrink-0" weight="duotone" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <RentalYieldAnalysis
                propertyValue={result.adjustedValue}
                propertyType="residential"
                autoCalculate={false}
                showAdvancedSettings={true}
              />
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                <CalcIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>לא בוצע חישוב</p>
                <p className="text-sm">הזן פרטי נכס ועסקאות השוואה ולחץ "חשב שווי"</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
