import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Gauge,
  Timer,
  Warning,
  CheckCircle,
  XCircle,
  ArrowsClockwise,
  Clock,
  ChartLine,
  Pause,
  Play,
  Prohibit,
  Shield,
  Info,
  Sliders,
  Database,
  TrendUp,
  Bell
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format, startOfMonth, startOfDay, differenceInSeconds } from 'date-fns'
import { he } from 'date-fns/locale'

interface QuotaLimit {
  requests: number
  period: 'minute' | 'hour' | 'day' | 'month'
}

interface ThrottleConfig {
  enabled: boolean
  maxRequestsPerSecond: number
  burstAllowance: number
  cooldownMs: number
  queueEnabled: boolean
  maxQueueSize: number
  priorityLevels: boolean
}

interface APIQuotaConfig {
  id: string
  apiName: string
  apiNameHe: string
  enabled: boolean
  quota: QuotaLimit
  used: number
  resetAt: number
  throttle: ThrottleConfig
  alertThresholds: {
    warning: number
    critical: number
  }
  costPerRequest: number
  budgetLimit?: number
  autoDisableOnLimit: boolean
}

interface UsageSnapshot {
  timestamp: number
  apiId: string
  requestCount: number
  throttled: number
  queued: number
  rejected: number
}

const DEFAULT_APIS: Record<string, Omit<APIQuotaConfig, 'id'>> = {
  iPlan: {
    apiName: 'iPlan',
    apiNameHe: 'מינהל התכנון',
    enabled: true,
    quota: { requests: 1000, period: 'day' },
    used: 0,
    resetAt: startOfDay(new Date()).getTime() + 86400000,
    throttle: {
      enabled: true,
      maxRequestsPerSecond: 5,
      burstAllowance: 10,
      cooldownMs: 200,
      queueEnabled: true,
      maxQueueSize: 50,
      priorityLevels: false
    },
    alertThresholds: { warning: 75, critical: 90 },
    costPerRequest: 0.05,
    autoDisableOnLimit: false
  },
  mavat: {
    apiName: 'Mavat',
    apiNameHe: 'מבא״ת',
    enabled: true,
    quota: { requests: 500, period: 'day' },
    used: 0,
    resetAt: startOfDay(new Date()).getTime() + 86400000,
    throttle: {
      enabled: true,
      maxRequestsPerSecond: 3,
      burstAllowance: 8,
      cooldownMs: 300,
      queueEnabled: true,
      maxQueueSize: 30,
      priorityLevels: false
    },
    alertThresholds: { warning: 70, critical: 85 },
    costPerRequest: 0.03,
    autoDisableOnLimit: false
  },
  govMap: {
    apiName: 'GovMap',
    apiNameHe: 'מפת ממשל',
    enabled: true,
    quota: { requests: 2000, period: 'day' },
    used: 0,
    resetAt: startOfDay(new Date()).getTime() + 86400000,
    throttle: {
      enabled: true,
      maxRequestsPerSecond: 10,
      burstAllowance: 20,
      cooldownMs: 100,
      queueEnabled: true,
      maxQueueSize: 100,
      priorityLevels: true
    },
    alertThresholds: { warning: 80, critical: 95 },
    costPerRequest: 0.02,
    autoDisableOnLimit: false
  },
  landRegistry: {
    apiName: 'Land Registry',
    apiNameHe: 'רישום מקרקעין',
    enabled: true,
    quota: { requests: 200, period: 'day' },
    used: 0,
    resetAt: startOfDay(new Date()).getTime() + 86400000,
    throttle: {
      enabled: true,
      maxRequestsPerSecond: 2,
      burstAllowance: 5,
      cooldownMs: 500,
      queueEnabled: true,
      maxQueueSize: 20,
      priorityLevels: false
    },
    alertThresholds: { warning: 60, critical: 80 },
    costPerRequest: 0.12,
    budgetLimit: 20,
    autoDisableOnLimit: true
  },
  taxAuthority: {
    apiName: 'Tax Authority',
    apiNameHe: 'רשות המיסים',
    enabled: true,
    quota: { requests: 300, period: 'day' },
    used: 0,
    resetAt: startOfDay(new Date()).getTime() + 86400000,
    throttle: {
      enabled: true,
      maxRequestsPerSecond: 3,
      burstAllowance: 6,
      cooldownMs: 350,
      queueEnabled: true,
      maxQueueSize: 25,
      priorityLevels: false
    },
    alertThresholds: { warning: 65, critical: 85 },
    costPerRequest: 0.08,
    autoDisableOnLimit: false
  },
  nadlan: {
    apiName: 'Nadlan Data',
    apiNameHe: 'נתוני נדל"ן',
    enabled: true,
    quota: { requests: 1500, period: 'day' },
    used: 0,
    resetAt: startOfDay(new Date()).getTime() + 86400000,
    throttle: {
      enabled: true,
      maxRequestsPerSecond: 8,
      burstAllowance: 15,
      cooldownMs: 125,
      queueEnabled: true,
      maxQueueSize: 75,
      priorityLevels: true
    },
    alertThresholds: { warning: 75, critical: 90 },
    costPerRequest: 0.06,
    autoDisableOnLimit: false
  }
}

