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
  CloudArrowDown
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

interface AppSidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  const menuItems = [
    {
      title: 'ראשי',
      items: [
        { id: 'dashboard', label: 'לוח בקרה', icon: House },
        { id: 'properties', label: 'נכסים', icon: House },
        { id: 'clients', label: 'לקוחות', icon: Users },
      ]
    },
    {
      title: 'שומות וניתוח',
      items: [
        { id: 'calculators', label: 'מחשבונים מקצועיים', icon: Calculator },
        { id: 'bulk', label: 'שומה מרובה', icon: ListChecks },
        { id: 'tester', label: 'בדיקת מנוע שומה', icon: Flask },
        { id: 'ai-insights', label: 'תובנות AI', icon: Robot },
        { id: 'insights', label: 'ניתוח שוק', icon: ChartBar },
      ]
    },
    {
      title: 'דוחות ומסמכים',
      items: [
        { id: 'standardized', label: 'דוחות תקניים', icon: FileText },
        { id: 'automated-reports', label: 'דוחות מגמות', icon: ChartBar },
        { id: 'branding', label: 'מיתוג PDF', icon: Palette },
      ]
    },
    {
      title: 'ניהול תיקים',
      items: [
        { id: 'cases', label: 'ניהול תיקים', icon: FolderOpen },
        { id: 'multi-unit', label: 'ריבוי יחידות', icon: Buildings },
        { id: 'distribution', label: 'חלוקת יחידות', icon: Buildings },
        { id: 'development', label: 'זכויות בנייה', icon: Calculator },
      ]
    },
    {
      title: 'תקשורת ומעקב',
      items: [
        { id: 'email', label: 'דוחות שנשלחו', icon: EnvelopeSimple },
        { id: 'sequences', label: 'רצפי מעקב', icon: Lightning },
        { id: 'portal', label: 'פורטל לקוחות', icon: UserCircle },
      ]
    },
    {
      title: 'טכנולוגיות מתקדמות',
      items: [
        { id: 'digital-twin', label: 'תאום דיגיטלי', icon: Cube },
        { id: 'data-sources', label: 'מקורות נתונים', icon: Database },
        { id: 'import', label: 'ייבוא עסקאות', icon: CloudArrowDown },
      ]
    },
    {
      title: 'ניהול עסקי',
      items: [
        { id: 'business', label: 'ניהול עסקי', icon: CurrencyDollar },
        { id: 'team-manage', label: 'צוות והרשאות', icon: ShieldCheck },
        { id: 'team', label: 'שיתוף פעולה', icon: UsersThree },
        { id: 'audit', label: 'Audit Trail', icon: ClockCounterClockwise },
      ]
    }
  ]

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
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {menuItems.map((group) => (
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
                        onClick={() => onNavigate(item.id)}
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
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
