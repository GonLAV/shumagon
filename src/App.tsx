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
import { House, ChartBar, Users, FileText, UserCircle, CurrencyDollar, Flask } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { AppHeader } from '@/components/app/AppHeader'
import { PropertiesTab } from '@/components/app/PropertiesTab'
import { ValuationEngineTester } from '@/components/ValuationEngineTester'

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
          <TabsList className="mb-8 glass-effect p-1.5">
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
              <span className="hidden sm:inline">בדיקת מנוע שמאות</span>
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
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App
