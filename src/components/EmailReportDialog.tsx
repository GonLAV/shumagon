import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportTitle: string
  reportType: string
  recipientSuggestions?: string[]
  onSend: (emailData: EmailData) => Promise<void>
}

export interface EmailData {
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  message: string
  includePassword: boolean
  password?: string
  sendCopy: boolean
  scheduleDate?: Date
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  message: string
}

interface SavedRecipient {
  email: string
  name: string
  type: 'client' | 'bank' | 'lawyer' | 'other'
  lastUsed: Date
}

export function EmailReportDialog({
  open,
  onOpenChange,
  reportTitle,
  reportType,
  recipientSuggestions = [],
  onSend
}: EmailReportDialogProps) {
  const [emailTemplates] = useKV<EmailTemplate[]>('email-templates', [
    {
      id: 'professional',
      name: 'מקצועי',
      subject: 'דוח שמאות - {property}',
      message: 'שלום רב,\n\nבצרוף מצ"ב דוח השמאות המבוקש עבור {property}.\n\nהדוח כולל ניתוח מקיף ושומה מקצועית של הנכס.\n\nנשמח לעמוד לשירותכם לכל שאלה.\n\nבברכה,\nצוות השמאות'
    },
    {
      id: 'bank',
      name: 'לבנק',
      subject: 'דוח שמאות נדל"ן - {property}',
      message: 'לכבוד,\nמחלקת משכנתאות\n\nהנדון: דוח שמאות עבור {property}\n\nמצ"ב דוח השמאות המבוקש לצורך קבלת משכנתא.\n\nהדוח נערך בהתאם לדרישות הבנק וכולל את כל הנתונים הנדרשים.\n\nבברכה,\nשמאי מקרקעין מוסמך'
    },
    {
      id: 'client',
      name: 'ללקוח',
      subject: 'דוח השמאות שלך מוכן - {property}',
      message: 'שלום,\n\nדוח השמאות עבור הנכס ב{property} מוכן!\n\nהדוח כולל:\n• שווי מעודכן של הנכס\n• ניתוח שוק מקיף\n• השוואה לנכסים דומים\n• המלצות מקצועיות\n\nניתן לצפות בדוח המצורף.\n\nנשמח לענות על כל שאלה.\n\nבהצלחה!'
    },
    {
      id: 'urgent',
      name: 'דחוף',
      subject: '⚡ דוח שמאות דחוף - {property}',
      message: 'שלום,\n\nבצרוף מצ"ב דוח השמאות הדחוף שביקשת עבור {property}.\n\nהדוח עבר בדיקת איכות מלאה ומוכן לשימוש.\n\nזמינים לכל שאלה.\n\nבברכה'
    }
  ])

  const [savedRecipients, setSavedRecipients] = useKV<SavedRecipient[]>('saved-recipients', [])
  const [emailHistory, setEmailHistory] = useKV<any[]>('email-history', [])

  const [to, setTo] = useState<string[]>(recipientSuggestions)
  const [cc, setCc] = useState<string[]>([])
  const [bcc, setBcc] = useState<string[]>([])
  const [subject, setSubject] = useState(`דוח ${reportType} - ${reportTitle}`)
  const [message, setMessage] = useState('')
  const [includePassword, setIncludePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [sendCopy, setSendCopy] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [newRecipient, setNewRecipient] = useState('')
  const [newCc, setNewCc] = useState('')
  const [newBcc, setNewBcc] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const applyTemplate = (templateId: string) => {
    const template = emailTemplates?.find(t => t.id === templateId)
    if (template) {
      setSubject(template.subject.replace('{property}', reportTitle))
      setMessage(template.message.replace(/{property}/g, reportTitle))
      setSelectedTemplate(templateId)
      toast.success(`תבנית "${template.name}" הוחלה`)
    }
  }

  const addRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    if (!email || !email.includes('@')) {
      toast.error('נא להזין כתובת אימייל תקינה')
      return
    }

    const emailLower = email.toLowerCase().trim()

    switch (type) {
      case 'to':
        if (!to.includes(emailLower)) {
          setTo([...to, emailLower])
          setNewRecipient('')
        }
        break
      case 'cc':
        if (!cc.includes(emailLower)) {
          setCc([...cc, emailLower])
          setNewCc('')
        }
        break
      case 'bcc':
        if (!bcc.includes(emailLower)) {
          setBcc([...bcc, emailLower])
          setNewBcc('')
        }
        break
    }
  }

  const removeRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    switch (type) {
      case 'to':
        setTo(to.filter(e => e !== email))
        break
      case 'cc':
        setCc(cc.filter(e => e !== email))
        break
      case 'bcc':
        setBcc(bcc.filter(e => e !== email))
        break
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let pwd = ''
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pwd)
    toast.success('סיסמה נוצרה')
  }

  const handleSend = async () => {
    if (to.length === 0) {
      toast.error('נא להוסיף לפחות נמען אחד')
      return
    }

    if (!subject.trim()) {
      toast.error('נא להזין נושא להודעה')
      return
    }

    if (includePassword && !password.trim()) {
      toast.error('נא להזין סיסמה או ליצור סיסמה אוטומטית')
      return
    }

    setIsSending(true)

    try {
      const emailData: EmailData = {
        to,
        cc,
        bcc,
        subject,
        message,
        includePassword,
        password: includePassword ? password : undefined,
        sendCopy
      }

      await onSend(emailData)

      setEmailHistory((current) => [
        {
          date: new Date().toISOString(),
          to,
          subject,
          reportTitle,
          reportType,
          status: 'sent'
        },
        ...(current || []).slice(0, 49)
      ])

      to.forEach(email => {
        setSavedRecipients((current) => {
          const existing = (current || []).find(r => r.email === email)
          if (existing) {
            return (current || []).map(r =>
              r.email === email ? { ...r, lastUsed: new Date() } : r
            )
          } else {
            return [
              ...(current || []),
              {
                email,
                name: email.split('@')[0],
                type: 'other' as const,
                lastUsed: new Date()
              }
            ]
          }
        })
      })

      toast.success('הדוח נשלח בהצלחה!')
      onOpenChange(false)
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('שגיאה בשליחת האימייל')
    } finally {
      setIsSending(false)
    }
  }

  const recentRecipients = savedRecipients
    ?.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 5)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EnvelopeSimple size={24} weight="duotone" className="text-primary" />
            שליחת דוח באימייל
          </DialogTitle>
          <DialogDescription>
            שלח את הדוח "{reportTitle}" ישירות למיילים המבוקשים
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">תבניות הודעה</Label>
              <div className="grid grid-cols-2 gap-2">
                {emailTemplates?.map(template => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyTemplate(template.id)}
                    className="justify-start"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="to">אל: *</Label>
              <div className="flex gap-2">
                <Input
                  id="to"
                  type="email"
                  placeholder="example@email.com"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRecipient(newRecipient, 'to')
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => addRecipient(newRecipient, 'to')}
                >
                  <Plus size={18} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {to.map(email => (
                  <Badge key={email} variant="secondary" className="gap-2 pl-2 pr-3">
                    {email}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removeRecipient(email, 'to')}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>

              {recentRecipients && recentRecipients.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">נמענים אחרונים:</Label>
                  <div className="flex flex-wrap gap-2">
                    {recentRecipients.map(recipient => (
                      <Button
                        key={recipient.email}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          if (!to.includes(recipient.email)) {
                            setTo([...to, recipient.email])
                          }
                        }}
                      >
                        <UserPlus size={14} className="ml-1" />
                        {recipient.email}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCc(!showCc)}
              >
                {showCc ? 'הסתר' : 'הוסף'} עותק (CC)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBcc(!showBcc)}
              >
                {showBcc ? 'הסתר' : 'הוסף'} עותק נסתר (BCC)
              </Button>
            </div>

            <AnimatePresence>
              {showCc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label htmlFor="cc">עותק (CC):</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cc"
                      type="email"
                      placeholder="cc@email.com"
                      value={newCc}
                      onChange={(e) => setNewCc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addRecipient(newCc, 'cc')
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => addRecipient(newCc, 'cc')}
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cc.map(email => (
                      <Badge key={email} variant="outline" className="gap-2 pl-2 pr-3">
                        {email}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => removeRecipient(email, 'cc')}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {showBcc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label htmlFor="bcc">עותק נסתר (BCC):</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bcc"
                      type="email"
                      placeholder="bcc@email.com"
                      value={newBcc}
                      onChange={(e) => setNewBcc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addRecipient(newBcc, 'bcc')
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => addRecipient(newBcc, 'bcc')}
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bcc.map(email => (
                      <Badge key={email} variant="outline" className="gap-2 pl-2 pr-3">
                        {email}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => removeRecipient(email, 'bcc')}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="subject">נושא: *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="נושא ההודעה"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message">הודעה:</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="תוכן ההודעה (אופציונלי)"
                rows={8}
                className="resize-none"
              />
            </div>

            <Separator />

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="password"
                    checked={includePassword}
                    onCheckedChange={(checked) => setIncludePassword(checked as boolean)}
                  />
                  <Label htmlFor="password" className="cursor-pointer">
                    הגן על הדוח בסיסמה
                  </Label>
                </div>
                {includePassword && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                  >
                    צור סיסמה
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {includePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="הזן סיסמה"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      הסיסמה תישלח בהודעה נפרדת לנמענים
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendCopy"
                  checked={sendCopy}
                  onCheckedChange={(checked) => setSendCopy(checked as boolean)}
                />
                <Label htmlFor="sendCopy" className="cursor-pointer">
                  שלח עותק אלי
                </Label>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ביטול
          </Button>
          <Button onClick={handleSend} disabled={isSending || to.length === 0}>
            <PaperPlaneTilt size={18} className="ml-2" weight="fill" />
            {isSending ? 'שולח...' : 'שלח דוח'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
