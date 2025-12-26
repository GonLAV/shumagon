import type { Property } from '@/lib/types'
import { generateMockMarketTrends } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo } from 'react'

interface MarketInsightsProps {
  properties: Property[]
}

export function MarketInsights({ properties }: MarketInsightsProps) {
  const trends = useMemo(() => generateMockMarketTrends(), [])
  
  const stats = useMemo(() => {
    const valuedProperties = properties.filter(p => p.valuationData)
    const avgValue = valuedProperties.length > 0
      ? valuedProperties.reduce((sum, p) => sum + (p.valuationData?.estimatedValue || 0), 0) / valuedProperties.length
      : 0
    
    const avgPricePerSqm = valuedProperties.length > 0
      ? valuedProperties.reduce((sum, p) => {
          const value = p.valuationData?.estimatedValue || 0
          const area = p.details.builtArea
          return sum + (value / area)
        }, 0) / valuedProperties.length
      : 0
    
    const byCity = valuedProperties.reduce((acc, p) => {
      const city = p.address.city
      if (!acc[city]) acc[city] = []
      acc[city].push(p)
      return acc
    }, {} as Record<string, Property[]>)
    
    return {
      avgValue,
      avgPricePerSqm,
      byCity,
      totalValued: valuedProperties.length
    }
  }, [properties])

  const recentTrends = trends.slice(-12)
  const maxPrice = Math.max(...recentTrends.map(t => t.avgPricePerSqm))
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-right">ניתוח שוק</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              ממוצע שווי נכס
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-right">
              ₪{(stats.avgValue / 1000000).toFixed(2)}M
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              ממוצע מחיר למ״ר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-right">
              ₪{Math.round(stats.avgPricePerSqm).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              נכסים בניתוח
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-right">
              {stats.totalValued}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              ערים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-right">
              {Object.keys(stats.byCity).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">מגמת מחירים - 12 חודשים אחרונים</CardTitle>
          <p className="text-sm text-muted-foreground text-right">מחיר ממוצע למ״ר</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1" dir="ltr">
            {recentTrends.map((trend, index) => {
              const height = (trend.avgPricePerSqm / maxPrice) * 100
              const isRecent = index >= recentTrends.length - 3
              
              return (
                <div key={trend.period} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isRecent ? 'bg-primary' : 'bg-primary/40'
                      } hover:bg-accent cursor-pointer`}
                      style={{ height: `${height * 2}px` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 -translate-x-1/2 bg-popover border border-border rounded px-3 py-2 text-xs whitespace-nowrap shadow-lg z-10">
                        <div className="font-bold font-mono">₪{trend.avgPricePerSqm.toLocaleString()}</div>
                        <div className="text-muted-foreground">{trend.sales} מכירות</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground rotate-45 origin-top-right">
                    {trend.period.split('-')[1]}/{trend.period.split('-')[0].slice(2)}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">פילוח לפי ערים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.byCity).map(([city, cityProperties]) => {
              const avgCityValue = cityProperties.reduce((sum, p) => sum + (p.valuationData?.estimatedValue || 0), 0) / cityProperties.length
              const avgCityPricePerSqm = cityProperties.reduce((sum, p) => {
                const value = p.valuationData?.estimatedValue || 0
                const area = p.details.builtArea
                return sum + (value / area)
              }, 0) / cityProperties.length
              
              return (
                <div key={city} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex gap-6 items-center">
                    <div className="text-center min-w-[80px]">
                      <div className="text-xs text-muted-foreground">נכסים</div>
                      <div className="text-lg font-bold font-mono">{cityProperties.length}</div>
                    </div>
                    <div className="text-center min-w-[120px]">
                      <div className="text-xs text-muted-foreground">ממוצע מחיר למ״ר</div>
                      <div className="text-lg font-bold font-mono text-primary">
                        ₪{Math.round(avgCityPricePerSqm).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center min-w-[120px]">
                      <div className="text-xs text-muted-foreground">ממוצע שווי</div>
                      <div className="text-lg font-bold font-mono text-accent">
                        ₪{(avgCityValue / 1000000).toFixed(2)}M
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{city}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
