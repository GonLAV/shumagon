import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { FloppyDisk, Info, UploadSimple, Trash, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { BrandingSettings } from '@/lib/types'
import { PDFPreview } from '@/components/PDFPreview'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const AVAILABLE_FONTS = [
  { value: 'Helvetica', label: 'Helvetica', category: 'Sans-serif' },
  { value: 'Times', label: 'Times New Roman', category: 'Serif' },
  { value: 'Courier', label: 'Courier', category: 'Monospace' },
  { value: 'Inter', label: 'Inter', category: 'Sans-serif' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Monospace' },
  { value: 'Arial', label: 'Arial', category: 'Sans-serif' },
  { value: 'Georgia', label: 'Georgia', category: 'Serif' },
  { value: 'Verdana', label: 'Verdana', category: 'Sans-serif' },
  { value: 'Palatino', label: 'Palatino', category: 'Serif' },
]

const defaultBranding: BrandingSettings = {
  id: 'default',
  companyName: 'AppraisalPro',
  companyTagline: 'מקצועיות ומדויקות בשמאות נדל"ן',
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    headerBackground: '#1E1B4B',
    headerText: '#FFFFFF',
    footerBackground: '#F3F4F6',
    footerText: '#4B5563'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    headingSize: 16,
    bodySize: 11
  },
  header: {
    enabled: true,
    height: 40,
    showLogo: true,
    showCompanyName: true,
    showTagline: false,
    borderBottom: true
  },
  footer: {
    enabled: true,
    height: 30,
    showPageNumbers: true,
    showCompanyName: true,
    showContactInfo: true,
    borderTop: true
  },
  contactInfo: {
    phone: '+972-50-123-4567',
    email: 'info@appraisalpro.co.il',
    website: 'www.appraisalpro.co.il'
  },
  pageLayout: {
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    },
    pageSize: 'a4',
    orientation: 'portrait'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true
}

export function BrandingSettingsTab() {
  const [settings, setSettings] = useKV<BrandingSettings>('branding-settings', defaultBranding)
  const [hasChanges, setHasChanges] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = () => {
    setSettings((current) => ({ ...current!, updatedAt: new Date().toISOString() }))
    setHasChanges(false)
    toast.success('הגדרות המיתוג נשמרו בהצלחה')
  }

  const handleReset = () => {
    setSettings(defaultBranding)
    setHasChanges(false)
    toast.success('הגדרות המיתוג אופסו לברירת מחדל')
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('נא להעלות קובץ תמונה בלבד')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('גודל הקובץ חייב להיות פחות מ-2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setSettings((current) => ({
          ...current!,
          logo: {
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
            position: 'left',
            size: 'medium'
          },
          updatedAt: new Date().toISOString()
        }))
        setHasChanges(true)
        toast.success('הלוגו הועלה בהצלחה')
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setSettings((current) => {
      const { logo, ...rest } = current!
      return { ...rest, updatedAt: new Date().toISOString() }
    })
    setHasChanges(true)
    toast.success('הלוגו הוסר')
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            הגדרות מיתוג PDF
          </h2>
          <p className="text-muted-foreground mt-1">
            התאם אישית את המראה של דוחות PDF עם לוגו, צבעים וכותרות
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              <Info size={14} className="ml-1" />
              שינויים לא שמורים
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset} size="sm">
            איפוס
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(true)} size="sm" className="gap-2">
            <Eye size={18} weight="duotone" />
            תצוגה מקדימה
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <FloppyDisk size={18} weight="duotone" />
            שמור
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>פרטי החברה</CardTitle>
            <CardDescription>מידע שיופיע בדוחות PDF</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">שם החברה</Label>
              <Input
                id="company-name"
                value={settings.companyName}
                onChange={(e) => {
                  setSettings((c) => ({ ...c!, companyName: e.target.value }))
                  setHasChanges(true)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">סלוגן</Label>
              <Input
                id="tagline"
                value={settings.companyTagline || ''}
                onChange={(e) => {
                  setSettings((c) => ({ ...c!, companyTagline: e.target.value }))
                  setHasChanges(true)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">טלפון</Label>
              <Input
                id="phone"
                value={settings.contactInfo.phone || ''}
                onChange={(e) => {
                  setSettings((c) => ({
                    ...c!,
                    contactInfo: { ...c!.contactInfo, phone: e.target.value }
                  }))
                  setHasChanges(true)
                }}
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={settings.contactInfo.email || ''}
                onChange={(e) => {
                  setSettings((c) => ({
                    ...c!,
                    contactInfo: { ...c!.contactInfo, email: e.target.value }
                  }))
                  setHasChanges(true)
                }}
                dir="ltr"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>לוגו החברה</CardTitle>
            <CardDescription>לוגו יופיע בכותרת העליונה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <img
                    src={settings.logo.dataUrl}
                    alt="Company Logo"
                    className="max-h-32 object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRemoveLogo} className="flex-1 gap-2">
                    <Trash size={18} weight="duotone" />
                    הסר
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="flex-1 gap-2"
                  >
                    <UploadSimple size={18} weight="duotone" />
                    החלף
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <UploadSimple size={48} weight="duotone" className="text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">העלה לוגו</p>
                <p className="text-sm text-muted-foreground mb-4">PNG, JPG עד 2MB</p>
                <Button variant="outline">בחר קובץ</Button>
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>צבעי מיתוג</CardTitle>
            <CardDescription>צבעים לכותרות ואלמנטים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary">צבע ראשי</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.colors.primary}
                  onChange={(e) => {
                    setSettings((c) => ({
                      ...c!,
                      colors: { ...c!.colors, primary: e.target.value }
                    }))
                    setHasChanges(true)
                  }}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.colors.primary}
                  onChange={(e) => {
                    setSettings((c) => ({
                      ...c!,
                      colors: { ...c!.colors, primary: e.target.value }
                    }))
                    setHasChanges(true)
                  }}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="header-bg">רקע כותרת עליונה</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.colors.headerBackground}
                  onChange={(e) => {
                    setSettings((c) => ({
                      ...c!,
                      colors: { ...c!.colors, headerBackground: e.target.value }
                    }))
                    setHasChanges(true)
                  }}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.colors.headerBackground}
                  onChange={(e) => {
                    setSettings((c) => ({
                      ...c!,
                      colors: { ...c!.colors, headerBackground: e.target.value }
                    }))
                    setHasChanges(true)
                  }}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer-bg">רקע כותרת תחתונה</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.colors.footerBackground}
                  onChange={(e) => {
                    setSettings((c) => ({
                      ...c!,
                      colors: { ...c!.colors, footerBackground: e.target.value }
                    }))
                    setHasChanges(true)
                  }}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.colors.footerBackground}
                  onChange={(e) => {
                    setSettings((c) => ({
                      ...c!,
                      colors: { ...c!.colors, footerBackground: e.target.value }
                    }))
                    setHasChanges(true)
                  }}
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>גופנים ועיצוב טקסט</CardTitle>
            <CardDescription>בחר גופנים לכותרות ולגוף הטקסט</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading-font">גופן כותרות</Label>
              <Select
                value={settings.fonts.heading}
                onValueChange={(value) => {
                  setSettings((c) => ({
                    ...c!,
                    fonts: { ...c!.fonts, heading: value }
                  }))
                  setHasChanges(true)
                }}
              >
                <SelectTrigger id="heading-font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({font.category})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p
                  className="text-center font-bold"
                  style={{
                    fontFamily: settings.fonts.heading,
                    fontSize: `${settings.fonts.headingSize}pt`,
                  }}
                >
                  תצוגה מקדימה - כותרת ראשית
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading-size">גודל כותרות: {settings.fonts.headingSize}pt</Label>
              <Slider
                id="heading-size"
                min={12}
                max={24}
                step={1}
                value={[settings.fonts.headingSize]}
                onValueChange={([value]) => {
                  setSettings((c) => ({
                    ...c!,
                    fonts: { ...c!.fonts, headingSize: value }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-font">גופן טקסט רגיל</Label>
              <Select
                value={settings.fonts.body}
                onValueChange={(value) => {
                  setSettings((c) => ({
                    ...c!,
                    fonts: { ...c!.fonts, body: value }
                  }))
                  setHasChanges(true)
                }}
              >
                <SelectTrigger id="body-font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({font.category})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p
                  className="text-right"
                  style={{
                    fontFamily: settings.fonts.body,
                    fontSize: `${settings.fonts.bodySize}pt`,
                    lineHeight: '1.6',
                  }}
                >
                  זוהי תצוגה מקדימה של טקסט רגיל בדוח. הטקסט יופיע בגופן ובגודל שנבחרו. ניתן לראות כיצד
                  הגופן משפיע על קריאות הטקסט ועל המראה הכללי של הדוח.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-size">גודל טקסט רגיל: {settings.fonts.bodySize}pt</Label>
              <Slider
                id="body-size"
                min={8}
                max={14}
                step={0.5}
                value={[settings.fonts.bodySize]}
                onValueChange={([value]) => {
                  setSettings((c) => ({
                    ...c!,
                    fonts: { ...c!.fonts, bodySize: value }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>כותרת עליונה ותחתונה</CardTitle>
            <CardDescription>התאמת כותרות PDF</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="header-enabled">כותרת עליונה</Label>
                <p className="text-sm text-muted-foreground">הוסף כותרת לכל הדפים</p>
              </div>
              <Switch
                id="header-enabled"
                checked={settings.header.enabled}
                onCheckedChange={(checked) => {
                  setSettings((c) => ({
                    ...c!,
                    header: { ...c!.header, enabled: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="header-logo">הצג לוגו</Label>
                <p className="text-sm text-muted-foreground">לוגו בכותרת העליונה</p>
              </div>
              <Switch
                id="header-logo"
                checked={settings.header.showLogo}
                disabled={!settings.header.enabled}
                onCheckedChange={(checked) => {
                  setSettings((c) => ({
                    ...c!,
                    header: { ...c!.header, showLogo: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="footer-enabled">כותרת תחתונה</Label>
                <p className="text-sm text-muted-foreground">הוסף כותרת תחתונה לכל הדפים</p>
              </div>
              <Switch
                id="footer-enabled"
                checked={settings.footer.enabled}
                onCheckedChange={(checked) => {
                  setSettings((c) => ({
                    ...c!,
                    footer: { ...c!.footer, enabled: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="footer-page-numbers">מספרי עמודים</Label>
                <p className="text-sm text-muted-foreground">הצג מספרי עמודים</p>
              </div>
              <Switch
                id="footer-page-numbers"
                checked={settings.footer.showPageNumbers}
                disabled={!settings.footer.enabled}
                onCheckedChange={(checked) => {
                  setSettings((c) => ({
                    ...c!,
                    footer: { ...c!.footer, showPageNumbers: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info size={24} weight="duotone" className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">הגדרות המיתוג יחולו על כל הדוחות החדשים</h4>
              <p className="text-sm text-muted-foreground">
                השינויים שתבצע יחולו אוטומטית על כל דוחות ה-PDF שתייצא מעכשיו והלאה.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <PDFPreview branding={settings} onClose={() => setShowPreview(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
