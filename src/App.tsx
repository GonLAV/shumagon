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
        return <ProfessionalCalculators />
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
      <div className="min-h-screen bg-background flex w-full flex-row-reverse" dir="rtl">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <AppSidebar activeView={activeTab} onNavigate={setActiveTab} />

        <div className="flex-1 flex flex-col relative">
          <AppHeader onCreateNew={handleCreateNew} />

          <main className="flex-1 overflow-auto px-6 py-8">
            <div className="container mx-auto">
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
