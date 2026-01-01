import { motion } from 'framer-motion'
import { Plus, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppHeader({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow-primary">
            <Lightning className="text-primary-foreground" size={24} weight="fill" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AppraisalPro
            </h1>
            <p className="text-xs text-muted-foreground">מערכת שמאות נדל״ן מתקדמת</p>
          </div>
        </motion.div>
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 hover:bg-secondary/80" />
          <Button onClick={onCreateNew} className="gap-2 bg-primary hover:bg-primary/90 glow-primary">
            <Plus size={20} weight="bold" />
            שומה חדשה
          </Button>
        </div>
      </div>
    </header>
  )
}
