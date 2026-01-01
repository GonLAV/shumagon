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
  X
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
  SidebarProvider
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        { id: 'dashboard', label: 'לוח בקרה', icon: House, keywords: ['בית', 'דשבורד', 'סטטיסטיקות'] },
        { id: 'properties', label: 'נכסים', icon: House, keywords: ['דירות', 'בתים', 'מקרקעין', 'רכוש'] },
        { id: 'clients', label: 'לקוחות', icon: Users, keywords: ['קונים', 'מוכרים', 'משקיעים', 'אנשי קשר'] },
      ]
    },
    {
      title: 'שומות וניתוח',
      items: [
        { id: 'calculators', label: 'מחשבונים מקצועיים', icon: Calculator, keywords: ['חישוב', 'התאמות', 'נוסחאות', 'השוואה'] },
        { id: 'bulk', label: 'שומה מרובה', icon: ListChecks, keywords: ['תיק', 'פורטפוליו', 'מספר נכסים'] },
        { id: 'tester', label: 'בדיקת מנוע שומה', icon: Flask, keywords: ['בדיקה', 'טסט', 'ולידציה'] },
        { id: 'ai-insights', label: 'תובנות AI', icon: Robot, keywords: ['בינה מלאכותית', 'חיזוי', 'המלצות'] },
        { id: 'insights', label: 'ניתוח שוק', icon: ChartBar, keywords: ['מגמות', 'סטטיסטיקות', 'נתונים', 'גרפים'] },
      ]
    },
    {
      title: 'דוחות ומסמכים',
      items: [
        { id: 'standardized', label: 'דוחות תקניים', icon: FileText, keywords: ['תקן', 'רשמי', 'בנק', 'בית משפט'] },
        { id: 'automated-reports', label: 'דוחות מגמות', icon: ChartBar, keywords: ['מגמות', 'אוטומטי', 'שבועי', 'חודשי'] },
        { id: 'branding', label: 'מיתוג PDF', icon: Palette, keywords: ['עיצוב', 'לוגו', 'צבעים', 'גופנים'] },
      ]
    },
    {
      title: 'ניהול תיקים',
      items: [
        { id: 'cases', label: 'ניהול תיקים', icon: FolderOpen, keywords: ['פרויקטים', 'תיקים', 'מעקב', 'סטטוס'] },
        { id: 'multi-unit', label: 'ריבוי יחידות', icon: Buildings, keywords: ['בניין', 'דירות', 'יחידות', 'משותף'] },
        { id: 'distribution', label: 'חלוקת יחידות', icon: Buildings, keywords: ['פיצול', 'איזון', 'משקל', 'חלוקה'] },
        { id: 'development', label: 'זכויות בנייה', icon: Calculator, keywords: ['תכנון', 'תמ"א', 'פינוי בינוי', 'בניה'] },
      ]
    },
    {
      title: 'תקשורת ומעקב',
      items: [
        { id: 'email', label: 'דוחות שנשלחו', icon: EnvelopeSimple, keywords: ['מייל', 'אימייל', 'שליחה', 'היסטוריה'] },
        { id: 'sequences', label: 'רצפי מעקב', icon: Lightning, keywords: ['אוטומציה', 'תזכורות', 'מעקב', 'פולואפ'] },
        { id: 'portal', label: 'פורטל לקוחות', icon: UserCircle, keywords: ['לקוח', 'גישה', 'שיתוף', 'צפייה'] },
      ]
    },
    {
      title: 'טכנולוגיות מתקדמות',
      items: [
        { id: 'digital-twin', label: 'תאום דיגיטלי', icon: Cube, keywords: ['3D', 'מודל', 'וירטואלי', 'תלת מימד'] },
        { id: 'data-sources', label: 'מקורות נתונים', icon: Database, keywords: ['API', 'ממשלתי', 'חיבורים', 'נתונים'] },
        { id: 'import', label: 'ייבוא עסקאות', icon: CloudArrowDown, keywords: ['העלאה', 'CSV', 'אקסל', 'ייבוא'] },
      ]
    },
    {
      title: 'ניהול עסקי',
      items: [
        { id: 'business', label: 'ניהול עסקי', icon: CurrencyDollar, keywords: ['הכנסות', 'הוצאות', 'רווחיות', 'כסף'] },
        { id: 'team-manage', label: 'צוות והרשאות', icon: ShieldCheck, keywords: ['משתמשים', 'הרשאות', 'ניהול', 'גישה'] },
        { id: 'team', label: 'שיתוף פעולה', icon: UsersThree, keywords: ['צוות', 'משותף', 'שיתופי', 'קולבורציה'] },
        { id: 'audit', label: 'Audit Trail', icon: ClockCounterClockwise, keywords: ['לוג', 'היסטוריה', 'שינויים', 'ביקורת'] },
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
  }, [searchQuery, menuItems])

  return (
    <Sidebar collapsible="icon" className="border-l border-border/50 glass-effect">
      <SidebarHeader className="border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shrink-0">
            <Lightning weight="fill" className="text-primary-foreground" size={20} />
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="font-bold text-sm truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AppraisalPro
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              מערכת שמאות מתקדמת
            </p>
          </div>
        </div>

        <div className="mt-4 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <MagnifyingGlass 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
              size={16} 
              weight="bold"
            />
            <Input
              type="text"
              placeholder="חיפוש פיצ'רים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-8 h-9 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} className="text-muted-foreground hover:text-foreground" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2 px-1">
              {filteredMenuItems.reduce((sum, group) => sum + group.items.length, 0)} תוצאות
            </p>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-12 px-4 group-data-[collapsible=icon]:hidden">
            <MagnifyingGlass size={32} className="text-muted-foreground/50 mx-auto mb-3" weight="duotone" />
            <p className="text-sm text-muted-foreground">
              לא נמצאו תוצאות
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              נסה מילות חיפוש אחרות
            </p>
          </div>
        ) : (
          filteredMenuItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 mb-1 group-data-[collapsible=icon]:hidden">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
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
                            w-full transition-all duration-200
                            ${isActive 
                              ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-[0_0_12px_rgba(var(--primary),0.2)]' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }
                          `}
                          tooltip={item.label}
                        >
                          <Icon 
                            size={18} 
                            weight="duotone" 
                            className={isActive ? 'text-primary' : ''}
                          />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  )
}
