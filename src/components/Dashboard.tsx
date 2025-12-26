import type { Property, Client } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { House, FileText, Clock, CheckCircle, TrendUp, Plus, Sparkle, Lightning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface DashboardProps {
  properties: Property[]
  clients: Client[]
  onSelectProperty: (property: Property) => void
  onCreateNew: () => void
}

export function Dashboard({ properties, clients, onSelectProperty, onCreateNew }: DashboardProps) {
  const stats = {
    total: properties.length,
    inProgress: properties.filter(p => p.status === 'in-progress').length,
    completed: properties.filter(p => p.status === 'completed').length,
    sent: properties.filter(p => p.status === 'sent').length,
    totalValue: properties.reduce((sum, p) => sum + (p.valuationData?.estimatedValue || 0), 0)
  }

  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">לוח בקרה</h2>
          <p className="text-muted-foreground">סקירה מהירה של כל הפעילות</p>
        </div>
        <Button onClick={onCreateNew} size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground glow-accent">
          <Lightning size={20} weight="fill" />
          שומה חדשה
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<House size={28} weight="duotone" />}
          title="סך נכסים"
          value={stats.total}
          color="from-primary to-primary/70"
          delay={0}
        />
        <StatCard
          icon={<Clock size={28} weight="duotone" />}
          title="בעבודה"
          value={stats.inProgress}
          color="from-accent to-accent/70"
          delay={0.1}
        />
        <StatCard
          icon={<CheckCircle size={28} weight="duotone" />}
          title="הושלמו"
          value={stats.completed}
          color="from-success to-success/70"
          delay={0.2}
        />
        <StatCard
          icon={<TrendUp size={28} weight="duotone" />}
          title="סך שווי"
          value={`₪${(stats.totalValue / 1000000).toFixed(1)}M`}
          color="from-warning to-warning/70"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-right text-2xl">נכסים אחרונים</CardTitle>
                <Sparkle size={20} weight="duotone" className="text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProperties.map((property, i) => {
                  const client = clients.find(c => c.id === property.clientId)
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      <PropertyRow
                        property={property}
                        client={client}
                        onClick={() => onSelectProperty(property)}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-right text-2xl">לקוחות פעילים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients.slice(0, 8).map((client, i) => (
                  <motion.div 
                    key={client.id} 
                    className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-muted/30 px-2 rounded-lg transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                        {client.properties.length}
                      </div>
                      <div className="text-xs text-muted-foreground">נכסים</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{client.name}</div>
                      {client.company && (
                        <div className="text-xs text-muted-foreground">{client.company}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color, delay }: { 
  icon: React.ReactNode
  title: string
  value: string | number
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass-effect border-border/50 overflow-hidden group hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-6 relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
          <div className="relative flex items-center justify-between">
            <div className={`bg-gradient-to-br ${color} text-white p-3.5 rounded-xl group-hover:scale-110 transition-transform`}>
              {icon}
            </div>
            <div className="text-right flex-1 mr-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <p className="text-4xl font-bold font-mono bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function PropertyRow({ property, client, onClick }: {
  property: Property
  client?: Client
  onClick: () => void
}) {
  const statusColors = {
    draft: 'bg-muted/50 text-muted-foreground border-muted',
    'in-progress': 'bg-accent/20 text-accent border-accent/50',
    completed: 'bg-primary/20 text-primary border-primary/50',
    sent: 'bg-success/20 text-success border-success/50'
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
      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-all group hover:scale-[1.01]"
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <Badge className={`${statusColors[property.status]} border px-3 py-1 text-xs font-semibold`}>
          {statusLabels[property.status]}
        </Badge>
        {property.valuationData && (
          <div className="text-sm font-mono font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ₪{(property.valuationData.estimatedValue / 1000000).toFixed(2)}M
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="font-semibold group-hover:text-primary transition-colors">{property.address.street}</div>
        <div className="text-sm text-muted-foreground">
          {property.address.city} • <span className="text-foreground/70">{client?.name || 'ללא לקוח'}</span>
        </div>
      </div>
    </motion.div>
  )
}
