import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  CheckCircle,
  Clock,
  Warning,
  ChatCircle,
  Lock,
  LockOpen,
  UserCircle,
  ChartBar
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'senior-appraiser' | 'junior-appraiser' | 'inspector' | 'assistant' | 'viewer'
  avatar?: string
  activeProjects: number
  completedThisMonth: number
  isOnline: boolean
}

interface WorkflowTask {
  id: string
  propertyId: string
  propertyAddress: string
  title: string
  status: 'pending' | 'in-progress' | 'review' | 'approved' | 'completed'
  assignedTo: string
  assignedBy: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  comments: Comment[]
  dependencies?: string[]
  completedAt?: Date
}

interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: Date
  mentions?: string[]
}

export function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState('overview')

  const teamMembers: TeamMember[] = [
    {
      id: 'u1',
      name: 'דוד כהן',
      email: 'david@appraisal.co.il',
      role: 'admin',
      avatar: '👨‍💼',
      activeProjects: 8,
      completedThisMonth: 24,
      isOnline: true
    },
    {
      id: 'u2',
      name: 'שרה לוי',
      email: 'sarah@appraisal.co.il',
      role: 'senior-appraiser',
      avatar: '👩‍💼',
      activeProjects: 6,
      completedThisMonth: 18,
      isOnline: true
    },
    {
      id: 'u3',
      name: 'יוסי אברהם',
      email: 'yossi@appraisal.co.il',
      role: 'junior-appraiser',
      avatar: '👨',
      activeProjects: 4,
      completedThisMonth: 12,
      isOnline: false
    },
    {
      id: 'u4',
      name: 'מיכל דוד',
      email: 'michal@appraisal.co.il',
      role: 'inspector',
      avatar: '👩',
      activeProjects: 12,
      completedThisMonth: 35,
      isOnline: true
    }
  ]

  const workflows: WorkflowTask[] = [
    {
      id: 'w1',
      propertyId: 'p1',
      propertyAddress: 'רחוב הרצל 45, תל אביב',
      title: 'ביקור שטח ותיעוד',
      status: 'in-progress',
      assignedTo: 'u4',
      assignedBy: 'u1',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'high',
      progress: 65,
      comments: [
        {
          id: 'c1',
          userId: 'u1',
          userName: 'דוד כהן',
          text: '@מיכל בבקשה לצלם גם את המרתף',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          mentions: ['u4']
        }
      ]
    },
    {
      id: 'w2',
      propertyId: 'p2',
      propertyAddress: 'שדרות רוטשילד 120, תל אביב',
      title: 'סקירת שמאי בכיר',
      status: 'review',
      assignedTo: 'u2',
      assignedBy: 'u1',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 'urgent',
      progress: 90,
      comments: []
    },
    {
      id: 'w3',
      propertyId: 'p3',
      propertyAddress: 'רחוב ביאליק 8, רמת גן',
      title: 'ניתוח נתונים וחישוב שווי',
      status: 'pending',
      assignedTo: 'u3',
      assignedBy: 'u2',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      progress: 0,
      comments: []
    }
  ]

  const getRoleLabel = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return 'מנהל'
      case 'senior-appraiser': return 'שמאי בכיר'
      case 'junior-appraiser': return 'שמאי מתמחה'
      case 'inspector': return 'בודק'
      case 'assistant': return 'עוזר'
      case 'viewer': return 'צופה'
    }
  }

  const getRoleBadgeColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return 'bg-primary/20 text-primary border-primary'
      case 'senior-appraiser': return 'bg-accent/20 text-accent border-accent'
      case 'junior-appraiser': return 'bg-success/20 text-success border-success'
      case 'inspector': return 'bg-warning/20 text-warning border-warning'
      default: return 'bg-muted/20'
    }
  }

  const getStatusBadge = (status: WorkflowTask['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock size={12} /> ממתין</Badge>
      case 'in-progress':
        return <Badge className="bg-primary/20 text-primary border-primary gap-1"><Clock size={12} /> בביצוע</Badge>
      case 'review':
        return <Badge className="bg-warning/20 text-warning border-warning gap-1"><Warning size={12} /> בבדיקה</Badge>
      case 'approved':
        return <Badge className="bg-success/20 text-success border-success gap-1"><CheckCircle size={12} /> אושר</Badge>
      case 'completed':
        return <Badge className="bg-success/20 text-success border-success gap-1"><CheckCircle size={12} /> הושלם</Badge>
    }
  }

  const getPriorityBadge = (priority: WorkflowTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-destructive/20 text-destructive border-destructive">דחוף</Badge>
      case 'high':
        return <Badge className="bg-warning/20 text-warning border-warning">גבוהה</Badge>
      case 'medium':
        return <Badge className="bg-primary/20 text-primary border-primary">בינונית</Badge>
      case 'low':
        return <Badge variant="outline">נמוכה</Badge>
    }
  }

  const getAssignedMember = (userId: string) => {
    return teamMembers.find(m => m.id === userId)
  }

  const totalActiveTasks = workflows.filter(w => w.status !== 'completed').length
  const avgProgress = Math.round(workflows.reduce((sum, w) => sum + w.progress, 0) / workflows.length)
  const onlineMembers = teamMembers.filter(m => m.isOnline).length

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="glass-effect border-border/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent mb-2">
              שיתוף פעולה וניהול צוות
            </h2>
            <p className="text-sm text-muted-foreground">
              ניהול משימות, תקשורת פנימית ומעקב אחר ביצועים
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-effect border-primary/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} weight="duotone" className="text-primary" />
              <h3 className="font-semibold">חברי צוות</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-primary mb-1">
              {teamMembers.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {onlineMembers} מחוברים
            </div>
          </Card>

          <Card className="glass-effect border-accent/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} weight="duotone" className="text-accent" />
              <h3 className="font-semibold">משימות פעילות</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-accent">
              {totalActiveTasks}
            </div>
          </Card>

          <Card className="glass-effect border-success/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={24} weight="duotone" className="text-success" />
              <h3 className="font-semibold">הושלמו החודש</h3>
            </div>
            <div className="font-mono text-3xl font-bold text-success">
              {teamMembers.reduce((sum, m) => sum + m.completedThisMonth, 0)}
            </div>
          </Card>

          <Card className="glass-effect border-warning/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <ChartBar size={24} weight="duotone" className="text-warning" />
              <h3 className="font-semibold">התקדמות ממוצעת</h3>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-3xl font-bold text-warning">{avgProgress}%</div>
              <Progress value={avgProgress} className="h-2" />
            </div>
          </Card>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-effect">
          <TabsTrigger value="overview" className="gap-2">
            <Users size={16} weight="duotone" />
            סקירה
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <CheckCircle size={16} weight="duotone" />
            משימות
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <UserCircle size={16} weight="duotone" />
            צוות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect border-border/50">
              <div className="p-6 border-b border-border/30">
                <h3 className="text-lg font-semibold">משימות דחופות</h3>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-6 space-y-3">
                  {workflows.filter(w => w.priority === 'urgent' || w.priority === 'high').map(task => {
                    const assignee = getAssignedMember(task.assignedTo)
                    return (
                      <Card key={task.id} className="glass-effect border-border/30 p-4 hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{task.title}</h4>
                              {getStatusBadge(task.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{task.propertyAddress}</p>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(task.priority)}
                              <Badge variant="outline" className="text-xs">
                                תאריך יעד: {format(task.dueDate, 'dd/MM/yy', { locale: he })}
                              </Badge>
                            </div>
                          </div>
                          {assignee && (
                            <div className="flex items-center gap-2">
                              <div className="text-2xl">{assignee.avatar}</div>
                              <div className="text-xs">
                                <div className="font-medium">{assignee.name}</div>
                                <div className="text-muted-foreground">{getRoleLabel(assignee.role)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>התקדמות</span>
                            <span className="font-mono">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>

            <Card className="glass-effect border-border/50">
              <div className="p-6 border-b border-border/30">
                <h3 className="text-lg font-semibold">פעילות אחרונה</h3>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={20} weight="duotone" className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-1"><strong>שרה לוי</strong> אישרה משימה</p>
                      <p className="text-xs text-muted-foreground">לפני 15 דקות</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <ChatCircle size={20} weight="duotone" className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-1"><strong>דוד כהן</strong> הוסיף הערה</p>
                      <p className="text-xs text-muted-foreground">לפני 42 דקות</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Lock size={20} weight="duotone" className="text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-1"><strong>מיכל דוד</strong> תפסה נכס לעריכה</p>
                      <p className="text-xs text-muted-foreground">לפני שעה</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                      <LockOpen size={20} weight="duotone" className="text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-1"><strong>יוסי אברהם</strong> שחרר נכס</p>
                      <p className="text-xs text-muted-foreground">לפני שעתיים</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card className="glass-effect border-border/50">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
              <h3 className="text-lg font-semibold">כל המשימות</h3>
              <Button className="gap-2">
                <CheckCircle size={16} weight="duotone" />
                משימה חדשה
              </Button>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="p-6 space-y-4">
                {workflows.map(task => {
                  const assignee = getAssignedMember(task.assignedTo)
                  const assigner = getAssignedMember(task.assignedBy)
                  return (
                    <Card key={task.id} className="glass-effect border-border/30 p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold">{task.title}</h4>
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{task.propertyAddress}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>נמסר על ידי: {assigner?.name}</span>
                            <span>•</span>
                            <span>תאריך יעד: {format(task.dueDate, 'dd/MM/yyyy', { locale: he })}</span>
                          </div>
                        </div>
                        {assignee && (
                          <div className="flex items-center gap-3 mr-4">
                            <div className="text-right">
                              <div className="font-medium">{assignee.name}</div>
                              <div className="text-xs text-muted-foreground">{getRoleLabel(assignee.role)}</div>
                            </div>
                            <div className="text-3xl relative">
                              {assignee.avatar}
                              {assignee.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>התקדמות</span>
                          <span className="font-mono">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      {task.comments.length > 0 && (
                        <div className="space-y-2">
                          {task.comments.map(comment => (
                            <div key={comment.id} className="bg-muted/20 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <ChatCircle size={14} weight="duotone" className="text-primary" />
                                <span className="text-xs font-medium">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(comment.timestamp, 'HH:mm dd/MM', { locale: he })}
                                </span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className="glass-effect border-border/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(member => (
                <Card key={member.id} className="glass-effect border-border/30 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl relative">
                      {member.avatar}
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{member.email}</p>
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {getRoleLabel(member.role)}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">פרויקטים פעילים</div>
                      <div className="font-mono text-xl font-bold text-primary">{member.activeProjects}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">הושלמו החודש</div>
                      <div className="font-mono text-xl font-bold text-success">{member.completedThisMonth}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
