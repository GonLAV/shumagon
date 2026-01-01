import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Property, Client } from '@/lib/types'
import { generateMockProperties, generateMockClients } from '@/lib/mockData'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dashboard } from '@/components/Dashboard'
import { ClientManager } from '@/components/ClientManager'
import { MarketInsights } from '@/components/MarketInsights'
import { ClientPortal } from '@/components/ClientPortal'
import { ClientPortalManagement } from '@/components/ClientPortalManagement'
import { BusinessManagement } from '@/components/BusinessManagement'
import { PropertyDigitalTwin } from '@/components/PropertyDigitalTwin'
import { LiveDataConnections } from '@/components/LiveDataConnections'
import { TeamCollaboration } from '@/components/TeamCollaboration'
import { DevelopmentRightsCalculator } from '@/components/DevelopmentRightsCalculator'
import { EmailSequences } from '@/components/EmailSequences'
import { House, ChartBar, Users, UserCircle, CurrencyDollar, Flask, Palette, Cube, Database, UsersThree, Calculator, ListChecks, EnvelopeSimple, Lightning, FolderOpen, FileText, Buildings, ClockCounterClockwise, ShieldCheck, Robot, CloudArrowDown } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { AppHeader } from '@/components/app/AppHeader'
import { PropertiesTab } from '@/components/app/PropertiesTab'
import { ValuationEngineTester } from '@/components/ValuationEngineTester'
import { BrandingSettingsTab } from '@/components/BrandingSettingsTab'
import { BulkValuation } from '@/components/BulkValuation'
import { EmailHistory } from '@/components/EmailHistory'
import { CaseManagement } from '@/components/CaseManagement'
import { StandardizedReports } from '@/components/StandardizedReports'
import { MultiUnitManager } from '@/components/MultiUnitManager'
import { TeamManagement } from '@/components/TeamManagement'
import { AuditTrail } from '@/components/AuditTrail'
import { AIInsights } from '@/components/AIInsights'
import { TransactionImporter } from '@/components/TransactionImporter'
import { AutomatedReports } from '@/components/AutomatedReports'
import { ProfessionalCalculators } from '@/components/ProfessionalCalculators'
import { MultiUnitDistributionCalculator } from '@/components/MultiUnitDistributionCalculator'

