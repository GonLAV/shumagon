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
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">לוח בקרה</h2>
          <p className="text-muted-foreground mt-1">סקירה מהירה של כל הפעילות</p>
        </div>
        <Button onClick={onCreateNew} size="lg" className="gap-2">
          <Plus size={20} weight="bold" />
          שומה חדשה
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<House size={24} weight="duotone" />}
          title="סך נכסים"
          value={stats.total}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<Clock size={24} weight="duotone" />}
          title="בעבודה"
          value={stats.inProgress}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<CheckCircle size={24} weight="duotone" />}
          title="הושלמו"
          value={stats.completed}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<TrendUp size={24} weight="duotone" />}
          title="סך שווי"
          value={`₪${(stats.totalValue / 1000000).toFixed(1)}M`}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-right text-xl">נכסים אחרונים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
        </div>

        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-right text-xl">לקוחות פעילים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clients.slice(0, 8).map((client) => (
                  <div 
                    key={client.id} 
                    className="flex items-center justify-between py-2.5 border-b border-border last:border-0 hover:bg-muted/50 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`${color} p-3 rounded-lg`}>
            {icon}
          </div>
          <div className="text-right flex-1 mr-4">
            <p className="text-sm font-medium text-muted-foreground mb-0.5">{title}</p>
            <p className="text-3xl font-semibold font-mono text-foreground">{value}</p>
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
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    'in-progress': 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    sent: 'bg-green-100 text-green-700 border-green-200'
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
      className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-3">
        <Badge className={`${statusColors[property.status]} border px-2.5 py-0.5 text-xs font-medium`}>
          {statusLabels[property.status]}
        </Badge>
        {property.valuationData && (
          <div className="text-sm font-mono font-semibold text-primary">
            ₪{(property.valuationData.estimatedValue / 1000000).toFixed(2)}M
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="font-semibold text-foreground">{property.address.street}</div>
        <div className="text-sm text-muted-foreground">
          {property.address.city} • <span className="text-foreground/70">{client?.name || 'ללא לקוח'}</span>
        </div>
      </div>
    </div>
  )
}
