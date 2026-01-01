import { Plus, House } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppHeader({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <header className="bg-card sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <House className="text-primary-foreground" size={20} weight="fill" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              AppraisalPro
            </h1>
            <p className="text-xs text-muted-foreground">מערכת שמאות נדל״ן</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 hover:bg-secondary" />
          <Button onClick={onCreateNew} className="gap-2">
            <Plus size={18} weight="bold" />
            שומה חדשה
          </Button>
        </div>
      </div>
    </header>
  )
}