function App() {
  const [properties, setProperties] = useKV<Property[]>('properties', generateMockProperties())
  const [clients, setClients] = useKV<Client[]>('clients', generateMockClients())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isCreatingProperty, setIsCreatingProperty] = useState(false)
  const [isClientPortalMode, setIsClientPortalMode] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('portal') === 'true') {
      setIsClientPortalMode(true)
    }
  }, [])

  const handleSaveProperty = (property: Property) => {
    setProperties((current) => {
      const arr = current || []
      const index = arr.findIndex(p => p.id === property.id)
      if (index >= 0) {
        const updated = [...arr]
        updated[index] = property
        return updated
      }
      return [...arr, property]
    })
    setIsCreatingProperty(false)
    setSelectedProperty(null)
  }

  const handleDeleteProperty = (id: string) => {
    setProperties((current) => (current || []).filter(p => p.id !== id))
    setSelectedProperty(null)
  }

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property)
    setActiveTab('properties')
  }

  const handleCreateNew = () => {
    setSelectedProperty(null)
    setIsCreatingProperty(true)
    setActiveTab('properties')
  }

  if (isClientPortalMode) {
    return (
      <>
        <ClientPortal 
          clients={clients || []} 
          properties={properties || []}
          onBackToAdmin={() => {
            setIsClientPortalMode(false)
            window.history.replaceState({}, '', window.location.pathname)
          }}
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <AppHeader onCreateNew={handleCreateNew} />

      <main className="container mx-auto px-6 py-8 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="mb-8 glass-effect p-1.5 grid grid-cols-6 lg:grid-cols-24 gap-1">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <House size={18} weight="duotone" />
              <span className="hidden sm:inline">לוח בקרה</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <House size={18} weight="duotone" />
              <span className="hidden sm:inline">נכסים</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users size={18} weight="duotone" />
              <span className="hidden sm:inline">לקוחות</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ChartBar size={18} weight="duotone" />
              <span className="hidden sm:inline">ניתוח שוק</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ListChecks size={18} weight="duotone" />
              <span className="hidden sm:inline">שומה מרובה</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <EnvelopeSimple size={18} weight="duotone" />
              <span className="hidden sm:inline">דוחות שנשלחו</span>
            </TabsTrigger>
            <TabsTrigger value="sequences" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lightning size={18} weight="duotone" />
              <span className="hidden sm:inline">רצפי מעקב</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CurrencyDollar size={18} weight="duotone" />
              <span className="hidden sm:inline">ניהול עסקי</span>
            </TabsTrigger>
            <TabsTrigger value="portal" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCircle size={18} weight="duotone" />
              <span className="hidden sm:inline">פורטל לקוחות</span>
            </TabsTrigger>
            <TabsTrigger value="tester" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Flask size={18} weight="duotone" />
              <span className="hidden sm:inline">בדיקת מנוע</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette size={18} weight="duotone" />
              <span className="hidden sm:inline">מיתוג PDF</span>
            </TabsTrigger>
            <TabsTrigger value="digital-twin" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Cube size={18} weight="duotone" />
              <span className="hidden sm:inline">תאום דיגיטלי</span>
            </TabsTrigger>
            <TabsTrigger value="data-sources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database size={18} weight="duotone" />
              <span className="hidden sm:inline">מקורות נתונים</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UsersThree size={18} weight="duotone" />
              <span className="hidden sm:inline">צוות</span>
            </TabsTrigger>
            <TabsTrigger value="development" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calculator size={18} weight="duotone" />
              <span className="hidden sm:inline">זכויות בנייה</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FolderOpen size={18} weight="duotone" />
              <span className="hidden sm:inline">ניהול תיקים</span>
            </TabsTrigger>
            <TabsTrigger value="standardized" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText size={18} weight="duotone" />
              <span className="hidden sm:inline">דוחות תקניים</span>
            </TabsTrigger>
            <TabsTrigger value="multi-unit" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Buildings size={18} weight="duotone" />
              <span className="hidden sm:inline">ריבוי יחידות</span>
            </TabsTrigger>
            <TabsTrigger value="team-manage" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ShieldCheck size={18} weight="duotone" />
              <span className="hidden sm:inline">צוות והרשאות</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClockCounterClockwise size={18} weight="duotone" />
              <span className="hidden sm:inline">Audit Trail</span>
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Robot size={18} weight="duotone" />
              <span className="hidden sm:inline">AI תובנות</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CloudArrowDown size={18} weight="duotone" />
              <span className="hidden sm:inline">ייבוא עסקאות</span>
            </TabsTrigger>
            <TabsTrigger value="automated-reports" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ChartBar size={18} weight="duotone" />
              <span className="hidden sm:inline">דוחות מגמות</span>
            </TabsTrigger>
            <TabsTrigger value="calculators" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calculator size={18} weight="duotone" />
              <span className="hidden sm:inline">מחשבונים</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Buildings size={18} weight="duotone" />
              <span className="hidden sm:inline">חלוקת יחידות</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard
              properties={properties || []}
              clients={clients || []}
              onSelectProperty={handleSelectProperty}
              onCreateNew={handleCreateNew}
            />
          </TabsContent>

          <TabsContent value="properties" className="mt-0">
            <PropertiesTab
              properties={properties || []}
              clients={clients || []}
              selectedProperty={selectedProperty}
              isCreatingProperty={isCreatingProperty}
              onSelectProperty={(property) => setSelectedProperty(property)}
              onCreateNew={handleCreateNew}
              onBackToList={() => {
                setSelectedProperty(null)
                setIsCreatingProperty(false)
              }}
              onStartEditing={(property) => {
                setSelectedProperty(property)
                setIsCreatingProperty(true)
              }}
              onSaveProperty={handleSaveProperty}
              onDeleteProperty={handleDeleteProperty}
            />
          </TabsContent>

          <TabsContent value="clients" className="mt-0">
            <ClientManager
              clients={clients || []}
              properties={properties || []}
              onUpdateClients={setClients}
              onSelectProperty={handleSelectProperty}
            />
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <MarketInsights properties={properties || []} />
          </TabsContent>

          <TabsContent value="bulk" className="mt-0">
            <BulkValuation 
              properties={properties || []} 
              onUpdateProperty={handleSaveProperty}
            />
          </TabsContent>

          <TabsContent value="email" className="mt-0">
            <EmailHistory />
          </TabsContent>

          <TabsContent value="sequences" className="mt-0">
            <EmailSequences />
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <BusinessManagement
              properties={properties || []}
              clients={clients || []}
            />
          </TabsContent>

          <TabsContent value="portal" className="mt-0">
            <ClientPortalManagement
              clients={clients || []}
              properties={properties || []}
              onSelectProperty={handleSelectProperty}
            />
          </TabsContent>

          <TabsContent value="tester" className="mt-0">
            <ValuationEngineTester />
          </TabsContent>

          <TabsContent value="branding" className="mt-0">
            <BrandingSettingsTab />
          </TabsContent>

          <TabsContent value="digital-twin" className="mt-0">
            {properties && properties.length > 0 ? (
              <PropertyDigitalTwin property={properties[0]} />
            ) : (
              <div className="text-center text-muted-foreground py-12">
                אין נכסים להצגה
              </div>
            )}
          </TabsContent>

          <TabsContent value="data-sources" className="mt-0">
            <LiveDataConnections />
          </TabsContent>

          <TabsContent value="team" className="mt-0">
            <TeamCollaboration />
          </TabsContent>

          <TabsContent value="development" className="mt-0">
            <DevelopmentRightsCalculator />
          </TabsContent>

          <TabsContent value="cases" className="mt-0">
            <CaseManagement properties={properties || []} clients={clients || []} />
          </TabsContent>

          <TabsContent value="standardized" className="mt-0">
            <StandardizedReports properties={properties || []} clients={clients || []} />
          </TabsContent>

          <TabsContent value="multi-unit" className="mt-0">
            <MultiUnitManager />
          </TabsContent>

          <TabsContent value="team-manage" className="mt-0">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <AuditTrail />
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-0">
            <AIInsights />
          </TabsContent>

          <TabsContent value="import" className="mt-0">
            <TransactionImporter />
          </TabsContent>

          <TabsContent value="automated-reports" className="mt-0">
            <AutomatedReports />
          </TabsContent>

          <TabsContent value="calculators" className="mt-0">
            <ProfessionalCalculators />
          </TabsContent>

          <TabsContent value="distribution" className="mt-0">
            <MultiUnitDistributionCalculator />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App
