import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function IngestionHelper() {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const r = await fetch('/gisn-index.json?ts=' + Date.now(), { cache: 'no-store' })
      if (!r.ok) throw new Error('לא נמצא gisn-index.json')
      const json = await r.json()
      const items = Array.isArray(json.items) ? json.items : []
      setCount(items.length)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'שגיאה בקריאה')
      setCount(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const copyCmd = async () => {
    const cmd = 'npm run ingest:gisn'
    try {
      await navigator.clipboard.writeText(cmd)
      toast.success('הפקודה הועתקה ללוח')
    } catch {
      toast.error('נכשל בהעתקה')
    }
  }

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <h2 className="text-lg font-semibold">עזר להרצת אינדוקס PDF (מקומי)</h2>
      <p className="text-sm text-muted-foreground">שימו קבצי PDF בתיקייה public/gisn/, ואז הריצו את פקודת האינדוקס. לאחר מכן, רעננו את התצוגה.</p>
      <Card className="p-3 space-y-3">
        <div className="text-sm">פקודת הרצה (העתקה בלחיצה):</div>
        <Button variant="outline" onClick={copyCmd}>npm run ingest:gisn</Button>
        <div className="text-sm">מצב אינדקס: {count === null ? 'לא זמין' : `${count} פריטים`}</div>
        <Button onClick={refresh} disabled={loading}>{loading ? 'טוען…' : 'רענן סטטוס'}</Button>
      </Card>
    </div>
  )
}
