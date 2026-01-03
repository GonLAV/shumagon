import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Property, Client } from '@/lib/types'
import { generateMockProperties, generateMockClients } from '@/lib/mockData'
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
import { AppSidebar } from '@/components/app/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { RentalDataManager } from '@/components/RentalDataManager'
import { RentalAnalyzer } from '@/components/RentalAnalyzer'
import { BettermentLevyCalculator } from '@/components/BettermentLevyCalculator'
import { PropertyHistoricalSearch } from '@/components/PropertyHistoricalSearch'
import { MarketDataSync } from '@/components/MarketDataSync'
import { APIAuthSettings } from '@/components/APIAuthSettings'
import { APIUsageAnalytics } from '@/components/APIUsageAnalytics'
import { APIQuotaManager } from '@/components/APIQuotaManager'
import { OfficeValuationCalculator } from '@/components/OfficeValuationCalculator'
import { QuickerCalculator } from '@/components/QuickerCalculator'
import { ResidentialValuationCalculator } from '@/components/ResidentialValuationCalculator'
import { CommercialValuationCalculator } from '@/components/CommercialValuationCalculator'
import { LandValuationCalculator } from '@/components/LandValuationCalculator'
import { RealBuildingRightsViewer } from '@/components/RealBuildingRightsViewer'
import { TransactionsMap } from '@/components/TransactionsMap'
import { DataGovValuation } from '@/components/DataGovValuation'
import { GISNViewer } from '@/components/GISNViewer'
import { GISNDiff } from '@/components/GISNDiff'
import { GISNArcGIS } from '@/components/GISNArcGIS'
import { TabaExtractor } from '@/components/TabaExtractor'
import GISNDocScanner from '@/components/GISNDocScanner'
import OCRHelper from '@/components/OCRHelper'
import IngestionHelper from '@/components/IngestionHelper'
import DataGovResourceCheck from '@/components/DataGovResourceCheck'
import TasksDashboard from '@/components/TasksDashboard'
import IncomeReport from '@/components/IncomeReport'

function App() {
  const [properties, setProperties] = useKV<Property[]>('properties', generateMockProperties())
  const [clients, setClients] = useKV<Client[]>('clients', generateMockClients())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isCreatingProperty, setIsCreatingProperty] = useState(false)
  const [isClientPortalMode, setIsClientPortalMode] = useState(false)
  const [rtl, setRtl] = useKV<boolean>('rtl', true)

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            properties={properties || []}
            clients={clients || []}
            onSelectProperty={handleSelectProperty}
            onCreateNew={handleCreateNew}
          />
        )
      case 'properties':
        return (
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
        )
      case 'clients':
        return (
          <ClientManager
            clients={clients || []}
            properties={properties || []}
            onUpdateClients={setClients}
            onSelectProperty={handleSelectProperty}
          />
        )
      case 'insights':
        return <MarketInsights properties={properties || []} />
      case 'bulk':
        return (
          <BulkValuation 
            properties={properties || []} 
            onUpdateProperty={handleSaveProperty}
          />
        )
      case 'email':
        return <EmailHistory />
      case 'sequences':
        return <EmailSequences />
      case 'business':
        return (
          <BusinessManagement
            properties={properties || []}
            clients={clients || []}
          />
        )
      case 'portal':
        return (
          <ClientPortalManagement
            clients={clients || []}
            properties={properties || []}
            onSelectProperty={handleSelectProperty}
          />
        )
      case 'tester':
        return <ValuationEngineTester />
      case 'branding':
        return <BrandingSettingsTab />
      case 'digital-twin':
        return properties && properties.length > 0 ? (
          <PropertyDigitalTwin property={properties[0]} />
        ) : (
          <div className="text-center text-muted-foreground py-12">
            אין נכסים להצגה
          </div>
        )
      case 'data-sources':
        return <LiveDataConnections />
      case 'team':
        return <TeamCollaboration />
      case 'development':
        return <DevelopmentRightsCalculator />
      case 'cases':
        return <CaseManagement properties={properties || []} clients={clients || []} />
      case 'tasks':
        return <TasksDashboard />
      case 'income-report':
        return <IncomeReport />
      case 'standardized':
        return <StandardizedReports properties={properties || []} clients={clients || []} />
      case 'multi-unit':
        return <MultiUnitManager />
      case 'team-manage':
        return <TeamManagement />
      case 'audit':
        return <AuditTrail />
      case 'ai-insights':
        return <AIInsights />
      case 'import':
        return <TransactionImporter />
      case 'automated-reports':
        return <AutomatedReports />
      case 'calculators':
        return (
          <ProfessionalCalculators 
            properties={properties || []}
            onUpdateProperty={handleSaveProperty}
          />
        )
      case 'distribution':
        return <MultiUnitDistributionCalculator />
      case 'rental-data':
        return <RentalDataManager />
      case 'rental-analysis':
        return <RentalAnalyzer />
      case 'betterment-levy':
        return <BettermentLevyCalculator />
      case 'historical-search':
        return <PropertyHistoricalSearch />
      case 'market-sync':
        return <MarketDataSync />
      case 'api-settings':
        return <APIAuthSettings />
      case 'api-analytics':
        return <APIUsageAnalytics />
      case 'api-quota':
        return <APIQuotaManager />
      case 'office-valuation':
        return <OfficeValuationCalculator />
      case 'residential-valuation':
        return <ResidentialValuationCalculator />
      case 'commercial-valuation':
        return <CommercialValuationCalculator />
      case 'land-valuation':
        return <LandValuationCalculator />
      case 'quicker':
        return <QuickerCalculator />
      case 'real-building-rights':
        return <RealBuildingRightsViewer />
      case 'transactions-map':
        return <TransactionsMap />
      case 'gisn-viewer':
        return <GISNViewer />
      case 'gisn-diff':
        return <GISNDiff />
      case 'gisn-arcgis':
        return <GISNArcGIS />
      case 'gisn-doc-scanner':
        return <GISNDocScanner />
      case 'ocr-helper':
        return <OCRHelper />
      case 'ingestion-helper':
        return <IngestionHelper />
      case 'data-gov-check':
        return <DataGovResourceCheck />
      case 'taba-extractor':
        return <TabaExtractor />
      case 'data-gov-valuation':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">🇮🇱 שמאות עם Data.gov.il</h1>
              <p className="text-muted-foreground">
                שמאות מקצועית מבוססת נתונים אמיתיים ממאגרי הממשלה הישראלית
              </p>
            </div>
            <DataGovValuation
              propertyId="demo-property"
              initialCity=""
              initialStreet=""
              initialArea={0}
            />
          </div>
        )
      default:
        return (
          <Dashboard
            properties={properties || []}
            clients={clients || []}
            onSelectProperty={handleSelectProperty}
            onCreateNew={handleCreateNew}
          />
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full flex-row-reverse" dir={rtl ? 'rtl' : 'ltr'}>
        <AppSidebar activeView={activeTab} onNavigate={setActiveTab} />

        <div className="flex-1 flex flex-col relative">
          <AppHeader onCreateNew={handleCreateNew} rtl={rtl || true} onToggleRTL={() => setRtl(prev => !prev)} />

          <main className="flex-1 overflow-auto px-6 py-6 bg-secondary/10">
            <div className="container mx-auto max-w-7xl">
              {renderContent()}
            </div>
          </main>
        </div>

        <Toaster />
      </div>
    </SidebarProvider>
  )
}

export default App
