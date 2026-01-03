import { Plus, House, MagnifyingGlass, TextT } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppHeader({ onCreateNew, rtl, onToggleRTL }: { onCreateNew: () => void; rtl?: boolean; onToggleRTL?: () => void }) {
  return (
    <header className="bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/75 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
            <House className="text-primary-foreground" size={20} weight="fill" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              AppraisalPro
            </h1>
            <p className="text-xs text-muted-foreground">מערכת שמאות נדל״ן</p>
          </div>
        </div>

        <div className="hidden md:block flex-1">
          <div className="relative max-w-xl mx-auto">
            <MagnifyingGlass size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי כתובת / גוש-חלקה / תכנית..."
              className="pr-9 h-10 rounded-xl bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-secondary" />
          {onToggleRTL && (
            <Button variant="secondary" className="gap-2 h-10" onClick={onToggleRTL}>
              <TextT size={18} />
              {rtl ? 'RTL' : 'LTR'}
            </Button>
          )}
          <Button onClick={onCreateNew} className="gap-2">
            <Plus size={18} weight="bold" />
            שומה חדשה
          </Button>
        </div>
      </div>
    </header>
  )
}