export function APIQuotaManager() {
  const [quotaConfigs, setQuotaConfigs] = useKV<Record<string, APIQuotaConfig>>('api-quota-configs', 
    Object.entries(DEFAULT_APIS).reduce((acc, [key, config]) => {
      acc[key] = { ...config, id: key }
      return acc
    }, {} as Record<string, APIQuotaConfig>)
  )

  const [usageSnapshots, setUsageSnapshots] = useKV<UsageSnapshot[]>('api-usage-snapshots', [])
  const [selectedAPI, setSelectedAPI] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const analytics = useMemo(() => {
    const configs = quotaConfigs || {}
    const totalApis = Object.keys(configs).length
    const activeApis = Object.values(configs).filter(c => c.enabled).length
    const totalRequests = Object.values(configs).reduce((sum, c) => sum + c.used, 0)
    const totalQuota = Object.values(configs).reduce((sum, c) => sum + c.quota.requests, 0)
    const totalCost = Object.values(configs).reduce((sum, c) => sum + (c.used * c.costPerRequest), 0)
    
    const apisNearLimit = Object.values(configs).filter(c => {
      const usage = (c.used / c.quota.requests) * 100
      return usage >= c.alertThresholds.warning
    }).length

    const throttledApis = Object.values(configs).filter(c => c.throttle.enabled).length

    return {
      totalApis,
      activeApis,
      totalRequests,
      totalQuota,
      totalCost,
      apisNearLimit,
      throttledApis,
      overallUsagePercent: totalQuota > 0 ? (totalRequests / totalQuota) * 100 : 0
    }
  }, [quotaConfigs])

  const handleToggleAPI = (apiId: string) => {
    setQuotaConfigs(current => {
      if (!current) return {}
      return {
        ...current,
        [apiId]: {
          ...current[apiId],
          enabled: !current[apiId].enabled
        }
      }
    })
    toast.success(quotaConfigs?.[apiId]?.enabled ? 'API הושבת' : 'API הופעל')
  }

  const handleResetQuota = (apiId: string) => {
    setQuotaConfigs(current => {
      if (!current) return {}
      return {
        ...current,
        [apiId]: {
          ...current[apiId],
          used: 0,
          resetAt: getNextResetTime(current[apiId].quota.period)
        }
      }
    })
    toast.success('המכסה אופסה')
  }

  const handleResetAllQuotas = () => {
    setQuotaConfigs(current => {
      if (!current) return {}
      const updated = { ...current }
      Object.keys(updated).forEach(apiId => {
        updated[apiId] = {
          ...updated[apiId],
          used: 0,
          resetAt: getNextResetTime(updated[apiId].quota.period)
        }
      })
      return updated
    })
    toast.success('כל המכסות אופסו')
  }

  const handleUpdateThrottle = (apiId: string, throttleConfig: Partial<ThrottleConfig>) => {
    setQuotaConfigs(current => {
      if (!current) return {}
      return {
        ...current,
        [apiId]: {
          ...current[apiId],
          throttle: {
            ...current[apiId].throttle,
            ...throttleConfig
          }
        }
      }
    })
  }

  const handleUpdateQuota = (apiId: string, requests: number, period: QuotaLimit['period']) => {
    setQuotaConfigs(current => {
      if (!current) return {}
      return {
        ...current,
        [apiId]: {
          ...current[apiId],
          quota: { requests, period },
          resetAt: getNextResetTime(period)
        }
      }
    })
  }

  const handleSimulateUsage = (apiId: string, count: number) => {
    setQuotaConfigs(current => {
      if (!current) return {}
      const config = current[apiId]
      const newUsed = Math.min(config.used + count, config.quota.requests)
      
      if (newUsed >= config.alertThresholds.critical * config.quota.requests / 100) {
        toast.warning(`${config.apiNameHe}: הגעת לסף קריטי של ${config.alertThresholds.critical}%`)
      } else if (newUsed >= config.alertThresholds.warning * config.quota.requests / 100) {
        toast.warning(`${config.apiNameHe}: הגעת לסף אזהרה של ${config.alertThresholds.warning}%`)
      }

      return {
        ...current,
        [apiId]: {
          ...current[apiId],
          used: newUsed
        }
      }
    })

    const snapshot: UsageSnapshot = {
      timestamp: Date.now(),
      apiId,
      requestCount: count,
      throttled: 0,
      queued: 0,
      rejected: 0
    }
    setUsageSnapshots(current => [...(current || []), snapshot])
  }

  const getNextResetTime = (period: QuotaLimit['period']): number => {
    const now = new Date()
    switch (period) {
      case 'minute':
        return now.getTime() + 60000
      case 'hour':
        return now.getTime() + 3600000
      case 'day':
        return startOfDay(new Date(now.getTime() + 86400000)).getTime()
      case 'month':
        return startOfMonth(new Date(now.getFullYear(), now.getMonth() + 1)).getTime()
      default:
        return now.getTime() + 86400000
    }
  }

  const getUsageStatus = (config: APIQuotaConfig): 'normal' | 'warning' | 'critical' | 'exceeded' => {
    const usagePercent = (config.used / config.quota.requests) * 100
    if (usagePercent >= 100) return 'exceeded'
    if (usagePercent >= config.alertThresholds.critical) return 'critical'
    if (usagePercent >= config.alertThresholds.warning) return 'warning'
    return 'normal'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-success'
      case 'warning': return 'text-warning'
      case 'critical': return 'text-destructive'
      case 'exceeded': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal': return <Badge variant="outline" className="bg-success/10 text-success border-success/20">תקין</Badge>
      case 'warning': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">אזהרה</Badge>
      case 'critical': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">קריטי</Badge>
      case 'exceeded': return <Badge variant="destructive">חרג ממכסה</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול מכסות API</h1>
          <p className="text-muted-foreground mt-1">שליטה מלאה על שימוש, מכסות ומנגנון Throttling</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetAllQuotas}>
            <ArrowsClockwise className="ml-2" />
            איפוס כל המכסות
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">APIs פעילים</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeApis}/{analytics.totalApis}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.throttledApis} עם throttling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שימוש כולל</CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRequests.toLocaleString('he-IL')}</div>
            <Progress value={analytics.overallUsagePercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.overallUsagePercent.toFixed(1)}% מהמכסה הכוללת
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">עלות כוללת</CardTitle>
            <TrendUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{analytics.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              בחודש זה
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">אזהרות</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.apisNearLimit}</div>
            <p className="text-xs text-muted-foreground mt-1">
              APIs קרובים למכסה
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="throttling">Throttling</TabsTrigger>
          <TabsTrigger value="alerts">התראות ותקציב</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {quotaConfigs && Object.entries(quotaConfigs).map(([apiId, config]) => {
              const usagePercent = (config.used / config.quota.requests) * 100
              const status = getUsageStatus(config)
              const cost = config.used * config.costPerRequest
              const timeUntilReset = differenceInSeconds(config.resetAt, Date.now())

              return (
                <Card key={apiId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={config.enabled} 
                          onCheckedChange={() => handleToggleAPI(apiId)}
                        />
                        <div>
                          <CardTitle className="text-lg">{config.apiNameHe}</CardTitle>
                          <CardDescription>{config.apiName}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status)}
                        {config.throttle.enabled && (
                          <Badge variant="outline">
                            <Gauge className="ml-1" size={14} />
                            Throttled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>שימוש: {config.used.toLocaleString('he-IL')} / {config.quota.requests.toLocaleString('he-IL')}</span>
                        <span className={getStatusColor(status)}>{usagePercent.toFixed(1)}%</span>
                      </div>
                      <Progress value={usagePercent} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">תקופת מכסה</div>
                        <div className="font-medium">
                          {config.quota.period === 'minute' && 'דקה'}
                          {config.quota.period === 'hour' && 'שעה'}
                          {config.quota.period === 'day' && 'יום'}
                          {config.quota.period === 'month' && 'חודש'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">איפוס בעוד</div>
                        <div className="font-medium flex items-center gap-1">
                          <Clock size={14} />
                          {timeUntilReset > 0 
                            ? `${Math.floor(timeUntilReset / 3600)}ש ${Math.floor((timeUntilReset % 3600) / 60)}ד`
                            : 'עבר'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">עלות</div>
                        <div className="font-medium">₪{cost.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">מחיר לבקשה</div>
                        <div className="font-medium">₪{config.costPerRequest.toFixed(3)}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetQuota(apiId)}
                      >
                        <ArrowsClockwise className="ml-2" size={16} />
                        איפוס מכסה
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSimulateUsage(apiId, 10)}
                      >
                        <Play className="ml-2" size={16} />
                        סימולציה (+10)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedAPI(apiId)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Sliders className="ml-2" size={16} />
                        הגדרות
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="throttling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות Throttling</CardTitle>
              <CardDescription>שליטה על קצב הבקשות ומנגנון התור</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quotaConfigs && Object.entries(quotaConfigs).map(([apiId, config]) => (
                  <div key={apiId} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{config.apiNameHe}</h3>
                        <p className="text-sm text-muted-foreground">{config.apiName}</p>
                      </div>
                      <Switch 
                        checked={config.throttle.enabled}
                        onCheckedChange={(enabled) => handleUpdateThrottle(apiId, { enabled })}
                      />
                    </div>

                    {config.throttle.enabled && (
                      <div className="space-y-4 pr-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>בקשות מקסימליות לשנייה</Label>
                            <span className="text-sm font-medium">{config.throttle.maxRequestsPerSecond}</span>
                          </div>
                          <Slider
                            value={[config.throttle.maxRequestsPerSecond]}
                            onValueChange={([value]) => handleUpdateThrottle(apiId, { maxRequestsPerSecond: value })}
                            min={1}
                            max={20}
                            step={1}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Burst Allowance</Label>
                            <span className="text-sm font-medium">{config.throttle.burstAllowance}</span>
                          </div>
                          <Slider
                            value={[config.throttle.burstAllowance]}
                            onValueChange={([value]) => handleUpdateThrottle(apiId, { burstAllowance: value })}
                            min={0}
                            max={50}
                            step={1}
                          />
                          <p className="text-xs text-muted-foreground">
                            כמות בקשות נוספת שמותרת בפרץ קצר
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Cooldown (ms)</Label>
                            <span className="text-sm font-medium">{config.throttle.cooldownMs}ms</span>
                          </div>
                          <Slider
                            value={[config.throttle.cooldownMs]}
                            onValueChange={([value]) => handleUpdateThrottle(apiId, { cooldownMs: value })}
                            min={50}
                            max={1000}
                            step={50}
                          />
                          <p className="text-xs text-muted-foreground">
                            זמן המתנה מינימלי בין בקשות
                          </p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>תור בקשות (Queue)</Label>
                            <p className="text-xs text-muted-foreground">
                              שמירת בקשות בתור במקום דחייה
                            </p>
                          </div>
                          <Switch 
                            checked={config.throttle.queueEnabled}
                            onCheckedChange={(queueEnabled) => handleUpdateThrottle(apiId, { queueEnabled })}
                          />
                        </div>

                        {config.throttle.queueEnabled && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>גודל תור מקסימלי</Label>
                              <span className="text-sm font-medium">{config.throttle.maxQueueSize}</span>
                            </div>
                            <Slider
                              value={[config.throttle.maxQueueSize]}
                              onValueChange={([value]) => handleUpdateThrottle(apiId, { maxQueueSize: value })}
                              min={10}
                              max={200}
                              step={10}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Priority Levels</Label>
                            <p className="text-xs text-muted-foreground">
                              עדיפות לבקשות קריטיות
                            </p>
                          </div>
                          <Switch 
                            checked={config.throttle.priorityLevels}
                            onCheckedChange={(priorityLevels) => handleUpdateThrottle(apiId, { priorityLevels })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>התראות ותקציב</CardTitle>
              <CardDescription>הגדרת סף אזהרות וניהול תקציב</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quotaConfigs && Object.entries(quotaConfigs).map(([apiId, config]) => (
                  <div key={apiId} className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{config.apiNameHe}</h3>
                      <p className="text-sm text-muted-foreground">{config.apiName}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>סף אזהרה (%)</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            min={0}
                            max={100}
                            value={config.alertThresholds.warning}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0
                              setQuotaConfigs(current => {
                                if (!current) return {}
                                return {
                                  ...current,
                                  [apiId]: {
                                    ...current[apiId],
                                    alertThresholds: {
                                      ...current[apiId].alertThresholds,
                                      warning: value
                                    }
                                  }
                                }
                              })
                            }}
                          />
                          <Warning className="text-warning" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>סף קריטי (%)</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            min={0}
                            max={100}
                            value={config.alertThresholds.critical}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0
                              setQuotaConfigs(current => {
                                if (!current) return {}
                                return {
                                  ...current,
                                  [apiId]: {
                                    ...current[apiId],
                                    alertThresholds: {
                                      ...current[apiId].alertThresholds,
                                      critical: value
                                    }
                                  }
                                }
                              })
                            }}
                          />
                          <XCircle className="text-destructive" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>תקציב חודשי (₪)</Label>
                        <Input 
                          type="number"
                          min={0}
                          step={1}
                          placeholder="ללא הגבלה"
                          value={config.budgetLimit || ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : undefined
                            setQuotaConfigs(current => {
                              if (!current) return {}
                              return {
                                ...current,
                                [apiId]: {
                                  ...current[apiId],
                                  budgetLimit: value
                                }
                              }
                            })
                          }}
                        />
                        {config.budgetLimit && (
                          <p className="text-xs text-muted-foreground">
                            נוצל: ₪{(config.used * config.costPerRequest).toFixed(2)} / ₪{config.budgetLimit.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>השבת אוטומטית בהגעה למכסה</Label>
                          <p className="text-xs text-muted-foreground">
                            מונע חריגה ממכסה או תקציב
                          </p>
                        </div>
                        <Switch 
                          checked={config.autoDisableOnLimit}
                          onCheckedChange={(autoDisableOnLimit) => {
                            setQuotaConfigs(current => {
                              if (!current) return {}
                              return {
                                ...current,
                                [apiId]: {
                                  ...current[apiId],
                                  autoDisableOnLimit
                                }
                              }
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedAPI && quotaConfigs?.[selectedAPI] && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>הגדרות {quotaConfigs[selectedAPI].apiNameHe}</DialogTitle>
              <DialogDescription>עריכת מכסה ופרמטרי API</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>מכסת בקשות</Label>
                  <Input 
                    type="number"
                    min={1}
                    value={quotaConfigs[selectedAPI].quota.requests}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      handleUpdateQuota(selectedAPI, value, quotaConfigs[selectedAPI].quota.period)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>תקופה</Label>
                  <Select 
                    value={quotaConfigs[selectedAPI].quota.period}
                    onValueChange={(period: QuotaLimit['period']) => {
                      handleUpdateQuota(selectedAPI, quotaConfigs[selectedAPI].quota.requests, period)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minute">דקה</SelectItem>
                      <SelectItem value="hour">שעה</SelectItem>
                      <SelectItem value="day">יום</SelectItem>
                      <SelectItem value="month">חודש</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>מחיר לבקשה (₪)</Label>
                <Input 
                  type="number"
                  min={0}
                  step={0.001}
                  value={quotaConfigs[selectedAPI].costPerRequest}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setQuotaConfigs(current => {
                      if (!current || !selectedAPI) return current || {}
                      return {
                        ...current,
                        [selectedAPI]: {
                          ...current[selectedAPI],
                          costPerRequest: value
                        }
                      }
                    })
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                סגור
              </Button>
              <Button onClick={() => {
                setEditDialogOpen(false)
                toast.success('ההגדרות נשמרו')
              }}>
                שמור
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
