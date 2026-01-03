import { useMemo, useState } from 'react'
import { 
  House, 
  ChartBar, 
  Users, 
  UserCircle, 
  CurrencyDollar, 
  Palette, 
  Calculator, 
  Lightning, 
  FolderOpen, 
  FileText, 
  Buildings, 
  MagnifyingGlass,
  X,
  ChartLineUp,
  Briefcase,
  Scales,
  Key,
  MapTrifold,
  ArrowsLeftRight
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

  const menuItems = useMemo(
    () => [
      {
        title: 'ראשי',
        items: [
          { id: 'dashboard', label: 'לוח בקרה', icon: House, keywords: ['בית', 'דשבורד', 'סטטיסטיקות', 'ראשי'] },
          { id: 'properties', label: 'נכסים', icon: Buildings, keywords: ['דירות', 'בתים', 'מקרקעין', 'רכוש'] },
          { id: 'clients', label: 'לקוחות', icon: Users, keywords: ['קונים', 'מוכרים', 'משקיעים', 'אנשי קשר'] }
        ]
      },
      {
        title: 'שומות',
        items: [
          { id: 'data-gov-valuation', label: '🇮🇱 Data.gov.il - שמאות ממשלתית', icon: Calculator, keywords: ['ממשלה', 'data.gov.il', 'אמיתי', 'שקוף', 'API', 'מקצועי', 'לגיטימי'] },
          { id: 'quicker', label: 'QUICKER - שומה מהירה', icon: Lightning, keywords: ['מהיר', 'פשוט', 'בסיסי', 'חישוב', 'שטח', 'מחיר'] },
          { id: 'residential-valuation', label: 'שווי דירות מגורים', icon: House, keywords: ['דירות', 'מגורים', 'דיור', 'nadlan', 'נדלן'] },
          { id: 'commercial-valuation', label: 'שווי נכסי מסחר', icon: Briefcase, keywords: ['מסחר', 'חנויות', 'מסעדות', 'nadlan', 'נדלן', 'משרדים', 'מסחרי', 'NOI', 'היוון', 'חלל עבודה', 'אופיס'] },
          { id: 'land-valuation', label: 'שווי קרקעות', icon: ChartLineUp, keywords: ['קרקע', 'מגרש', 'זכויות בנייה', 'nadlan', 'נדלן'] },
          { id: 'betterment-levy', label: 'היטל השבחה', icon: Scales, keywords: ['היטל', 'השבחה', 'תכנון', 'זכויות', 'תב"ע', 'מועד קובע'] },
          { id: 'calculators', label: 'מחשבונים נוספים', icon: Calculator, keywords: ['חישוב', 'התאמות', 'נוסחאות', 'השוואה', 'בולק', 'מרובה', 'פורטפוליו', 'חלוקה', 'פיצול', 'בניין', 'דירות', 'יחידות', 'תמ"א', 'פינוי בינוי'] }
        ]
      },
      {
        title: 'ניתוח שוק',
        items: [
          { id: 'insights', label: 'ניתוח ותובנות', icon: ChartBar, keywords: ['מגמות', 'סטטיסטיקות', 'נתונים', 'גרפים', 'שוק', 'AI', 'בינה מלאכותית', 'חיזוי'] },
          { id: 'transactions-map', label: 'מפת עסקאות ארצית', icon: MapTrifold, keywords: ['מפה', 'עסקאות', 'ישראל', 'גאוגרפי', 'מיקום', 'אזורי', 'ארצי', 'נדלן', 'ממשלה'] },
          { id: 'rental-analysis', label: 'ניתוח שכירות', icon: Calculator, keywords: ['שכירות', 'חישוב', 'התאמות', 'השוואה', 'מחיר', 'דמי שכירות', 'נתונים', 'מאגר', 'עסקאות'] },
          { id: 'gisn-viewer', label: 'מסמכי תב"ע (GISN)', icon: FileText, keywords: ['תב"ע', 'תכנון', 'GISN', 'תיק מידע', 'PDF', 'תל אביב', 'גוש', 'חלקה', 'iView'] },
          { id: 'gisn-diff', label: 'השוואת תב"ע (GISN)', icon: ArrowsLeftRight, keywords: ['תב"ע', 'השוואה', 'חדש', 'ישן', '6400', 'GISN', 'diff'] },
          { id: 'gisn-arcgis', label: 'ArcGIS תכניות (TLV)', icon: MapTrifold, keywords: ['ArcGIS', 'TLV', 'query', 'שכבות', 'תכניות', 'גוש', 'חלקה'] },
          { id: 'gisn-doc-scanner', label: 'סריקת מסמכי GISN', icon: FileText, keywords: ['GISN', 'Docs.aspx', 'PDF', 'סריקה', 'קישורים'] },
          { id: 'ingestion-helper', label: 'עזר אינדוקס PDF', icon: FileText, keywords: ['אינדקס', 'ingest', 'PDF', 'כלים', 'מקומי'] },
          { id: 'ocr-helper', label: 'OCR לא מאומת', icon: FileText, keywords: ['OCR', 'טקסט', 'PDF', 'תמונה', 'זיהוי'] },
          { id: 'data-gov-check', label: 'בדיקת משאב Data.gov.il', icon: FileText, keywords: ['CKAN', 'resource', 'valid', 'data.gov.il'] },
          { id: 'taba-extractor', label: 'חילוץ הוראות תב"ע', icon: FileText, keywords: ['TABA', 'חילוץ', 'הוראות', 'JSON', 'OCR'] }
        ]
      },
      {
        title: 'ניהול',
        items: [
          { id: 'cases', label: 'ניהול תיקים', icon: FolderOpen, keywords: ['פרויקטים', 'תיקים', 'מעקב', 'סטטוס', 'משימות'] },
          { id: 'tasks', label: 'משימות', icon: FileText, keywords: ['משימות', 'סטטוס', 'עדיפות', 'מעקב', 'צוות'] },
          { id: 'income-report', label: 'דוח הכנסות', icon: CurrencyDollar, keywords: ['הכנסות', 'תשלומים', 'חשבוניות', 'כסף', 'עסקי'] },
          { id: 'standardized', label: 'דוחות תקניים', icon: FileText, keywords: ['תקן', 'רשמי', 'בנק', 'בית משפט', 'דוח', 'מסמכים'] },
          { id: 'portal', label: 'פורטל לקוחות', icon: UserCircle, keywords: ['לקוח', 'גישה', 'שיתוף', 'צפייה', 'פורטל', 'תקשורת', 'מייל', 'דוחות'] },
          { id: 'business', label: 'ניהול עסקי', icon: CurrencyDollar, keywords: ['הכנסות', 'הוצאות', 'רווחיות', 'כסף', 'עסק', 'צוות', 'הרשאות'] }
        ]
      },
      {
        title: 'הגדרות',
        items: [
          { id: 'branding', label: 'מיתוג ועיצוב', icon: Palette, keywords: ['עיצוב', 'לוגו', 'צבעים', 'גופנים', 'PDF'] },
          { id: 'api-settings', label: 'חיבורי נתונים', icon: Key, keywords: ['אימות', 'מפתחות', 'API', 'הגדרות', 'חיבורים', 'iPlan', 'Mavat', 'GovMap', 'ממשלה', 'אבטחה', 'נדל"ן', 'סנכרון', 'ייבוא', 'ממשלתי', 'זכויות בנייה', 'תכנון', 'היתרים'] }
        ]
      }
    ],
    []
  )

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
  }, [menuItems, searchQuery])

  return (
    <Sidebar collapsible="icon" side="right" className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-sm">
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
              className="pr-9 pl-3 h-10 text-sm rounded-xl bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-primary/20"
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
                    <SidebarMenu className="space-y-1">
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
                              className={
                                `relative w-full h-10 rounded-xl px-3 ` +
                                (isActive
                                  ? 'bg-secondary text-foreground font-semibold shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60')
                              }
                              tooltip={item.label}
                            >
                              {isActive && (
                                <span
                                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-primary"
                                  aria-hidden
                                />
                              )}
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
