import type { Property, Client } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { House, FileText, Clock, CheckCircle, TrendUp, Plus } from '@phosphor-icons/react'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">לוח בקרה</h2>
        <Button onClick={onCreateNew} size="lg" className="gap-2">
          <Plus size={20} weight="bold" />
          שומה חדשה
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<House size={24} weight="bold" />}
          title="סך נכסים"
          value={stats.total}
          color="bg-primary"
        />
        <StatCard
          icon={<Clock size={24} weight="bold" />}
          title="בעבודה"
          value={stats.inProgress}
          color="bg-accent"
        />
        <StatCard
          icon={<CheckCircle size={24} weight="bold" />}
          title="הושלמו"
          value={stats.completed}
          color="bg-primary/70"
        />
        <StatCard
          icon={<TrendUp size={24} weight="bold" />}
          title="סך שווי"
          value={`₪${(stats.totalValue / 1000000).toFixed(1)}M`}
          color="bg-secondary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">נכסים אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentProperties.map((property) => {
              const client = clients.find(c => c.id === property.clientId)
              return (
                <PropertyRow
                  key={property.id}
                  property={property}
                  client={client}
                  onClick={() => onSelectProperty(property)}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">לקוחות פעילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="text-sm text-muted-foreground">
                    {client.properties.length} נכסים
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{client.name}</div>
                    {client.company && (
                      <div className="text-xs text-muted-foreground">{client.company}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">פעילות אחרונה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProperties.slice(0, 5).map((property) => {
                const daysAgo = Math.floor(
                  (Date.now() - new Date(property.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div key={property.id} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                    <div className="text-xs text-muted-foreground">
                      {daysAgo === 0 ? 'היום' : daysAgo === 1 ? 'אתמול' : `לפני ${daysAgo} ימים`}
                    </div>
                    <div className="text-right flex-1 mr-4">
                      <div className="text-sm font-medium">{property.address.street}</div>
                      <div className="text-xs text-muted-foreground">{property.address.city}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: { 
  icon: React.ReactNode
  title: string
  value: string | number
  color: string 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-right flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold font-mono">{value}</p>
          </div>
          <div className={`${color} text-white p-3 rounded-lg`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PropertyRow({ property, client, onClick }: {
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
      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3">
        <Badge className={statusColors[property.status]}>
          {statusLabels[property.status]}
        </Badge>
        {property.valuationData && (
          <div className="text-sm font-mono font-semibold text-primary">
            ₪{(property.valuationData.estimatedValue / 1000000).toFixed(2)}M
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="font-medium">{property.address.street}</div>
        <div className="text-sm text-muted-foreground">
          {property.address.city} • {client?.name || 'ללא לקוח'}
        </div>
      </div>
    </div>
  )
}
