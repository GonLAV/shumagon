import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Camera,
  Ruler,
  MapPin,
  Clock,
  Images,
  VideoCamera,
  Trash,
  Eye,
  CalendarBlank
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface ARMeasurement {
  id: string
  type: 'distance' | 'area' | 'height'
  value: number
  unit: string
  points: { x: number; y: number }[]
  timestamp: string
}

interface ARAnnotation {
  id: string
  position: { x: number; y: number }
  text: string
  type: 'info' | 'warning' | 'feature' | 'improvement'
  timestamp: string
}

interface ARSession {
  propertyId: string
  measurements: ARMeasurement[]
  annotations: ARAnnotation[]
  photos: string[]
  videoRecordings: string[]
  duration: number
  startedAt: string
  completedAt?: string
}

interface ARSessionsViewerProps {
  propertyId: string
}

export function ARSessionsViewer({ propertyId }: ARSessionsViewerProps) {
  const [arSessions] = useKV<ARSession[]>('ar-sessions', [])
  const [selectedSession, setSelectedSession] = useState<ARSession | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  
  const propertySessions = (arSessions || []).filter(s => s.propertyId === propertyId)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (propertySessions.length === 0) {
    return (
      <Card className="glass-effect">
        <CardContent className="py-12 text-center">
          <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">אין סיורי AR</h3>
          <p className="text-muted-foreground text-sm">
            התחל סיור AR חדש כדי ליצור מדידות והערות לנכס זה
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {propertySessions.map((session, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card 
              className="glass-effect cursor-pointer hover:glow-primary transition-all group"
              onClick={() => setSelectedSession(session)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">סיור AR #{i + 1}</CardTitle>
                  <Badge variant="outline" className="gap-1">
                    <Clock size={12} />
                    {formatDuration(session.duration)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarBlank size={12} />
                  {session.completedAt && format(new Date(session.completedAt), 'dd/MM/yy HH:mm')}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <Ruler size={16} className="mx-auto mb-1 text-primary" />
                    <div className="font-mono text-sm font-semibold">{session.measurements.length}</div>
                    <div className="text-xs text-muted-foreground">מדידות</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <MapPin size={16} className="mx-auto mb-1 text-accent" />
                    <div className="font-mono text-sm font-semibold">{session.annotations.length}</div>
                    <div className="text-xs text-muted-foreground">הערות</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <Images size={16} className="mx-auto mb-1 text-success" />
                    <div className="font-mono text-sm font-semibold">{session.photos.length}</div>
                    <div className="text-xs text-muted-foreground">תמונות</div>
                  </div>
                </div>
                
                {session.photos.length > 0 && (
                  <div className="flex gap-1 overflow-x-auto">
                    {session.photos.slice(0, 4).map((photo, idx) => (
                      <div 
                        key={idx}
                        className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border/50"
                      >
                        <img src={photo} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {session.photos.length > 4 && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50">
                        <span className="text-xs font-semibold">+{session.photos.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedSession && (
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">פרטי סיור AR</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSession(null)}>
                סגור
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler size={18} className="text-primary" />
                  מדידות ({selectedSession.measurements.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedSession.measurements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">אין מדידות</p>
                  ) : (
                    selectedSession.measurements.map((m) => (
                      <div key={m.id} className="bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {m.type === 'distance' && 'מרחק'}
                            {m.type === 'area' && 'שטח'}
                            {m.type === 'height' && 'גובה'}
                          </Badge>
                          <div className="font-mono font-semibold text-primary">
                            {m.value} {m.unit}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(m.timestamp), 'HH:mm:ss')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-accent" />
                  הערות ({selectedSession.annotations.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedSession.annotations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">אין הערות</p>
                  ) : (
                    selectedSession.annotations.map((a) => (
                      <div key={a.id} className="bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              a.type === 'warning' ? 'border-destructive text-destructive' :
                              a.type === 'feature' ? 'border-success text-success' :
                              a.type === 'improvement' ? 'border-accent text-accent' :
                              ''
                            }`}
                          >
                            {a.type === 'info' && 'מידע'}
                            {a.type === 'warning' && 'אזהרה'}
                            {a.type === 'feature' && 'תכונה'}
                            {a.type === 'improvement' && 'שיפור'}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(a.timestamp), 'HH:mm:ss')}
                          </div>
                        </div>
                        <p className="text-sm text-right">{a.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {selectedSession.photos.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Images size={18} className="text-success" />
                  תמונות ({selectedSession.photos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedSession.photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-lg overflow-hidden border border-border/50 cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img src={photo} alt={`AR Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 glass-effect"
            onClick={() => setSelectedPhoto(null)}
          >
            ✕
          </Button>
          <img 
            src={selectedPhoto} 
            alt="Full size" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </motion.div>
      )}
    </div>
  )
}
