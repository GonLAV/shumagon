// Minimal Express backend to run alongside the frontend
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Root message
app.get('/', (_req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Appraisal Backend</title>
        <style>body{font-family:system-ui, Arial; padding:24px} code{background:#f4f4f5; padding:2px 6px; border-radius:4px}</style>
      </head>
      <body>
        <h1>Appraisal Backend</h1>
        <p>Status: <a href="/health">/health</a></p>
        <p>Frontend UI runs at <code>http://localhost:5001/</code> (Vite dev server).</p>
        <p>Sample API: POST <code>/api/valuations</code> with <code>{ propertyId, method }</code>.</p>
      </body>
    </html>
  `)
})

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Stub valuations endpoint
app.post('/api/valuations', (req, res) => {
  const { propertyId, method } = req.body || {}
  if (!propertyId || !method) {
    return res.status(400).json({ error: 'propertyId and method required' })
  }
  const result = {
    propertyId,
    method,
    estimatedValue: 2950000,
    valueRange: { min: 2700000, max: 3200000 },
    confidence: 85,
    methodology: 'Stubbed comparable sales analysis',
  }
  res.json(result)
})

app.listen(PORT, () => {
  console.log(`✓ Backend server running on http://localhost:${PORT}`)
  console.log(`✓ Health check: http://localhost:${PORT}/health`)
})
