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
import { House, ChartBar, Users, Plus, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen bg-background grid-bg">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow-primary">
              <Lightning className="text-primary-foreground" size={24} weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AppraisalPro
              </h1>
              <p className="text-xs text-muted-foreground">מערכת שמאות נדל״ן מתקדמת</p>
            </div>
          </motion.div>
          <Button onClick={handleCreateNew} className="gap-2 bg-primary hover:bg-primary/90 glow-primary">
            <Plus size={20} weight="bold" />
            שומה חדשה
          </Button>
        </div>
      </header>

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
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">כל הנכסים</h2>
                  <Button onClick={handleCreateNew} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground glow-accent">
                    <Plus size={20} weight="bold" />
                    נכס חדש
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(properties || []).map((property, i) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <PropertyCard
                        property={property}
                        client={(clients || []).find(c => c.id === property.clientId)}
                        onClick={() => setSelectedProperty(property)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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
    draft: 'bg-muted/50 text-muted-foreground border-muted',
    'in-progress': 'bg-accent/10 text-accent border-accent/30',
    completed: 'bg-primary/10 text-primary border-primary/30',
    sent: 'bg-success/10 text-success border-success/30'
  }

  const statusLabels = {
    draft: 'טיוטה',
    'in-progress': 'בעבודה',
    completed: 'הושלם',
    sent: 'נשלח'
  }

  return (
    <motion.div
      onClick={onClick}
      className="group cursor-pointer rounded-xl glass-effect p-6 transition-all hover:scale-[1.02] hover:glow-primary relative overflow-hidden"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-start justify-between mb-4">
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[property.status]}`}>
          {statusLabels[property.status]}
        </div>
        {property.valuationData && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">שווי משוער</div>
            <div className="text-2xl font-mono font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ₪{(property.valuationData.estimatedValue / 1000000).toFixed(2)}M
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <h3 className="text-xl font-bold mb-2 text-right group-hover:text-primary transition-colors">{property.address.street}</h3>
        <p className="text-sm text-muted-foreground mb-4 text-right">
          {property.address.neighborhood && `${property.address.neighborhood}, `}{property.address.city}
        </p>
        
        <div className="flex gap-4 text-sm text-muted-foreground mb-4 justify-end font-mono" dir="rtl">
          <span className="bg-secondary/50 px-2 py-1 rounded">{property.details.rooms} חד׳</span>
          <span className="bg-secondary/50 px-2 py-1 rounded">{property.details.builtArea} מ״ר</span>
          <span className="bg-secondary/50 px-2 py-1 rounded">קומה {property.details.floor}</span>
        </div>
        
        {client && (
          <div className="text-xs text-muted-foreground text-right pt-4 border-t border-border/50">
            לקוח: <span className="text-foreground font-medium">{client.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default App
