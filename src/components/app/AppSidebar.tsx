import { useState, useMemo } from 'react'
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
      title: 'ראשי',
      items: [
        { id: 'dashboard', label: 'לוח בקרה', icon: House, keywords: ['בית', 'דשבורד', 'סטטיסטיקות', 'ראשי'] },
        { id: 'properties', label: 'נכסים', icon: Buildings, keywords: ['דירות', 'בתים', 'מקרקעין', 'רכוש'] },
        { id: 'clients', label: 'לקוחות', icon: Users, keywords: ['קונים', 'מוכרים', 'משקיעים', 'אנשי קשר'] },
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
        { id: 'calculators', label: 'מחשבונים נוספים', icon: Calculator, keywords: ['חישוב', 'התאמות', 'נוסחאות', 'השוואה', 'בולק', 'מרובה', 'פורטפוליו', 'חלוקה', 'פיצול', 'בניין', 'דירות', 'יחידות', 'תמ"א', 'פינוי בינוי'] },
      ]
    },
    {
      title: 'ניתוח שוק',
      items: [
        { id: 'insights', label: 'ניתוח ותובנות', icon: ChartBar, keywords: ['מגמות', 'סטטיסטיקות', 'נתונים', 'גרפים', 'שוק', 'AI', 'בינה מלאכותית', 'חיזוי'] },
        { id: 'transactions-map', label: 'מפת עסקאות ארצית', icon: MapTrifold, keywords: ['מפה', 'עסקאות', 'ישראל', 'גאוגרפי', 'מיקום', 'אזורי', 'ארצי', 'נדלן', 'ממשלה'] },
        { id: 'rental-analysis', label: 'ניתוח שכירות', icon: Calculator, keywords: ['שכירות', 'חישוב', 'התאמות', 'השוואה', 'מחיר', 'דמי שכירות', 'נתונים', 'מאגר', 'עסקאות'] },
      ]
    },
    {
      title: 'ניהול',
      items: [
        { id: 'cases', label: 'ניהול תיקים', icon: FolderOpen, keywords: ['פרויקטים', 'תיקים', 'מעקב', 'סטטוס', 'משימות'] },
        { id: 'standardized', label: 'דוחות תקניים', icon: FileText, keywords: ['תקן', 'רשמי', 'בנק', 'בית משפט', 'דוח', 'מסמכים'] },
        { id: 'portal', label: 'פורטל לקוחות', icon: UserCircle, keywords: ['לקוח', 'גישה', 'שיתוף', 'צפייה', 'פורטל', 'תקשורת', 'מייל', 'דוחות'] },
        { id: 'business', label: 'ניהול עסקי', icon: CurrencyDollar, keywords: ['הכנסות', 'הוצאות', 'רווחיות', 'כסף', 'עסק', 'צוות', 'הרשאות'] },
      ]
    },
    {
      title: 'הגדרות',
      items: [
        { id: 'branding', label: 'מיתוג ועיצוב', icon: Palette, keywords: ['עיצוב', 'לוגו', 'צבעים', 'גופנים', 'PDF'] },
        { id: 'api-settings', label: 'חיבורי נתונים', icon: Key, keywords: ['אימות', 'מפתחות', 'API', 'הגדרות', 'חיבורים', 'iPlan', 'Mavat', 'GovMap', 'ממשלה', 'אבטחה', 'נדל"ן', 'סנכרון', 'ייבוא', 'ממשלתי', 'זכויות בנייה', 'תכנון', 'היתרים'] },
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
