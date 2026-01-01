import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
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
  Star,
  PushPin,
  Scales,
  Key
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
  const [favorites, setFavorites] = useKV<string[]>('sidebar-favorites', [])

  const toggleFavorite = (itemId: string) => {
    setFavorites((current) => {
      const currentFavs = current || []
      if (currentFavs.includes(itemId)) {
        return currentFavs.filter(id => id !== itemId)
      }
      return [...currentFavs, itemId]
    })
  }

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

  const favoriteItems = useMemo(() => {
    const favs = favorites || []
    return favs
      .map(favId => allMenuItems.find(item => item.id === favId))
      .filter(Boolean)
  }, [favorites, allMenuItems])

  const hasFavorites = favoriteItems.length > 0

  return (
    <Sidebar collapsible="icon" side="right" className="border-r border-border/40 bg-card/95 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/40 px-4 py-5 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center glow-primary shrink-0 shadow-lg">
            <Lightning weight="fill" className="text-primary-foreground" size={22} />
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="font-bold text-base tracking-tight bg-gradient-to-l from-primary via-foreground to-accent bg-clip-text text-transparent">
              AppraisalPro
            </h2>
            <p className="text-xs text-muted-foreground/80 font-medium">
              מערכת שמאות מתקדמת
            </p>
          </div>
        </div>

        <div className="mt-4 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <MagnifyingGlass 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none transition-colors" 
              size={18} 
              weight="bold"
            />
            <Input
              type="text"
              placeholder="חיפוש מהיר..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-11 pl-9 h-10 bg-background/60 border-border/60 rounded-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-destructive/10 rounded-lg transition-colors"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} className="text-muted-foreground hover:text-destructive transition-colors" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="flex items-center justify-between mt-2.5 px-1">
              <p className="text-xs text-muted-foreground/70 font-medium">
                {filteredMenuItems.reduce((sum, group) => sum + group.items.length, 0)} תוצאות נמצאו
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => setSearchQuery('')}
              >
                נקה
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <ScrollArea className="h-full">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 px-4 group-data-[collapsible=icon]:hidden">
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <MagnifyingGlass size={32} className="text-muted-foreground/40" weight="duotone" />
              </div>
              <p className="text-sm font-medium text-foreground/80 mb-1">
                לא נמצאו תוצאות
              </p>
              <p className="text-xs text-muted-foreground/60">
                נסה מילות חיפוש אחרות או נקה את החיפוש
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {!searchQuery && hasFavorites && (
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/70 px-3 mb-2 group-data-[collapsible=icon]:hidden uppercase tracking-wider flex items-center gap-2">
                    <Star size={14} weight="fill" className="text-accent" />
                    מועדפים
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {favoriteItems.map((item) => {
                        if (!item) return null
                        const Icon = item.icon
                        const isActive = activeView === item.id
                        const isFavorite = (favorites || []).includes(item.id)
                        
                        return (
                          <SidebarMenuItem key={`fav-${item.id}`}>
                            <div className="relative group/item">
                              <SidebarMenuButton
                                onClick={() => {
                                  onNavigate(item.id)
                                  setSearchQuery('')
                                }}
                                isActive={isActive}
                                className={`
                                  w-full transition-all duration-300 h-11 rounded-xl pr-11
                                  ${isActive 
                                    ? 'bg-gradient-to-l from-accent/20 via-accent/15 to-accent/10 text-accent border-r-[3px] border-accent shadow-lg shadow-accent/20 font-semibold' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:shadow-md font-medium'
                                  }
                                `}
                                tooltip={item.label}
                              >
                                <div className={`
                                  flex items-center justify-center w-9 h-9 rounded-lg transition-all
                                  ${isActive 
                                    ? 'bg-accent/25 text-accent' 
                                    : 'bg-transparent group-hover:bg-secondary'
                                  }
                                `}>
                                  <Icon 
                                    size={20} 
                                    weight={isActive ? 'fill' : 'duotone'}
                                  />
                                </div>
                                <span className="group-data-[collapsible=icon]:hidden text-sm">
                                  {item.label}
                                </span>
                              </SidebarMenuButton>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(item.id)
                                }}
                                className={`
                                  absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg transition-all
                                  group-data-[collapsible=icon]:hidden
                                  ${isFavorite 
                                    ? 'opacity-100 text-accent hover:text-accent/70' 
                                    : 'opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-accent'
                                  }
                                  hover:bg-accent/10
                                `}
                                title={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
                              >
                                <Star 
                                  size={16} 
                                  weight={isFavorite ? 'fill' : 'regular'}
                                  className="transition-all"
                                />
                              </Button>
                            </div>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {filteredMenuItems.map((group, idx) => (
                <SidebarGroup key={group.title}>
                  <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/70 px-3 mb-2 group-data-[collapsible=icon]:hidden uppercase tracking-wider">
                    {group.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeView === item.id
                        const isFavorite = (favorites || []).includes(item.id)
                        
                        return (
                          <SidebarMenuItem key={item.id}>
                            <div className="relative group/item">
                              <SidebarMenuButton
                                onClick={() => {
                                  onNavigate(item.id)
                                  setSearchQuery('')
                                }}
                                isActive={isActive}
                                className={`
                                  w-full transition-all duration-300 h-11 rounded-xl pr-11
                                  ${isActive 
                                    ? 'bg-gradient-to-l from-primary/15 via-primary/10 to-primary/5 text-primary border-r-[3px] border-primary shadow-lg shadow-primary/20 font-semibold' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:shadow-md font-medium'
                                  }
                                `}
                                tooltip={item.label}
                              >
                                <div className={`
                                  flex items-center justify-center w-9 h-9 rounded-lg transition-all
                                  ${isActive 
                                    ? 'bg-primary/20 text-primary' 
                                    : 'bg-transparent group-hover:bg-secondary'
                                  }
                                `}>
                                  <Icon 
                                    size={20} 
                                    weight={isActive ? 'fill' : 'duotone'}
                                  />
                                </div>
                                <span className="group-data-[collapsible=icon]:hidden text-sm">
                                  {item.label}
                                </span>
                              </SidebarMenuButton>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(item.id)
                                }}
                                className={`
                                  absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg transition-all
                                  group-data-[collapsible=icon]:hidden
                                  ${isFavorite 
                                    ? 'opacity-100 text-accent hover:text-accent/70' 
                                    : 'opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-accent'
                                  }
                                  hover:bg-accent/10
                                `}
                                title={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
                              >
                                <Star 
                                  size={16} 
                                  weight={isFavorite ? 'fill' : 'regular'}
                                  className="transition-all"
                                />
                              </Button>
                            </div>
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

      <SidebarFooter className="border-t border-border/40 p-4 bg-gradient-to-t from-primary/5 to-transparent group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-primary/80 flex items-center justify-center shrink-0">
            <Briefcase weight="fill" className="text-white" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground/90">גרסה מקצועית</p>
            <p className="text-[10px] text-muted-foreground/70">כל הפיצ'רים פעילים</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
