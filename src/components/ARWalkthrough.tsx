import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import {
  Camera,
  CameraRotate,
  X,
  Pause,
  Play,
  Record,
  VideoCamera,
  Ruler,
  Cube,
  ScanSmiley,
  FloppyDisk,
  Eye,
  EyeClosed,
  Target,
  NavigationArrow,
  Crosshair,
  MagicWand,
  Lightbulb,
  Drop,
  ThermometerSimple,
  SpeakerHigh,
  HandGrabbing,
  ArrowsOut
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import type { Property } from '@/lib/types'

interface ARWalkthroughProps {
  property: Property
  onClose: () => void
}

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

export function ARWalkthrough({ property, onClose }: ARWalkthroughProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [arMode, setArMode] = useState<'walkthrough' | 'measure' | 'annotate' | 'analyze'>('walkthrough')
  const [showOverlays, setShowOverlays] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [measurements, setMeasurements] = useState<ARMeasurement[]>([])
  const [annotations, setAnnotations] = useState<ARAnnotation[]>([])
  const [currentMeasurement, setCurrentMeasurement] = useState<{ x: number; y: number }[]>([])
  const [arSessions, setArSessions] = useKV<ARSession[]>('ar-sessions', [])
  const [sessionStartTime] = useState(Date.now())
  const [sessionDuration, setSessionDuration] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [zoom, setZoom] = useState(1)
  const [environmentalData, setEnvironmentalData] = useState({
    light: 0,
    temperature: 22,
    humidity: 45,
    noise: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      if (isActive && !isPaused) {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isActive, isPaused, sessionStartTime])

  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironmentalData({
        light: Math.floor(Math.random() * 100),
        temperature: 20 + Math.random() * 10,
        humidity: 30 + Math.random() * 40,
        noise: 20 + Math.random() * 60
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: isRecording
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsActive(true)
      toast.success('מצלמת AR הופעלה')
      
      setTimeout(() => generateAISuggestions(), 2000)
    } catch (err) {
      console.error('Camera access error:', err)
      toast.error('לא ניתן לגשת למצלמה')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsActive(false)
    saveSession()
  }

  const toggleCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    if (stream) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL('image/png')
        setCapturedPhotos(prev => [...prev, photoData])
        toast.success('תמונה נשמרה בהצלחה')
      }
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    toast.success('ההקלטה החלה')
  }

  const stopRecording = () => {
    setIsRecording(false)
    toast.success('ההקלטה הסתיימה')
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (arMode === 'measure') {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCurrentMeasurement(prev => [...prev, { x, y }])
        
        if (currentMeasurement.length === 1) {
          const distance = Math.sqrt(
            Math.pow(x - currentMeasurement[0].x, 2) +
            Math.pow(y - currentMeasurement[0].y, 2)
          )
          const realDistance = (distance / 100) * 2.5
          
          const newMeasurement: ARMeasurement = {
            id: Date.now().toString(),
            type: 'distance',
            value: parseFloat(realDistance.toFixed(2)),
            unit: 'm',
            points: [...currentMeasurement, { x, y }],
            timestamp: new Date().toISOString()
          }
          setMeasurements(prev => [...prev, newMeasurement])
          setCurrentMeasurement([])
          toast.success(`נמדד: ${realDistance.toFixed(2)} מטר`)
        }
      }
    } else if (arMode === 'annotate') {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const annotationText = prompt('הוסף הערה:')
        if (annotationText) {
          const newAnnotation: ARAnnotation = {
            id: Date.now().toString(),
            position: { x, y },
            text: annotationText,
            type: 'info',
            timestamp: new Date().toISOString()
          }
          setAnnotations(prev => [...prev, newAnnotation])
          toast.success('הערה נוספה')
        }
      }
    }
  }

  const generateAISuggestions = async () => {
    const promptText = `You are a real estate expert analyzing a property through AR walkthrough. Generate 5 insightful suggestions or observations for this property:
    
Property: ${property.address.street}, ${property.address.city}
Type: ${property.type}
Area: ${property.details.builtArea} sqm
Rooms: ${property.details.rooms}
Condition: ${property.details.condition}

Provide suggestions about:
- Renovation opportunities
- Value-adding improvements
- Potential issues to inspect
- Market positioning
- Space optimization

Return your response as a JSON object with a "suggestions" property containing an array of 5 concise suggestion strings in Hebrew.`

    try {
      const result = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(result)
      setAiSuggestions(data.suggestions || [])
      setShowAISuggestions(true)
    } catch (err) {
      console.error('AI suggestions error:', err)
    }
  }

  const saveSession = () => {
    const session: ARSession = {
      propertyId: property.id,
      measurements,
      annotations,
      photos: capturedPhotos,
      videoRecordings: [],
      duration: sessionDuration,
      startedAt: new Date(sessionStartTime).toISOString(),
      completedAt: new Date().toISOString()
    }
    
    setArSessions(prev => [...(prev || []), session])
    toast.success('סשן AR נשמר בהצלחה')
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: `brightness(${brightness}%)`,
            transform: `scale(${zoom})`
          }}
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ display: 'none' }}
        />

        {showGrid && (
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        )}

        <canvas
          className="absolute inset-0 w-full h-full"
          onClick={handleCanvasClick}
          style={{ cursor: arMode !== 'walkthrough' ? 'crosshair' : 'default' }}
        />

        {showOverlays && (
          <>
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={isActive ? stopCamera : startCamera}
                    size="icon"
                    variant="outline"
                    className="glass-effect border-white/20 hover:bg-white/20"
                  >
                    <X size={20} className="text-white" />
                  </Button>
                  <div className="text-white">
                    <div className="text-sm font-medium">{property.address.street}</div>
                    <div className="text-xs text-white/70">{property.address.city}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90"
                    >
                      <Record size={16} className="text-white" weight="fill" />
                      <span className="text-white text-sm font-mono">{formatDuration(sessionDuration)}</span>
                    </motion.div>
                  )}
                  
                  <Badge variant="outline" className="glass-effect border-white/20 text-white">
                    <Target size={14} className="mr-1" />
                    {arMode === 'walkthrough' && 'סיור AR'}
                    {arMode === 'measure' && 'מדידה'}
                    {arMode === 'annotate' && 'הערות'}
                    {arMode === 'analyze' && 'ניתוח AI'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="absolute top-20 left-4 space-y-2">
              <Card className="glass-effect border-white/20 text-white">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Lightbulb size={14} weight="fill" className="text-accent" />
                    <span>{environmentalData.light}% אור</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <ThermometerSimple size={14} weight="fill" className="text-primary" />
                    <span>{environmentalData.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Drop size={14} weight="fill" className="text-blue-400" />
                    <span>{environmentalData.humidity.toFixed(0)}% לחות</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <SpeakerHigh size={14} weight="fill" className="text-green-400" />
                    <span>{environmentalData.noise.toFixed(0)} dB</span>
                  </div>
                </CardContent>
              </Card>

              {measurements.length > 0 && (
                <Card className="glass-effect border-white/20 text-white">
                  <CardContent className="p-3">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-2">
                      <Ruler size={14} />
                      מדידות ({measurements.length})
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {measurements.slice(-5).map((m) => (
                        <div key={m.id} className="text-xs flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          {m.value} {m.unit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {showAISuggestions && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="absolute top-20 right-4 w-80"
              >
                <Card className="glass-effect border-accent/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-accent">
                        <MagicWand size={18} weight="fill" />
                        <span className="font-semibold text-sm">המלצות AI</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowAISuggestions(false)}
                        className="h-6 w-6"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {aiSuggestions.map((suggestion, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-xs bg-accent/10 rounded-lg p-2 border border-accent/20"
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setArMode('walkthrough')}
                    size="sm"
                    variant={arMode === 'walkthrough' ? 'default' : 'outline'}
                    className={arMode === 'walkthrough' ? 'bg-primary' : 'glass-effect border-white/20 text-white hover:bg-white/10'}
                  >
                    <NavigationArrow size={16} weight="fill" />
                  </Button>
                  <Button
                    onClick={() => setArMode('measure')}
                    size="sm"
                    variant={arMode === 'measure' ? 'default' : 'outline'}
                    className={arMode === 'measure' ? 'bg-primary' : 'glass-effect border-white/20 text-white hover:bg-white/10'}
                  >
                    <Ruler size={16} />
                  </Button>
                  <Button
                    onClick={() => setArMode('annotate')}
                    size="sm"
                    variant={arMode === 'annotate' ? 'default' : 'outline'}
                    className={arMode === 'annotate' ? 'bg-primary' : 'glass-effect border-white/20 text-white hover:bg-white/10'}
                  >
                    <Crosshair size={16} />
                  </Button>
                  <Button
                    onClick={() => {
                      setArMode('analyze')
                      generateAISuggestions()
                    }}
                    size="sm"
                    variant={arMode === 'analyze' ? 'default' : 'outline'}
                    className={arMode === 'analyze' ? 'bg-primary' : 'glass-effect border-white/20 text-white hover:bg-white/10'}
                  >
                    <MagicWand size={16} weight="fill" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleCamera}
                    size="icon"
                    variant="outline"
                    className="glass-effect border-white/20 text-white hover:bg-white/10"
                  >
                    <CameraRotate size={20} />
                  </Button>
                  <Button
                    onClick={() => setShowGrid(!showGrid)}
                    size="icon"
                    variant="outline"
                    className="glass-effect border-white/20 text-white hover:bg-white/10"
                  >
                    <Cube size={20} />
                  </Button>
                  <Button
                    onClick={() => setShowOverlays(!showOverlays)}
                    size="icon"
                    variant="outline"
                    className="glass-effect border-white/20 text-white hover:bg-white/10"
                  >
                    {showOverlays ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                {!isActive ? (
                  <Button
                    onClick={startCamera}
                    size="lg"
                    className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 glow-primary"
                  >
                    <Camera size={28} weight="fill" />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={isPaused ? () => setIsPaused(false) : () => setIsPaused(true)}
                      size="lg"
                      variant="outline"
                      className="h-12 w-12 rounded-full glass-effect border-white/20 text-white hover:bg-white/10"
                    >
                      {isPaused ? <Play size={20} weight="fill" /> : <Pause size={20} weight="fill" />}
                    </Button>
                    
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="h-16 w-16 rounded-full bg-white hover:bg-white/90"
                    >
                      <Camera size={28} weight="fill" className="text-black" />
                    </Button>
                    
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      size="lg"
                      variant="outline"
                      className={`h-12 w-12 rounded-full ${
                        isRecording
                          ? 'bg-destructive border-destructive text-white'
                          : 'glass-effect border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {isRecording ? <Record size={20} weight="fill" /> : <VideoCamera size={20} weight="fill" />}
                    </Button>

                    <Button
                      onClick={() => {
                        stopCamera()
                        onClose()
                      }}
                      size="lg"
                      variant="outline"
                      className="h-12 w-12 rounded-full glass-effect border-white/20 text-white hover:bg-white/10"
                    >
                      <FloppyDisk size={20} weight="fill" />
                    </Button>
                  </>
                )}
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Lightbulb size={16} className="text-white" />
                    <Slider
                      value={[brightness]}
                      onValueChange={(v) => setBrightness(v[0])}
                      min={50}
                      max={150}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-white text-xs font-mono w-12">{brightness}%</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ArrowsOut size={16} className="text-white" />
                    <Slider
                      value={[zoom]}
                      onValueChange={(v) => setZoom(v[0])}
                      min={1}
                      max={3}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-white text-xs font-mono w-12">{zoom.toFixed(1)}x</span>
                  </div>
                </motion.div>
              )}

              {capturedPhotos.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {capturedPhotos.slice(-5).map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-white/30"
                    >
                      <img src={photo} alt={`Capture ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  {capturedPhotos.length > 5 && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg glass-effect flex items-center justify-center border-2 border-white/30">
                      <span className="text-white text-xs font-semibold">+{capturedPhotos.length - 5}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {annotations.map((annotation) => (
          <motion.div
            key={annotation.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              left: annotation.position.x,
              top: annotation.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            className="pointer-events-none"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-accent glow-accent flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg">
                {annotation.text}
              </div>
            </div>
          </motion.div>
        ))}

        {currentMeasurement.map((point, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              transform: 'translate(-50%, -50%)'
            }}
            className="pointer-events-none"
          >
            <div className="w-4 h-4 rounded-full bg-primary glow-primary border-2 border-white" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
