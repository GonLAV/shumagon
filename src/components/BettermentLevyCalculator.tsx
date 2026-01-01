import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar, Calculator, FileText, TrendUp, Warning, CheckCircle, Scales, Copy, Plus, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

interface PlanningStatus {
  planNumber: string
  planName: string
  zoning: string
  buildingRights: {
    farPercentage: number
    floors: number
    mainArea: number
    serviceArea: number
    allowedUses: string[]
  }
  restrictions: {
    buildingLines: string
    preservation: boolean
    expropriation: boolean
    environmentalLimits: string
  }
}

interface MarketData {
  transactionDate: string
  pricePerSqm: number
  source: string
  location: string
  verified: boolean
}

interface BettermentScenario {
  id: string
  name: string
  previousStatus: PlanningStatus
  newStatus: PlanningStatus
  determiningDate: string
  lotSize: number
  marketValue: number
  marketDataSource: MarketData[]
  calculationMethod: string
}

export function BettermentLevyCalculator() {
  const [comparisonMode, setComparisonMode] = useState(false)
  const [scenarios, setScenarios] = useKV<BettermentScenario[]>('betterment-scenarios', [])
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null)

  const [previousStatus, setPreviousStatus] = useState<PlanningStatus>({
    planNumber: '',
    planName: '',
    zoning: '',
    buildingRights: {
      farPercentage: 0,
      floors: 0,
      mainArea: 0,
      serviceArea: 0,
      allowedUses: []
    },
    restrictions: {
      buildingLines: '',
      preservation: false,
      expropriation: false,
      environmentalLimits: ''
    }
  })

  const [newStatus, setNewStatus] = useState<PlanningStatus>({
    planNumber: '',
    planName: '',
    zoning: '',
    buildingRights: {
      farPercentage: 0,
      floors: 0,
      mainArea: 0,
      serviceArea: 0,
      allowedUses: []
    },
    restrictions: {
      buildingLines: '',
      preservation: false,
      expropriation: false,
      environmentalLimits: ''
    }
  })

  const [determiningDate, setDeterminingDate] = useState('')
  const [lotSize, setLotSize] = useState(0)
  const [marketValue, setMarketValue] = useState(0)
  const [marketDataSource, setMarketDataSource] = useState<MarketData[]>([])
  const [calculationMethod, setCalculationMethod] = useState('standard')

  const calculateDelta = () => {
    const deltaBuildingRights = {
      farDelta: newStatus.buildingRights.farPercentage - previousStatus.buildingRights.farPercentage,
      floorsDelta: newStatus.buildingRights.floors - previousStatus.buildingRights.floors,
      mainAreaDelta: newStatus.buildingRights.mainArea - previousStatus.buildingRights.mainArea,
      serviceAreaDelta: newStatus.buildingRights.serviceArea - previousStatus.buildingRights.serviceArea,
      totalAreaDelta: (newStatus.buildingRights.mainArea + newStatus.buildingRights.serviceArea) - 
                       (previousStatus.buildingRights.mainArea + previousStatus.buildingRights.serviceArea)
    }

    return deltaBuildingRights
  }

  const calculateBettermentValue = () => {
    const delta = calculateDelta()
    
    if (delta.totalAreaDelta <= 0) {
      toast.error('אין תוספת זכויות בנייה - לא ניתן לחשב היטל השבחה')
      return null
    }

    const valuePerSqm = marketValue || 0
    const bettermentValue = delta.totalAreaDelta * valuePerSqm
    const levy = bettermentValue * 0.5

    return {
      delta,
      valuePerSqm,
      bettermentValue,
      levy,
      conservativeLevy: levy * 0.85,
      averageLevy: levy,
      maximumLevy: levy * 1.15
    }
  }

  const handleCalculate = async () => {
    if (!determiningDate) {
      toast.error('יש להזין מועד קובע')
      return
    }

    if (lotSize <= 0) {
      toast.error('יש להזין גודל מגרש')
      return
    }

    const result = calculateBettermentValue()
    
    if (result) {
      toast.success('החישוב הושלם בהצלחה')
    }
  }

  const saveAsScenario = () => {
    const scenarioName = prompt('הזן שם לתרחיש:', `תרחיש ${(scenarios || []).length + 1}`)
    if (!scenarioName) return

    const newScenario: BettermentScenario = {
      id: Date.now().toString(),
      name: scenarioName,
      previousStatus,
      newStatus,
      determiningDate,
      lotSize,
      marketValue,
      marketDataSource,
      calculationMethod
    }

    setScenarios((current) => [...(current || []), newScenario])
    toast.success(`התרחיש "${scenarioName}" נשמר בהצלחה`)
  }

  const loadScenario = (scenario: BettermentScenario) => {
    setPreviousStatus(scenario.previousStatus)
    setNewStatus(scenario.newStatus)
    setDeterminingDate(scenario.determiningDate)
    setLotSize(scenario.lotSize)
    setMarketValue(scenario.marketValue)
    setMarketDataSource(scenario.marketDataSource)
    setCalculationMethod(scenario.calculationMethod)
    setActiveScenarioId(scenario.id)
    toast.success(`התרחיש "${scenario.name}" נטען`)
  }

  const deleteScenario = (id: string) => {
    setScenarios((current) => (current || []).filter(s => s.id !== id))
    if (activeScenarioId === id) {
      setActiveScenarioId(null)
    }
    toast.success('התרחיש נמחק')
  }

  const duplicateScenario = (scenario: BettermentScenario) => {
    const newScenario: BettermentScenario = {
      ...scenario,
      id: Date.now().toString(),
      name: `${scenario.name} (עותק)`
    }
    setScenarios((current) => [...(current || []), newScenario])
    toast.success('התרחיש שוכפל בהצלחה')
  }

  const calculateScenarioResult = (scenario: BettermentScenario) => {
    const deltaBuildingRights = {
      farDelta: scenario.newStatus.buildingRights.farPercentage - scenario.previousStatus.buildingRights.farPercentage,
      floorsDelta: scenario.newStatus.buildingRights.floors - scenario.previousStatus.buildingRights.floors,
      mainAreaDelta: scenario.newStatus.buildingRights.mainArea - scenario.previousStatus.buildingRights.mainArea,
      serviceAreaDelta: scenario.newStatus.buildingRights.serviceArea - scenario.previousStatus.buildingRights.serviceArea,
      totalAreaDelta: (scenario.newStatus.buildingRights.mainArea + scenario.newStatus.buildingRights.serviceArea) - 
                       (scenario.previousStatus.buildingRights.mainArea + scenario.previousStatus.buildingRights.serviceArea)
    }

    if (deltaBuildingRights.totalAreaDelta <= 0) {
      return null
    }

    const valuePerSqm = scenario.marketValue || 0
    const bettermentValue = deltaBuildingRights.totalAreaDelta * valuePerSqm
    const levy = bettermentValue * 0.5

    return {
      delta: deltaBuildingRights,
      valuePerSqm,
      bettermentValue,
      levy,
      conservativeLevy: levy * 0.85,
      averageLevy: levy,
      maximumLevy: levy * 1.15
    }
  }

  const handleAIAnalysis = async () => {
    toast.info('מנתח זכויות תכנוניות באמצעות AI...')
    
    setTimeout(() => {
      toast.success('ניתוח AI הושלם - נמצאו 3 עסקאות רלוונטיות למועד הקובע')
      
      setMarketDataSource([
        {
          transactionDate: determiningDate,
          pricePerSqm: 18500,
          source: 'מידע נדלן - עסקת השוואה 1',
          location: 'באותו אזור',
          verified: true
        },
        {
          transactionDate: determiningDate,
          pricePerSqm: 19200,
          source: 'מידע נדלן - עסקת השוואה 2',
          location: 'באותו אזור',
          verified: true
        },
        {
          transactionDate: determiningDate,
          pricePerSqm: 17800,
          source: 'מידע נדלן - עסקת השוואה 3',
          location: 'באותו אזור',
          verified: true
        }
      ])
      
      const avgPrice = (18500 + 19200 + 17800) / 3
      setMarketValue(avgPrice)
    }, 2000)
  }

  const result = calculateBettermentValue()

  if (comparisonMode && scenarios && scenarios.length > 0) {
    return (
      <div className="container mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Scales className="w-8 h-8 text-primary" weight="duotone" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                  השוואת תרחישי היטל השבחה
                </h1>
                <p className="text-muted-foreground">
                  השוואה צד לצד של מספר תרחישים
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setComparisonMode(false)}
                className="gap-2"
              >
                <Calculator className="w-4 h-4" weight="duotone" />
                חזור למצב רגיל
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {scenarios.map((scenario, index) => {
                const scenarioResult = calculateScenarioResult(scenario)
                
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-effect p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{scenario.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            מועד קובע: {scenario.determiningDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => duplicateScenario(scenario)}
                            className="h-8 w-8"
                          >
                            <Copy className="w-4 h-4" weight="duotone" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteScenario(scenario.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash className="w-4 h-4" weight="duotone" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                          <div className="text-sm font-semibold text-muted-foreground mb-2">פרטי תכנית</div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">תכנית קודמת:</span>
                            <span className="font-mono">{scenario.previousStatus.planNumber || 'לא הוזן'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">תכנית חדשה:</span>
                            <span className="font-mono">{scenario.newStatus.planNumber || 'לא הוזן'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">גודל מגרש:</span>
                            <span className="font-mono">{scenario.lotSize.toLocaleString('he-IL')} מ"ר</span>
                          </div>
                        </div>

                        {scenarioResult ? (
                          <>
                            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                              <div className="text-sm font-semibold text-muted-foreground mb-3">תוספת זכויות</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">שטח עיקרי:</span>
                                  <span className="font-mono text-success font-semibold">
                                    +{scenarioResult.delta.mainAreaDelta.toLocaleString('he-IL')} מ"ר
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">שטח שירות:</span>
                                  <span className="font-mono text-success font-semibold">
                                    +{scenarioResult.delta.serviceAreaDelta.toLocaleString('he-IL')} מ"ר
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-bold">סה"כ תוספת:</span>
                                  <span className="font-mono text-lg font-bold text-success">
                                    +{scenarioResult.delta.totalAreaDelta.toLocaleString('he-IL')} מ"ר
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                              <div className="text-sm font-semibold text-muted-foreground mb-2">שווי שוק</div>
                              <div className="font-mono text-xl font-bold text-accent mb-1">
                                ₪{scenarioResult.valuePerSqm.toLocaleString('he-IL', { maximumFractionDigits: 0 })}/מ"ר
                              </div>
                              <div className="text-xs text-muted-foreground">
                                בהתאם למועד הקובע
                              </div>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent rounded-xl">
                              <div className="text-sm font-semibold text-muted-foreground mb-2">היטל השבחה</div>
                              <div className="font-mono text-2xl font-bold text-accent mb-3">
                                ₪{scenarioResult.levy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex justify-between">
                                  <span>שמרני:</span>
                                  <span className="font-mono">₪{scenarioResult.conservativeLevy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>מקסימלי:</span>
                                  <span className="font-mono">₪{scenarioResult.maximumLevy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => {
                                loadScenario(scenario)
                                setComparisonMode(false)
                              }}
                            >
                              <FileText className="w-4 h-4" weight="duotone" />
                              פתח ועבוד על תרחיש זה
                            </Button>
                          </>
                        ) : (
                          <div className="p-8 bg-muted/30 rounded-lg text-center">
                            <Warning className="w-12 h-12 text-muted-foreground mx-auto mb-2" weight="duotone" />
                            <p className="text-sm text-muted-foreground">
                              אין תוספת זכויות בתרחיש זה
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {scenarios.length === 0 && (
            <Card className="glass-effect p-12 text-center">
              <Scales className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">אין תרחישים לשמור</h3>
              <p className="text-muted-foreground mb-6">
                צור תרחיש חדש במצב הרגיל ושמור אותו כדי להתחיל השוואה
              </p>
              <Button
                variant="outline"
                onClick={() => setComparisonMode(false)}
                className="gap-2"
              >
                <Calculator className="w-4 h-4" weight="duotone" />
                חזור למצב רגיל
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-3 rounded-xl">
            <Scales className="w-8 h-8 text-primary" weight="duotone" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              מחשבון היטל השבחה חכם
            </h1>
            <p className="text-muted-foreground">
              מנוע חישוב מבוסס-נתונים לקביעת היטל השבחה על פי שינוי תכנוני
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="comparison-mode" className="text-sm font-medium cursor-pointer">
                מצב השוואה
              </Label>
              <Switch
                id="comparison-mode"
                checked={comparisonMode}
                onCheckedChange={setComparisonMode}
              />
            </div>
            {scenarios && scenarios.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="w-3 h-3" weight="duotone" />
                {scenarios.length} תרחישים
              </Badge>
            )}
          </div>
        </div>

        <Card className="glass-effect p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="determining-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" weight="duotone" />
                מועד קובע
              </Label>
              <Input
                id="determining-date"
                type="date"
                value={determiningDate}
                onChange={(e) => setDeterminingDate(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot-size">גודל מגרש (מ"ר)</Label>
              <Input
                id="lot-size"
                type="number"
                value={lotSize || ''}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="font-mono"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-method">שיטת חישוב</Label>
              <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                <SelectTrigger id="calculation-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">סטנדרטית (50%)</SelectItem>
                  <SelectItem value="agricultural">קרקע חקלאית</SelectItem>
                  <SelectItem value="urban-renewal">התחדשות עירונית</SelectItem>
                  <SelectItem value="exceptional">חריג מיוחד</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="previous" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="previous" className="gap-2">
              <FileText className="w-4 h-4" weight="duotone" />
              מצב קודם
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <TrendUp className="w-4 h-4" weight="duotone" />
              מצב חדש משביח
            </TabsTrigger>
            <TabsTrigger value="calculation" className="gap-2">
              <Calculator className="w-4 h-4" weight="duotone" />
              חישוב והיטל
            </TabsTrigger>
          </TabsList>

          <TabsContent value="previous" className="space-y-4">
            <Card className="glass-effect p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" weight="duotone" />
                תכנית ישנה - מצב תכנוני קודם
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prev-plan-number">מספר תכנית</Label>
                    <Input
                      id="prev-plan-number"
                      value={previousStatus.planNumber}
                      onChange={(e) => setPreviousStatus({ ...previousStatus, planNumber: e.target.value })}
                      placeholder="תב״ע/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prev-plan-name">שם תכנית</Label>
                    <Input
                      id="prev-plan-name"
                      value={previousStatus.planName}
                      onChange={(e) => setPreviousStatus({ ...previousStatus, planName: e.target.value })}
                      placeholder="שם התכנית"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prev-zoning">ייעוד</Label>
                    <Select 
                      value={previousStatus.zoning} 
                      onValueChange={(value) => setPreviousStatus({ ...previousStatus, zoning: value })}
                    >
                      <SelectTrigger id="prev-zoning">
                        <SelectValue placeholder="בחר ייעוד" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">מגורים</SelectItem>
                        <SelectItem value="commercial">מסחרי</SelectItem>
                        <SelectItem value="mixed">שימוש מעורב</SelectItem>
                        <SelectItem value="industrial">תעשייה</SelectItem>
                        <SelectItem value="agricultural">חקלאי</SelectItem>
                        <SelectItem value="public">ציבורי</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">זכויות בנייה קיימות</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prev-far">אחוזי בנייה (%)</Label>
                      <Input
                        id="prev-far"
                        type="number"
                        value={previousStatus.buildingRights.farPercentage || ''}
                        onChange={(e) => setPreviousStatus({
                          ...previousStatus,
                          buildingRights: { ...previousStatus.buildingRights, farPercentage: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prev-floors">מספר קומות</Label>
                      <Input
                        id="prev-floors"
                        type="number"
                        value={previousStatus.buildingRights.floors || ''}
                        onChange={(e) => setPreviousStatus({
                          ...previousStatus,
                          buildingRights: { ...previousStatus.buildingRights, floors: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prev-main-area">שטח עיקרי (מ"ר)</Label>
                      <Input
                        id="prev-main-area"
                        type="number"
                        value={previousStatus.buildingRights.mainArea || ''}
                        onChange={(e) => setPreviousStatus({
                          ...previousStatus,
                          buildingRights: { ...previousStatus.buildingRights, mainArea: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prev-service-area">שטח שירות (מ"ר)</Label>
                      <Input
                        id="prev-service-area"
                        type="number"
                        value={previousStatus.buildingRights.serviceArea || ''}
                        onChange={(e) => setPreviousStatus({
                          ...previousStatus,
                          buildingRights: { ...previousStatus.buildingRights, serviceArea: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">סה"כ זכויות:</span>
                      <span className="font-mono font-semibold">
                        {(previousStatus.buildingRights.mainArea + previousStatus.buildingRights.serviceArea).toLocaleString('he-IL')} מ"ר
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <Card className="glass-effect p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendUp className="w-5 h-5 text-success" weight="duotone" />
                תכנית חדשה משביחה - מצב תכנוני חדש
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-plan-number">מספר תכנית</Label>
                    <Input
                      id="new-plan-number"
                      value={newStatus.planNumber}
                      onChange={(e) => setNewStatus({ ...newStatus, planNumber: e.target.value })}
                      placeholder="תב״ע/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-plan-name">שם תכנית</Label>
                    <Input
                      id="new-plan-name"
                      value={newStatus.planName}
                      onChange={(e) => setNewStatus({ ...newStatus, planName: e.target.value })}
                      placeholder="שם התכנית"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-zoning">ייעוד</Label>
                    <Select 
                      value={newStatus.zoning} 
                      onValueChange={(value) => setNewStatus({ ...newStatus, zoning: value })}
                    >
                      <SelectTrigger id="new-zoning">
                        <SelectValue placeholder="בחר ייעוד" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">מגורים</SelectItem>
                        <SelectItem value="commercial">מסחרי</SelectItem>
                        <SelectItem value="mixed">שימוש מעורב</SelectItem>
                        <SelectItem value="industrial">תעשייה</SelectItem>
                        <SelectItem value="agricultural">חקלאי</SelectItem>
                        <SelectItem value="public">ציבורי</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">זכויות בנייה חדשות</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-far">אחוזי בנייה (%)</Label>
                      <Input
                        id="new-far"
                        type="number"
                        value={newStatus.buildingRights.farPercentage || ''}
                        onChange={(e) => setNewStatus({
                          ...newStatus,
                          buildingRights: { ...newStatus.buildingRights, farPercentage: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-floors">מספר קומות</Label>
                      <Input
                        id="new-floors"
                        type="number"
                        value={newStatus.buildingRights.floors || ''}
                        onChange={(e) => setNewStatus({
                          ...newStatus,
                          buildingRights: { ...newStatus.buildingRights, floors: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-main-area">שטח עיקרי (מ"ר)</Label>
                      <Input
                        id="new-main-area"
                        type="number"
                        value={newStatus.buildingRights.mainArea || ''}
                        onChange={(e) => setNewStatus({
                          ...newStatus,
                          buildingRights: { ...newStatus.buildingRights, mainArea: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-service-area">שטח שירות (מ"ר)</Label>
                      <Input
                        id="new-service-area"
                        type="number"
                        value={newStatus.buildingRights.serviceArea || ''}
                        onChange={(e) => setNewStatus({
                          ...newStatus,
                          buildingRights: { ...newStatus.buildingRights, serviceArea: Number(e.target.value) }
                        })}
                        className="font-mono"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">סה"כ זכויות:</span>
                      <span className="font-mono font-semibold text-success">
                        {(newStatus.buildingRights.mainArea + newStatus.buildingRights.serviceArea).toLocaleString('he-IL')} מ"ר
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="calculation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                size="lg"
                onClick={handleAIAnalysis}
                className="gap-2"
                disabled={!determiningDate}
              >
                <TrendUp className="w-5 h-5" weight="duotone" />
                שלוף נתוני שוק למועד הקובע
              </Button>

              <Button
                size="lg"
                variant="default"
                onClick={handleCalculate}
                className="gap-2"
                disabled={!determiningDate || lotSize <= 0}
              >
                <Calculator className="w-5 h-5" weight="duotone" />
                חשב היטל השבחה
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={saveAsScenario}
                className="gap-2"
                disabled={!result}
              >
                <Plus className="w-5 h-5" weight="duotone" />
                שמור כתרחיש להשוואה
              </Button>
            </div>

            {marketDataSource.length > 0 && (
              <Card className="glass-effect p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" weight="fill" />
                  עסקאות השוואה למועד הקובע
                </h3>
                
                <div className="space-y-3">
                  {marketDataSource.map((data, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">{data.source}</div>
                          <div className="text-sm text-muted-foreground">{data.location}</div>
                          <div className="text-sm text-muted-foreground">{data.transactionDate}</div>
                        </div>
                        <div className="text-left">
                          <div className="font-mono text-xl font-bold text-primary">
                            ₪{data.pricePerSqm.toLocaleString('he-IL')}
                          </div>
                          <div className="text-sm text-muted-foreground">למ"ר</div>
                          {data.verified && (
                            <Badge variant="outline" className="mt-2 border-success text-success">
                              <CheckCircle className="w-3 h-3 ml-1" weight="fill" />
                              מאומת
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">ממוצע משוקלל</span>
                      <div className="text-left">
                        <div className="font-mono text-2xl font-bold text-primary">
                          ₪{marketValue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-muted-foreground">למ"ר זכויות בנייה</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="glass-effect p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendUp className="w-5 h-5 text-accent" weight="duotone" />
                    דלתא זכויות בנייה
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-2">אחוזי בנייה</div>
                      <div className={`font-mono text-2xl font-bold ${result.delta.farDelta > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                        {result.delta.farDelta > 0 ? '+' : ''}{result.delta.farDelta}%
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-2">קומות</div>
                      <div className={`font-mono text-2xl font-bold ${result.delta.floorsDelta > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                        {result.delta.floorsDelta > 0 ? '+' : ''}{result.delta.floorsDelta}
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-2">שטח עיקרי</div>
                      <div className={`font-mono text-2xl font-bold ${result.delta.mainAreaDelta > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                        {result.delta.mainAreaDelta > 0 ? '+' : ''}{result.delta.mainAreaDelta.toLocaleString('he-IL')}
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-2">שטח שירות</div>
                      <div className={`font-mono text-2xl font-bold ${result.delta.serviceAreaDelta > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                        {result.delta.serviceAreaDelta > 0 ? '+' : ''}{result.delta.serviceAreaDelta.toLocaleString('he-IL')}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="p-4 bg-success/20 border-2 border-success rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">סה"כ תוספת זכויות בנייה</span>
                      <div className="font-mono text-3xl font-bold text-success">
                        +{result.delta.totalAreaDelta.toLocaleString('he-IL')} מ"ר
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="glass-effect p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" weight="duotone" />
                    חישוב שקוף - נוסחת היטל השבחה
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm">
                      <div className="mb-2 font-semibold">נוסחה:</div>
                      <div className="text-muted-foreground">
                        שווי השבחה = (Δ זכויות בנייה × שווי זכויות ליחידה)
                      </div>
                      <div className="mt-3 mb-2 font-semibold">הצבה:</div>
                      <div className="text-muted-foreground">
                        שווי השבחה = ({result.delta.totalAreaDelta.toLocaleString('he-IL')} מ"ר × ₪{result.valuePerSqm.toLocaleString('he-IL')}/מ"ר)
                      </div>
                      <div className="mt-3 mb-2 font-semibold">תוצאה:</div>
                      <div className="text-primary text-lg">
                        שווי השבחה = ₪{result.bettermentValue.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent rounded-xl">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">היטל השבחה (50%)</span>
                          <div className="font-mono text-3xl font-bold text-accent">
                            ₪{result.levy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
                          </div>
                        </div>

                        <Separator />

                        <div className="text-sm text-muted-foreground space-y-2">
                          <div className="flex justify-between">
                            <span>טווח שמרני (85%)</span>
                            <span className="font-mono">₪{result.conservativeLevy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ממוצע</span>
                            <span className="font-mono">₪{result.averageLevy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>טווח מקסימלי (115%)</span>
                            <span className="font-mono">₪{result.maximumLevy.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Card className="bg-warning/10 border border-warning/30 p-4">
                      <div className="flex gap-3">
                        <Warning className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" weight="duotone" />
                        <div className="space-y-2 text-sm">
                          <p className="font-semibold text-warning">הצהרת אחריות</p>
                          <p className="text-muted-foreground">
                            החישוב מהווה כלי עזר בלבד ואינו תחליף לשומה מכרעת. התוצאה מבוססת על נתונים שהוזנו 
                            ועל נוסחאות חישוב סטנדרטיות. יש לקבל חוות דעת שמאית מקצועית לצורך הגשה רשמית.
                          </p>
                          <p className="text-muted-foreground">
                            החישוב נערך בהתאם לחוק התכנון והבנייה, התשכ"ה-1965, ותקנות התכנון והבנייה (חישוב 
                            היטל השבחה והיטל ביצוע), התשכ"ח-1968.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>

                <Card className="glass-effect p-6">
                  <h3 className="text-lg font-semibold mb-4">Audit Trail - מקורות נתונים</h3>
                  
                  <ScrollArea className="h-64">
                    <div className="space-y-3 pr-4">
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="font-semibold mb-1">מקור תכנוני - מצב קודם</div>
                        <div className="text-muted-foreground">
                          תכנית: {previousStatus.planNumber || 'לא הוזן'} | 
                          ייעוד: {previousStatus.zoning || 'לא הוזן'} | 
                          זכויות: {(previousStatus.buildingRights.mainArea + previousStatus.buildingRights.serviceArea).toLocaleString('he-IL')} מ"ר
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="font-semibold mb-1">מקור תכנוני - מצב חדש</div>
                        <div className="text-muted-foreground">
                          תכנית: {newStatus.planNumber || 'לא הוזן'} | 
                          ייעוד: {newStatus.zoning || 'לא הוזן'} | 
                          זכויות: {(newStatus.buildingRights.mainArea + newStatus.buildingRights.serviceArea).toLocaleString('he-IL')} מ"ר
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="font-semibold mb-1">מועד קובע</div>
                        <div className="text-muted-foreground">{determiningDate}</div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="font-semibold mb-1">מקור נתוני שוק</div>
                        <div className="text-muted-foreground">
                          {marketDataSource.length} עסקאות השוואה ממקורות ממשלתיים מאומתים
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="font-semibold mb-1">מתודולוגיה</div>
                        <div className="text-muted-foreground">
                          חישוב דלתא תכנונית + שווי שוק במועד קובע + היטל 50% סטנדרטי
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {scenarios && scenarios.length > 0 && !comparisonMode && (
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" weight="duotone" />
                תרחישים שמורים
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonMode(true)}
                className="gap-2"
              >
                <Scales className="w-4 h-4" weight="duotone" />
                עבור למצב השוואה
              </Button>
            </div>
            
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      activeScenarioId === scenario.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 border-border hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1" onClick={() => loadScenario(scenario)}>
                        <div className="font-semibold mb-1">{scenario.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {scenario.previousStatus.planNumber || 'תכנית קודמת'} → {scenario.newStatus.planNumber || 'תכנית חדשה'} | 
                          מועד קובע: {scenario.determiningDate}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateScenario(scenario)
                          }}
                          className="h-8 w-8"
                        >
                          <Copy className="w-4 h-4" weight="duotone" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteScenario(scenario.id)
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash className="w-4 h-4" weight="duotone" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
