import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Database,
  CloudArrowDown,
  CheckCircle,
  WarningCircle,
  XCircle,
  ArrowsClockwise,
  Plug,
  ChartBar,
  MapTrifold
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

interface DataSource {
  id: string
  name: string
  nameHe: string
  type: 'government' | 'market' | 'gis' | 'financial'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  enabled: boolean
  lastSync?: Date
  nextSync?: Date
  recordsCount?: number
  syncInterval: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual'
  apiEndpoint: string
  description: string
}

interface DataConflict {
  id: string
  field: string
  fieldHe: string
  source1: string
  value1: any
  source2: string
  value2: any
  severity: 'low' | 'medium' | 'high'
  recommendation: string
}

export function LiveDataConnections() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'land-registry',
      name: 'Land Registry (Tabu)',
      nameHe: 'רשם המקרקעין (טאבו)',
      type: 'government',
      status: 'connected',
      enabled: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextSync: new Date(Date.now() + 22 * 60 * 60 * 1000),
      recordsCount: 1247,
      syncInterval: 'daily',
      apiEndpoint: 'api.gov.il/tabu',
      description: 'נתוני בעלות, זכויות ושעבודים'
    },
    {
      id: 'planning-admin',
      name: 'Planning Administration',
      nameHe: 'מינהל התכנון',
      type: 'government',
      status: 'connected',
      enabled: true,
      lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000),
      nextSync: new Date(Date.now() + 20 * 60 * 60 * 1000),
      recordsCount: 892,
      syncInterval: 'daily',
      apiEndpoint: 'api.gov.il/planning',
      description: 'תכניות בנין עיר, ייעוד, זכויות בנייה'
    },
    {
      id: 'tax-authority',
      name: 'Tax Authority',
      nameHe: 'רשות המיסים',
      type: 'government',
      status: 'connected',
      enabled: true,
      lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
      nextSync: new Date(Date.now() + 23 * 60 * 60 * 1000),
      recordsCount: 3421,
      syncInterval: 'daily',
      apiEndpoint: 'api.gov.il/tax',
      description: 'שווי מאזן, מס, היטלים'
    },
    {
      id: 'municipal',
      name: 'Municipal Databases',
      nameHe: 'מאגרי עירייה',
      type: 'government',
      status: 'syncing',
      enabled: true,
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      recordsCount: 567,
      syncInterval: 'hourly',
      apiEndpoint: 'api.municipality.il',
      description: 'ארנונה, היתרי בנייה, תשתיות'
    },
    {
      id: 'madlan',
      name: 'Madlan Market Data',
      nameHe: 'נתוני שוק - מדלן',
      type: 'market',
      status: 'connected',
      enabled: true,
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      nextSync: new Date(Date.now() + 45 * 60 * 1000),
      recordsCount: 15234,
      syncInterval: 'hourly',
      apiEndpoint: 'api.madlan.co.il',
      description: 'עסקאות, מחירי שוק, דירות למכירה'
    },
    {
      id: 'yad2',
      name: 'Yad2 Listings',
      nameHe: 'מודעות - יד2',
      type: 'market',
      status: 'connected',
      enabled: true,
      lastSync: new Date(Date.now() - 20 * 60 * 1000),
      nextSync: new Date(Date.now() + 40 * 60 * 1000),
      recordsCount: 28945,
      syncInterval: 'hourly',
      apiEndpoint: 'api.yad2.co.il',
      description: 'מודעות מכירה והשכרה'
    },
    {
      id: 'onmap',
      name: 'OnMap Data',
      nameHe: 'נתונים - OnMap',
      type: 'market',
      status: 'error',
      enabled: true,
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      recordsCount: 0,
      syncInterval: 'daily',
      apiEndpoint: 'api.onmap.co.il',
      description: 'מחירי שוק ומידע גיאוגרפי'
    },
    {
      id: 'gis-system',
      name: 'GIS Spatial Data',
      nameHe: 'נתונים מרחביים - GIS',
      type: 'gis',
      status: 'connected',
      enabled: true,
      lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
      nextSync: new Date(Date.now() + 18 * 60 * 60 * 1000),
      recordsCount: 4521,
      syncInterval: 'daily',
      apiEndpoint: 'gis.gov.il/api',
      description: 'מפות, גבולות, שכבות גיאוגרפיות'
    }
  ])

  const [conflicts, setConflicts] = useState<DataConflict[]>([
    {
      id: 'c1',
      field: 'buildYear',
      fieldHe: 'שנת בנייה',
      source1: 'Land Registry',
      value1: 1995,
      source2: 'Tax Authority',
      value2: 1996,
      severity: 'low',
      recommendation: 'בדוק תעודת גמר בנייה'
    },
    {
      id: 'c2',
      field: 'builtArea',
      fieldHe: 'שטח בנוי',
      source1: 'Municipal',
      value1: 87,
      source2: 'Tax Authority',
      value2: 92,
      severity: 'high',
      recommendation: 'סטייה משמעותית - דרוש אימות שטח'
    }
  ])

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={20} weight="fill" className="text-success" />
      case 'syncing':
        return <ArrowsClockwise size={20} weight="bold" className="text-primary animate-spin" />
      case 'error':
        return <XCircle size={20} weight="fill" className="text-destructive" />
      case 'disconnected':
        return <WarningCircle size={20} weight="fill" className="text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-success/20 text-success border-success">מחובר</Badge>
      case 'syncing':
        return <Badge className="bg-primary/20 text-primary border-primary">מסנכרן...</Badge>
      case 'error':
        return <Badge className="bg-destructive/20 text-destructive border-destructive">שגיאה</Badge>
      case 'disconnected':
        return <Badge variant="outline">מנותק</Badge>
    }
  }

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'government':
        return <Database size={20} weight="duotone" className="text-primary" />
      case 'market':
        return <ChartBar size={20} weight="duotone" className="text-accent" />
      case 'gis':
        return <MapTrifold size={20} weight="duotone" className="text-success" />
      case 'financial':
        return <CloudArrowDown size={20} weight="duotone" className="text-warning" />
    }
  }

  const handleToggle = (id: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    )
    toast.success('הגדרות עודכנו')
  }

  const handleRefresh = (id: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === id ? { ...source, status: 'syncing' } : source
      )
    )
    
    setTimeout(() => {
      setDataSources(prev =>
        prev.map(source =>
          source.id === id
            ? {
                ...source,
                status: 'connected',
                lastSync: new Date(),
                nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000)
              }
            : source
        )
      )
      toast.success('סנכרון הושלם בהצלחה')
    }, 2000)
  }

  const handleRefreshAll = () => {
    setDataSources(prev => prev.map(source => ({ ...source, status: 'syncing' })))
    
    setTimeout(() => {
      setDataSources(prev =>
        prev.map(source => ({
          ...source,
          status: source.id === 'onmap' ? 'error' : 'connected',
          lastSync: new Date(),
          nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }))
      )
      toast.success('סנכרון כללי הושלם')
    }, 3000)
  }

  const connectedSources = dataSources.filter(s => s.status === 'connected' && s.enabled).length
  const totalSources = dataSources.filter(s => s.enabled).length
  const healthScore = Math.round((connectedSources / totalSources) * 100)

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="glass-effect border-border/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent mb-2">
              מקורות נתונים חיצוניים
            </h2>
            <p className="text-sm text-muted-foreground">
              חיבורים לבסיסי נתונים ממשלתיים, מסחריים ומרחביים
            </p>
          </div>
          <Button onClick={handleRefreshAll} className="gap-2">
            <ArrowsClockwise size={16} weight="bold" />
            סנכרון כללי
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-effect border-primary/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Plug size={24} weight="duotone" className="text-primary" />
              <h3 className="font-semibold">מקורות פעילים</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-primary">
              {connectedSources}/{totalSources}
            </div>
          </Card>

          <Card className="glass-effect border-accent/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Database size={24} weight="duotone" className="text-accent" />
              <h3 className="font-semibold">רשומות כולל</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-accent">
              {dataSources.reduce((sum, s) => sum + (s.recordsCount || 0), 0).toLocaleString('he-IL')}
            </div>
          </Card>

          <Card className="glass-effect border-success/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={24} weight="duotone" className="text-success" />
              <h3 className="font-semibold">תקינות מערכת</h3>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-3xl font-bold text-success">{healthScore}%</div>
              <Progress value={healthScore} className="h-2" />
            </div>
          </Card>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-border/50">
          <div className="p-6 border-b border-border/30">
            <h3 className="text-lg font-semibold">מקורות ממשלתיים</h3>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-6 space-y-4">
              {dataSources.filter(s => s.type === 'government').map(source => (
                <Card key={source.id} className="glass-effect border-border/30 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(source.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{source.nameHe}</h4>
                          {getStatusIcon(source.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{source.description}</p>
                        {source.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            עדכון אחרון: {format(source.lastSync, 'HH:mm dd/MM/yy', { locale: he })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Switch checked={source.enabled} onCheckedChange={() => handleToggle(source.id)} />
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    {getStatusBadge(source.status)}
                    {source.recordsCount !== undefined && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {source.recordsCount.toLocaleString('he-IL')} רשומות
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRefresh(source.id)}
                      disabled={source.status === 'syncing'}
                    >
                      <ArrowsClockwise size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="glass-effect border-border/50">
          <div className="p-6 border-b border-border/30">
            <h3 className="text-lg font-semibold">מקורות מסחריים</h3>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-6 space-y-4">
              {dataSources.filter(s => s.type === 'market' || s.type === 'gis').map(source => (
                <Card key={source.id} className="glass-effect border-border/30 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(source.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{source.nameHe}</h4>
                          {getStatusIcon(source.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{source.description}</p>
                        {source.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            עדכון אחרון: {format(source.lastSync, 'HH:mm dd/MM/yy', { locale: he })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Switch checked={source.enabled} onCheckedChange={() => handleToggle(source.id)} />
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    {getStatusBadge(source.status)}
                    {source.recordsCount !== undefined && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {source.recordsCount.toLocaleString('he-IL')} רשומות
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRefresh(source.id)}
                      disabled={source.status === 'syncing'}
                    >
                      <ArrowsClockwise size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {conflicts.length > 0 && (
        <Card className="glass-effect border-warning/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <WarningCircle size={24} weight="duotone" className="text-warning" />
            <h3 className="text-lg font-semibold">קונפליקטים בנתונים</h3>
            <Badge className="bg-warning/20 text-warning border-warning">{conflicts.length}</Badge>
          </div>
          <div className="space-y-3">
            {conflicts.map(conflict => (
              <Card key={conflict.id} className="glass-effect border-border/30 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold mb-1">{conflict.fieldHe}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">{conflict.source1}</div>
                        <div className="font-mono font-bold">{conflict.value1}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">{conflict.source2}</div>
                        <div className="font-mono font-bold">{conflict.value2}</div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      conflict.severity === 'high'
                        ? 'bg-destructive/20 text-destructive border-destructive'
                        : conflict.severity === 'medium'
                        ? 'bg-warning/20 text-warning border-warning'
                        : 'bg-muted/20'
                    }
                  >
                    {conflict.severity === 'high' ? 'גבוהה' : conflict.severity === 'medium' ? 'בינונית' : 'נמוכה'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                  💡 {conflict.recommendation}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
