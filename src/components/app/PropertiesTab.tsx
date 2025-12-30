import { motion } from 'framer-motion'
import type { Client, Property } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { PropertyDetail } from '@/components/PropertyDetail'
import { PropertyForm } from '@/components/PropertyForm'
import { PropertyCard } from '@/components/property/PropertyCard'

export function PropertiesTab({
  properties,
  clients,
  selectedProperty,
  isCreatingProperty,
  onSelectProperty,
  onCreateNew,
  onBackToList,
  onStartEditing,
  onSaveProperty,
  onDeleteProperty
}: {
  properties: Property[]
  clients: Client[]
  selectedProperty: Property | null
  isCreatingProperty: boolean
  onSelectProperty: (property: Property) => void
  onCreateNew: () => void
  onBackToList: () => void
  onStartEditing: (property: Property) => void
  onSaveProperty: (property: Property) => void
  onDeleteProperty: (id: string) => void
}) {
  if (selectedProperty || isCreatingProperty) {
    if (selectedProperty && !isCreatingProperty) {
      return (
        <PropertyDetail
          property={selectedProperty}
          clients={clients}
          allProperties={properties}
          onBack={onBackToList}
          onEdit={onStartEditing}
          onSave={onSaveProperty}
          onDelete={onDeleteProperty}
        />
      )
    }

    return (
      <PropertyForm
        property={selectedProperty}
        clients={clients}
        onSave={onSaveProperty}
        onCancel={onBackToList}
      />
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">כל הנכסים</h2>
        <Button onClick={onCreateNew} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground glow-accent">
          <Plus size={20} weight="bold" />
          נכס חדש
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <PropertyCard
              property={property}
              client={clients.find(c => c.id === property.clientId)}
              onClick={() => onSelectProperty(property)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
