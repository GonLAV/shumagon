import { useState, useMemo } from 'react'
import { 
  House, 
  ChartBar, 
  Users, 
  UserCircle, 
  CurrencyDollar, 
  Flask, 
  Palette, 
  Cube, 
  Database, 
  UsersThree, 
  Calculator, 
  ListChecks, 
  EnvelopeSimple, 
  Lightning, 
  FolderOpen, 
  FileText, 
  Buildings, 
  ClockCounterClockwise, 
  ShieldCheck, 
  Robot, 
  CloudArrowDown,
  MagnifyingGlass,
  X,
  ChartLineUp,
  Briefcase,
  Scales,
  Key,
  MapTrifold
} from '@phosphor-icons/react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarFooter
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AppSidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const menuItems = [
    {
      title: '🎯 ראשי',
      items: [
        { id: 'dashboard', label: 'לוח בקרה', icon: House, keywords: ['בית', 'דשבורד', 'סטטיסטיקות', 'ראשי'] },
        { id: 'properties', label: 'נכסים', icon: Buildings, keywords: ['דירות', 'בתים', 'מקרקעין', 'רכוש'] },
        { id: 'clients', label: 'לקוחות', icon: Users, keywords: ['קונים', 'מוכרים', 'משקיעים', 'אנשי קשר'] },
      ]
    },
    {
      title: '🧮 שומות וחישובים',
      items: [
        { id: 'quicker', label: 'QUICKER - שומה מהירה', icon: Lightning, keywords: ['מהיר', 'פשוט', 'בסיסי', 'חישוב', 'שטח', 'מחיר'] },
        { id: 'calculators', label: 'מחשבונים מקצועיים', icon: Calculator, keywords: ['חישוב', 'התאמות', 'נוסחאות', 'השוואה'] },
        { id: 'office-valuation', label: 'שווי משרדים (נדל"ן)', icon: Briefcase, keywords: ['משרדים', 'מסחרי', 'NOI', 'היוון', 'חלל עבודה', 'אופיס', 'nadlan'] },
        { id: 'residential-valuation', label: 'שווי דירות מגורים (נדל"ן)', icon: House, keywords: ['דירות', 'מגורים', 'דיור', 'nadlan', 'נדלן'] },
        { id: 'commercial-valuation', label: 'שווי נכסי מסחר (נדל"ן)', icon: Briefcase, keywords: ['מסחר', 'חנויות', 'מסעדות', 'nadlan', 'נדלן'] },
        { id: 'land-valuation', label: 'שווי קרקעות (נדל"ן)', icon: ChartLineUp, keywords: ['קרקע', 'מגרש', 'זכויות בנייה', 'nadlan', 'נדלן'] },
        { id: 'betterment-levy', label: 'היטל השבחה', icon: Scales, keywords: ['היטל', 'השבחה', 'תכנון', 'זכויות', 'תב"ע', 'מועד קובע'] },
        { id: 'bulk', label: 'שומה מרובה', icon: ListChecks, keywords: ['תיק', 'פורטפוליו', 'מספר נכסים', 'בולק'] },
        { id: 'distribution', label: 'חלוקת יחידות', icon: Buildings, keywords: ['פיצול', 'איזון', 'משקל', 'חלוקה', 'בניין'] },
        { id: 'development', label: 'זכויות בנייה', icon: ChartLineUp, keywords: ['תכנון', 'תמ"א', 'פינוי בינוי', 'בניה', 'זכויות'] },
        { id: 'tester', label: 'בדיקת מנוע שומה', icon: Flask, keywords: ['בדיקה', 'טסט', 'ולידציה', 'מנוע'] },
      ]
    },
    {
      title: '📊 ניתוח ותובנות',
      items: [
        { id: 'insights', label: 'ניתוח שוק', icon: ChartBar, keywords: ['מגמות', 'סטטיסטיקות', 'נתונים', 'גרפים', 'שוק'] },
        { id: 'transactions-map', label: 'מפת עסקאות ארצית', icon: MapTrifold, keywords: ['מפה', 'עסקאות', 'ישראל', 'גאוגרפי', 'מיקום', 'אזורי', 'ארצי', 'נדלן', 'ממשלה'] },
        { id: 'ai-insights', label: 'תובנות AI', icon: Robot, keywords: ['בינה מלאכותית', 'חיזוי', 'המלצות', 'אוטומטי'] },
        { id: 'automated-reports', label: 'דוחות מגמות', icon: ChartLineUp, keywords: ['מגמות', 'אוטומטי', 'שבועי', 'חודשי', 'טרנד'] },
      ]
    },
    {
      title: '📄 דוחות ומסמכים',
      items: [
        { id: 'standardized', label: 'דוחות תקניים', icon: FileText, keywords: ['תקן', 'רשמי', 'בנק', 'בית משפט', 'דוח'] },
        { id: 'branding', label: 'מיתוג ועיצוב', icon: Palette, keywords: ['עיצוב', 'לוגו', 'צבעים', 'גופנים', 'PDF'] },
      ]
    },
    {
      title: '📁 ניהול תיקים ופרויקטים',
      items: [
        { id: 'cases', label: 'ניהול תיקים', icon: FolderOpen, keywords: ['פרויקטים', 'תיקים', 'מעקב', 'סטטוס', 'משימות'] },
        { id: 'multi-unit', label: 'ריבוי יחידות', icon: Buildings, keywords: ['בניין', 'דירות', 'יחידות', 'משותף', 'מרובה'] },
      ]
    },
    {
      title: '📧 תקשורת ומעקב',
      items: [
        { id: 'email', label: 'דוחות שנשלחו', icon: EnvelopeSimple, keywords: ['מייל', 'אימייל', 'שליחה', 'היסטוריה'] },
        { id: 'sequences', label: 'רצפי מעקב', icon: Lightning, keywords: ['אוטומציה', 'תזכורות', 'מעקב', 'פולואפ', 'רצף'] },
        { id: 'portal', label: 'פורטל לקוחות', icon: UserCircle, keywords: ['לקוח', 'גישה', 'שיתוף', 'צפייה', 'פורטל'] },
      ]
    },
    {
      title: '🏘️ נתוני שכירות',
      items: [
        { id: 'rental-data', label: 'ניהול נתוני שכירות', icon: Database, keywords: ['שכירות', 'דמי שכירות', 'נתונים', 'מאגר', 'עסקאות'] },
        { id: 'rental-analysis', label: 'ניתוח שכירות', icon: Calculator, keywords: ['שכירות', 'חישוב', 'התאמות', 'השוואה', 'מחיר'] },
      ]
    },
    {
      title: '🚀 טכנולוגיות מתקדמות',
      items: [
        { id: 'real-building-rights', label: 'זכויות בנייה אמיתיות', icon: Buildings, keywords: ['iPlan', 'מבא"ת', 'Mavat', 'זכויות', 'תכנון', 'היתרים', 'ממשלה', 'API', 'אמיתי', 'גוש', 'חלקה'] },
        { id: 'digital-twin', label: 'תאום דיגיטלי 3D', icon: Cube, keywords: ['3D', 'מודל', 'וירטואלי', 'תלת מימד'] },
        { id: 'data-sources', label: 'מקורות נתונים חיים', icon: Database, keywords: ['API', 'ממשלתי', 'חיבורים', 'נתונים', 'לייב'] },
        { id: 'import', label: 'ייבוא עסקאות', icon: CloudArrowDown, keywords: ['העלאה', 'CSV', 'אקסל', 'ייבוא', 'ייצוא'] },
        { id: 'market-sync', label: 'סנכרון נתוני שוק', icon: Database, keywords: ['סנכרון', 'אוטומטי', 'עסקאות', 'שוק', 'ממשלה', 'רשם', 'מיסים'] },
      ]
    },
    {
      title: '💼 ניהול עסקי',
      items: [
        { id: 'business', label: 'ניתוח עסקי', icon: CurrencyDollar, keywords: ['הכנסות', 'הוצאות', 'רווחיות', 'כסף', 'עסק'] },
        { id: 'team-manage', label: 'ניהול צוות', icon: ShieldCheck, keywords: ['משתמשים', 'הרשאות', 'ניהול', 'גישה', 'צוות'] },
        { id: 'team', label: 'שיתוף פעולה', icon: UsersThree, keywords: ['צוות', 'משותף', 'שיתופי', 'קולבורציה'] },
        { id: 'audit', label: 'מעקב שינויים', icon: ClockCounterClockwise, keywords: ['לוג', 'היסטוריה', 'שינויים', 'ביקורת', 'audit'] },
        { id: 'api-settings', label: 'הגדרות API', icon: Key, keywords: ['אימות', 'מפתחות', 'API', 'הגדרות', 'חיבורים', 'iPlan', 'Mavat', 'GovMap', 'ממשלה', 'אבטחה'] },
        { id: 'api-analytics', label: 'ניתוח שימוש ב-API', icon: ChartBar, keywords: ['API', 'בקשות', 'עלויות', 'ניתוח', 'סטטיסטיקה', 'מעקב', 'שימוש', 'analytics'] },
        { id: 'api-quota', label: 'ניהול מכסות API', icon: Briefcase, keywords: ['API', 'מכסות', 'quota', 'throttling', 'הגבלות', 'שליטה', 'ניהול', 'תקציב', 'בקשות'] },
        { id: 'historical-search', label: 'חיפוש היסטורי', icon: MagnifyingGlass, keywords: ['חיפוש', 'היסטוריה', 'רשומות', 'ארכיון', 'נתונים קודמים', 'היטל', 'תכניות'] },
      ]
    }
  ]

  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems

    const query = searchQuery.toLowerCase().trim()
    
    return menuItems
      .map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.label.toLowerCase().includes(query) ||
          item.keywords?.some(keyword => keyword.toLowerCase().includes(query))
        )
      }))
      .filter(group => group.items.length > 0)
  }, [searchQuery])

  const allMenuItems = useMemo(() => {
    return menuItems.flatMap(group => group.items)
  }, [])

  return (
    <Sidebar collapsible="icon" side="right" className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <House weight="fill" className="text-primary-foreground" size={20} />
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-sm text-foreground">
              AppraisalPro
            </h2>
            <p className="text-xs text-muted-foreground">
              מערכת שמאות
            </p>
          </div>
        </div>

        <div className="mt-3 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <MagnifyingGlass 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
              size={16} 
            />
            <Input
              type="text"
              placeholder="חיפוש..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 pl-3 h-9 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} className="text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <ScrollArea className="h-full">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12 px-4 group-data-[collapsible=icon]:hidden">
              <MagnifyingGlass size={28} className="text-muted-foreground/40 mx-auto mb-2" weight="duotone" />
              <p className="text-sm text-muted-foreground">
                לא נמצאו תוצאות
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMenuItems.map((group) => (
                <SidebarGroup key={group.title}>
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2 mb-1 group-data-[collapsible=icon]:hidden">
                    {group.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeView === item.id
                        
                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              onClick={() => {
                                onNavigate(item.id)
                                setSearchQuery('')
                              }}
                              isActive={isActive}
                              className={`
                                w-full h-9 rounded-lg
                                ${isActive 
                                  ? 'bg-primary text-primary-foreground font-medium' 
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }
                              `}
                              tooltip={item.label}
                            >
                              <Icon 
                                size={18} 
                                weight={isActive ? 'fill' : 'regular'}
                              />
                              <span className="group-data-[collapsible=icon]:hidden text-sm">
                                {item.label}
                              </span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </div>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 group-data-[collapsible=icon]:hidden">
        <div className="text-xs text-center text-muted-foreground">
          גרסה מקצועית
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
