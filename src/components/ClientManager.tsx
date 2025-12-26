import type { Client, Property } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Envelope, Phone, BuildingOffice } from '@phosphor-icons/react'

interface ClientManagerProps {
  clients: Client[]
  properties: Property[]
  onUpdateClients: (clients: Client[]) => void
  onSelectProperty: (property: Property) => void
}

export function ClientManager({ clients, properties, onSelectProperty }: ClientManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ניהול לקוחות</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const clientProperties = properties.filter(p => p.clientId === client.id)
          const completedCount = clientProperties.filter(p => p.status === 'completed' || p.status === 'sent').length
          
          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{clientProperties.length} נכסים</Badge>
                    {completedCount > 0 && (
                      <Badge variant="outline">{completedCount} הושלמו</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    {client.company && (
                      <p className="text-sm text-muted-foreground mt-1">{client.company}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground" dir="rtl">
                  <Envelope size={16} />
                  <a href={`mailto:${client.email}`} className="hover:text-primary">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground" dir="rtl">
                  <Phone size={16} />
                  <a href={`tel:${client.phone}`} className="hover:text-primary">
                    {client.phone}
                  </a>
                </div>
                
                {clientProperties.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 text-right">נכסים אחרונים</p>
                    <div className="space-y-2">
                      {clientProperties.slice(0, 3).map((property) => (
                        <button
                          key={property.id}
                          onClick={() => onSelectProperty(property)}
                          className="w-full text-right p-2 rounded hover:bg-muted transition-colors text-sm"
                        >
                          <div className="font-medium">{property.address.street}</div>
                          <div className="text-xs text-muted-foreground">{property.address.city}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {client.notes && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground text-right italic">
                      {client.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
