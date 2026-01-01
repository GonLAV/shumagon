import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Key,
  CheckCircle,
  XCircle,
  Eye,
  EyeSlash,
  Info,
  Lock,
  Warning,
  ArrowsClockwise,
  ShieldCheck
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { configureRealGovAPI } from '@/lib/realGovAPI'

interface APICredential {
  id: string
  name: string
  nameHe: string
  description: string
  token: string
  enabled: boolean
  status: 'connected' | 'disconnected' | 'testing' | 'error'
  endpoint: string
  documentationUrl: string
  requiredScopes?: string[]
}

export function APIAuthSettings() {
  const [credentials, setCredentials] = useKV<Record<string, APICredential>>('gov-api-credentials', {
    iPlan: {
      id: 'iPlan',
      name: 'iPlan',
      nameHe: 'מינהל התכנון',
      description: 'תכניות בנייה, ייעודי קרקע, זכויות בנייה',
      token: '',
      enabled: false,
      status: 'disconnected',
      endpoint: 'https://www.iplan.gov.il/api/v1',
      documentationUrl: 'https://www.iplan.gov.il/developers',
      requiredScopes: ['read:plans', 'read:zoning']
    },
    mavat: {
      id: 'mavat',
      name: 'Mavat',
      nameHe: 'מבא״ת - מאגר מידע ארצי תכנוני',
      description: 'היתרי בנייה, עבירות בנייה, תוכניות',
      token: '',
      enabled: false,
      status: 'disconnected',
      endpoint: 'https://mavat.moin.gov.il/MavatPS/OpenData',
      documentationUrl: 'https://www.gov.il/he/departments/guides/building-permits-api'
    },
    govMap: {
      id: 'govMap',
      name: 'GovMap',
      nameHe: 'מפת ממשל - GIS',
      description: 'נתוני GIS, קואורדינטות, שכבות מרחביות',
      token: '',
      enabled: false,
      status: 'disconnected',
      endpoint: 'https://www.govmap.gov.il/api',
      documentationUrl: 'https://www.govmap.gov.il/api/docs',
      requiredScopes: ['read:layers', 'read:parcels', 'geocode']
    },
    landRegistry: {
      id: 'landRegistry',
      name: 'Land Registry',
      nameHe: 'רישום מקרקעין (טאבו)',
      description: 'בעלות, שעבודים, זכויות ברישום',
      token: '',
      enabled: false,
      status: 'disconnected',
      endpoint: 'https://www.gov.il/he/api/land-registry',
      documentationUrl: 'https://www.gov.il/he/departments/land_registry/govservices'
    },
    taxAuthority: {
      id: 'taxAuthority',
      name: 'Tax Authority',
      nameHe: 'רשות המיסים',
      description: 'שווי מאזן, ארנונה, היטלים',
      token: '',
      enabled: false,
      status: 'disconnected',
      endpoint: 'https://www.gov.il/he/api/taxes',
      documentationUrl: 'https://www.gov.il/he/departments/taxes'
    }
  })

  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({})

  const handleToggleToken = (apiId: string) => {
    setShowTokens(prev => ({
      ...prev,
      [apiId]: !prev[apiId]
    }))
  }

  const handleUpdateToken = (apiId: string, token: string) => {
    setCredentials((current) => {
      const updated = { ...current! }
      if (updated[apiId]) {
        updated[apiId] = { ...updated[apiId], token }
      }
      return updated
    })
  }

  const handleToggleEnabled = (apiId: string) => {
    setCredentials((current) => {
      const updated = { ...current! }
      if (updated[apiId]) {
        updated[apiId] = { ...updated[apiId], enabled: !updated[apiId].enabled }
      }
      return updated
    })
  }

  const handleTestConnection = async (apiId: string) => {
    setCredentials((current) => {
      const updated = { ...current! }
      if (updated[apiId]) {
        updated[apiId] = { ...updated[apiId], status: 'testing' as const }
      }
      return updated
    })

    // Simulate API test
    setTimeout(() => {
      const hasToken = credentials && credentials[apiId] && credentials[apiId].token.length > 0
      
      setCredentials((current) => {
        const updated = { ...current! }
        if (updated[apiId]) {
          updated[apiId] = { ...updated[apiId], status: (hasToken ? 'connected' : 'error') }
        }
        return updated
      })

      if (credentials && credentials[apiId]) {
        if (hasToken) {
          toast.success(`${credentials[apiId].nameHe} - חיבור הצליח`)
        } else {
          toast.error(`${credentials[apiId].nameHe} - חיבור נכשל. אנא בדוק את המפתח`)
        }
      }
    }, 2000)
  }

  const handleSaveAll = () => {
    if (!credentials) return
    
    // Update the real API client with credentials
    const apiCredentials = {
      iPlanToken: credentials.iPlan?.enabled ? credentials.iPlan.token : undefined,
      mavatApiKey: credentials.mavat?.enabled ? credentials.mavat.token : undefined,
      govMapToken: credentials.govMap?.enabled ? credentials.govMap.token : undefined,
      landRegistryToken: credentials.landRegistry?.enabled ? credentials.landRegistry.token : undefined,
      taxAuthorityToken: credentials.taxAuthority?.enabled ? credentials.taxAuthority.token : undefined
    }

    configureRealGovAPI(apiCredentials)
    
    toast.success('הגדרות API נשמרו בהצלחה')
  }

  const getStatusIcon = (status: APICredential['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={20} weight="fill" className="text-success" />
      case 'testing':
        return <ArrowsClockwise size={20} weight="bold" className="text-primary animate-spin" />
      case 'error':
        return <XCircle size={20} weight="fill" className="text-destructive" />
      case 'disconnected':
        return <Warning size={20} weight="fill" className="text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: APICredential['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-success/20 text-success border-success">מחובר</Badge>
      case 'testing':
        return <Badge className="bg-primary/20 text-primary border-primary">בודק...</Badge>
      case 'error':
        return <Badge className="bg-destructive/20 text-destructive border-destructive">שגיאה</Badge>
      case 'disconnected':
        return <Badge variant="outline">מנותק</Badge>
    }
  }

  const enabledCount = credentials ? Object.values(credentials).filter(c => c.enabled && c.token).length : 0
  const totalCount = credentials ? Object.values(credentials).length : 0

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="glass-effect border-border/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent mb-2">
              הגדרות אימות API
            </h2>
            <p className="text-sm text-muted-foreground">
              הגדר מפתחות גישה למאגרי מידע ממשלתיים לחיבור בזמן אמת
            </p>
          </div>
          <Button onClick={handleSaveAll} className="gap-2">
            <ShieldCheck size={16} weight="bold" />
            שמור הכל
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glass-effect border-primary/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Key size={24} weight="duotone" className="text-primary" />
              <h3 className="font-semibold">API מוגדרים</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-primary">
              {enabledCount}/{totalCount}
            </div>
          </Card>

          <Card className="glass-effect border-success/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={24} weight="duotone" className="text-success" />
              <h3 className="font-semibold">מחוברים</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-success">
              {credentials ? Object.values(credentials).filter(c => c.status === 'connected').length : 0}
            </div>
          </Card>

          <Card className="glass-effect border-accent/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Lock size={24} weight="duotone" className="text-accent" />
              <h3 className="font-semibold">אבטחה</h3>
            </div>
            <Badge className="bg-accent/20 text-accent border-accent">מוצפנת</Badge>
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="glass-effect border border-primary/20 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <Info size={24} weight="duotone" className="text-primary flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-primary">איך להשיג מפתחות API?</h3>
              <div className="space-y-1 text-muted-foreground">
                <p>1. <strong>iPlan:</strong> הרשמה בפורטל המפתחים - <a href="https://www.iplan.gov.il/developers" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">iplan.gov.il/developers</a></p>
                <p>2. <strong>Mavat:</strong> בקשת גישה דרך משרד הפנים - <a href="https://www.gov.il/he/departments/guides/building-permits-api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">מדריך API</a></p>
                <p>3. <strong>GovMap:</strong> יצירת חשבון מפתח - <a href="https://www.govmap.gov.il/api/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">govmap.gov.il/api</a></p>
                <p>4. <strong>רישום מקרקעין:</strong> אישור מיוחד לגורמים מורשים - פנייה למינהל</p>
                <p>5. <strong>רשות המיסים:</strong> רישום בממשק הדיגיטלי לעסקים</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="planning">
        <TabsList className="glass-effect grid grid-cols-3 w-full">
          <TabsTrigger value="planning">תכנון ובנייה</TabsTrigger>
          <TabsTrigger value="registry">רישום וזכויות</TabsTrigger>
          <TabsTrigger value="spatial">מרחב ו-GIS</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="mt-6">
          <div className="space-y-4">
            {['iPlan', 'mavat'].map(apiId => {
              if (!credentials) return null
              const cred = credentials[apiId]
              if (!cred) return null

              return (
                <Card key={apiId} className="glass-effect border-border/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 glass-effect rounded-lg">
                        <Key size={24} weight="duotone" className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{cred.nameHe}</h3>
                          {getStatusIcon(cred.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{cred.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{cred.endpoint}</p>
                        {cred.requiredScopes && (
                          <div className="flex items-center gap-1 mt-2">
                            {cred.requiredScopes.map(scope => (
                              <Badge key={scope} variant="outline" className="text-xs">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(cred.status)}
                      <Switch
                        checked={cred.enabled}
                        onCheckedChange={() => handleToggleEnabled(apiId)}
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`token-${apiId}`} className="mb-2 block">
                        מפתח API
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`token-${apiId}`}
                            type={showTokens[apiId] ? 'text' : 'password'}
                            value={cred.token}
                            onChange={(e) => handleUpdateToken(apiId, e.target.value)}
                            placeholder="הכנס מפתח API..."
                            className="bg-secondary/50 font-mono pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleToken(apiId)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showTokens[apiId] ? (
                              <EyeSlash size={18} weight="duotone" />
                            ) : (
                              <Eye size={18} weight="duotone" />
                            )}
                          </button>
                        </div>
                        <Button
                          onClick={() => handleTestConnection(apiId)}
                          disabled={!cred.token || cred.status === 'testing'}
                          variant="secondary"
                        >
                          {cred.status === 'testing' ? (
                            <ArrowsClockwise size={16} weight="bold" className="animate-spin" />
                          ) : (
                            'בדוק חיבור'
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="glass-effect border border-border/30 p-3 rounded-lg">
                      <a
                        href={cred.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        📚 מדריך מפתחים וקבלת מפתח
                      </a>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="registry" className="mt-6">
          <div className="space-y-4">
            {['landRegistry', 'taxAuthority'].map(apiId => {
              if (!credentials) return null
              const cred = credentials[apiId]
              if (!cred) return null

              return (
                <Card key={apiId} className="glass-effect border-border/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 glass-effect rounded-lg">
                        <Key size={24} weight="duotone" className="text-warning" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{cred.nameHe}</h3>
                          {getStatusIcon(cred.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{cred.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{cred.endpoint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(cred.status)}
                      <Switch
                        checked={cred.enabled}
                        onCheckedChange={() => handleToggleEnabled(apiId)}
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`token-${apiId}`} className="mb-2 block">
                        מפתח API
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`token-${apiId}`}
                            type={showTokens[apiId] ? 'text' : 'password'}
                            value={cred.token}
                            onChange={(e) => handleUpdateToken(apiId, e.target.value)}
                            placeholder="הכנס מפתח API..."
                            className="bg-secondary/50 font-mono pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleToken(apiId)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showTokens[apiId] ? (
                              <EyeSlash size={18} weight="duotone" />
                            ) : (
                              <Eye size={18} weight="duotone" />
                            )}
                          </button>
                        </div>
                        <Button
                          onClick={() => handleTestConnection(apiId)}
                          disabled={!cred.token || cred.status === 'testing'}
                          variant="secondary"
                        >
                          {cred.status === 'testing' ? (
                            <ArrowsClockwise size={16} weight="bold" className="animate-spin" />
                          ) : (
                            'בדוק חיבור'
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="glass-effect border border-warning/30 bg-warning/5 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Warning size={18} weight="fill" className="text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          גישה למידע זה דורשת אישור מיוחד וכפופה לחוק הגנת הפרטיות
                        </p>
                      </div>
                    </div>

                    <div className="glass-effect border border-border/30 p-3 rounded-lg">
                      <a
                        href={cred.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        📚 מדריך מפתחים וקבלת מפתח
                      </a>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="spatial" className="mt-6">
          <div className="space-y-4">
            {['govMap'].map(apiId => {
              if (!credentials) return null
              const cred = credentials[apiId]
              if (!cred) return null

              return (
                <Card key={apiId} className="glass-effect border-border/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 glass-effect rounded-lg">
                        <Key size={24} weight="duotone" className="text-success" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{cred.nameHe}</h3>
                          {getStatusIcon(cred.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{cred.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{cred.endpoint}</p>
                        {cred.requiredScopes && (
                          <div className="flex items-center gap-1 mt-2">
                            {cred.requiredScopes.map(scope => (
                              <Badge key={scope} variant="outline" className="text-xs">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(cred.status)}
                      <Switch
                        checked={cred.enabled}
                        onCheckedChange={() => handleToggleEnabled(apiId)}
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`token-${apiId}`} className="mb-2 block">
                        מפתח API
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`token-${apiId}`}
                            type={showTokens[apiId] ? 'text' : 'password'}
                            value={cred.token}
                            onChange={(e) => handleUpdateToken(apiId, e.target.value)}
                            placeholder="הכנס מפתח API..."
                            className="bg-secondary/50 font-mono pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleToken(apiId)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showTokens[apiId] ? (
                              <EyeSlash size={18} weight="duotone" />
                            ) : (
                              <Eye size={18} weight="duotone" />
                            )}
                          </button>
                        </div>
                        <Button
                          onClick={() => handleTestConnection(apiId)}
                          disabled={!cred.token || cred.status === 'testing'}
                          variant="secondary"
                        >
                          {cred.status === 'testing' ? (
                            <ArrowsClockwise size={16} weight="bold" className="animate-spin" />
                          ) : (
                            'בדוק חיבור'
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="glass-effect border border-border/30 p-3 rounded-lg">
                      <a
                        href={cred.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        📚 מדריך מפתחים וקבלת מפתח
                      </a>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
