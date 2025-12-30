import { motion } from 'framer-motion'
import type { Property, Client } from '@/lib/types'

export function PropertyCard({
  property,
  client,
  onClick
}: {
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
          {property.address.neighborhood && `${property.address.neighborhood}, `}
          {property.address.city}
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
