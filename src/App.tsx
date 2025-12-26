import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Property, Client } from '@/lib/types'
import { generateMockProperties, generateMockClients } from '@/lib/mockData'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dashboard } from '@/components/Dashboard'
import { PropertyForm } from '@/components/PropertyForm'
import { ClientManager } from '@/components/ClientManager'
import { MarketInsights } from '@/components/MarketInsights'
import { PropertyDetail } from '@/components/PropertyDetail'
import { House, ChartBar, Users, Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [properties, setProperties] = useKV<Property[]>('properties', generateMockProperties())
  const [clients, setClients] = useKV<Client[]>('clients', generateMockClients())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isCreatingProperty, setIsCreatingProperty] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <House className="text-primary-foreground" size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AppraisalPro</h1>
              <p className="text-xs text-muted-foreground">מערכת שמאות נדל״ן מקצועית</p>
            </div>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus size={20} weight="bold" />
            שומה חדשה
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2">
              <House size={18} />
              <span className="hidden sm:inline">לוח בקרה</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <House size={18} />
              <span className="hidden sm:inline">נכסים</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users size={18} />
              <span className="hidden sm:inline">לקוחות</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <ChartBar size={18} />
              <span className="hidden sm:inline">ניתוח שוק</span>
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
            {selectedProperty || isCreatingProperty ? (
              selectedProperty && !isCreatingProperty ? (
                <PropertyDetail
                  property={selectedProperty}
                  clients={clients || []}
                  allProperties={properties || []}
                  onBack={() => {
                    setSelectedProperty(null)
                    setIsCreatingProperty(false)
                  }}
                  onEdit={(prop) => {
                    setSelectedProperty(prop)
                    setIsCreatingProperty(true)
                  }}
                  onSave={handleSaveProperty}
                  onDelete={handleDeleteProperty}
                />
              ) : (
                <PropertyForm
                  property={selectedProperty}
                  clients={clients || []}
                  onSave={handleSaveProperty}
                  onCancel={() => {
                    setSelectedProperty(null)
                    setIsCreatingProperty(false)
                  }}
                />
              )
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">כל הנכסים</h2>
                  <Button onClick={handleCreateNew} className="gap-2">
                    <Plus size={20} weight="bold" />
                    נכס חדש
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(properties || []).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      client={(clients || []).find(c => c.id === property.clientId)}
                      onClick={() => setSelectedProperty(property)}
                    />
                  ))}
                </div>
              </div>
            )}
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
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

function PropertyCard({ property, client, onClick }: { 
  property: Property
  client?: Client
  onClick: () => void 
}) {
  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    'in-progress': 'bg-accent text-accent-foreground',
    completed: 'bg-primary/10 text-primary',
    sent: 'bg-green-100 text-green-700'
  }

  const statusLabels = {
    draft: 'טיוטה',
    'in-progress': 'בעבודה',
    completed: 'הושלם',
    sent: 'נשלח'
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
          {statusLabels[property.status]}
        </div>
        {property.valuationData && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">שווי משוער</div>
            <div className="text-lg font-mono font-semibold text-primary">
              ₪{(property.valuationData.estimatedValue / 1000000).toFixed(2)}M
            </div>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-1 text-right">{property.address.street}</h3>
      <p className="text-sm text-muted-foreground mb-3 text-right">
        {property.address.neighborhood}, {property.address.city}
      </p>
      
      <div className="flex gap-4 text-sm text-muted-foreground mb-3 justify-end" dir="rtl">
        <span>{property.details.rooms} חד׳</span>
        <span>•</span>
        <span>{property.details.builtArea} מ״ר</span>
        <span>•</span>
        <span>קומה {property.details.floor}</span>
      </div>
      
      {client && (
        <div className="text-xs text-muted-foreground text-right pt-3 border-t border-border">
          לקוח: {client.name}
        </div>
      )}
    </div>
  )
}

export default App
