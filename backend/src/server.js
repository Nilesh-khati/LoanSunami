import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import leadRoutes from './routes/leadRoutes.js'
import rateRoutes from './routes/rateRoutes.js'
import faqRoutes from './routes/faqRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import calculatorRoutes from './routes/calculatorRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

// ── Connect to MongoDB ─────────────────────────────────────────
connectDB()

const app = express()

// ── Security headers ───────────────────────────────────────────
app.use(helmet())

// ── CORS ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: Origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Rate limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes.',
  },
})

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many login attempts, please try again in 15 minutes.',
  },
})

app.use('/api', limiter)
app.use('/api/auth/signin', authLimiter)
app.use('/api/auth/signup', authLimiter)

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── Request logging ────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LoanSunami API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/rates', rateRoutes)
app.use('/api/faqs', faqRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/calculators', calculatorRoutes)

// ── 404 + Error handlers ───────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start server ───────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 5000

const server = app.listen(PORT, () => {
  console.log(`\n🚀 LoanSunami API running on http://localhost:${PORT}/api`)
  console.log(`📌 Environment: ${process.env.NODE_ENV}`)
  console.log(`📚 Health check: http://localhost:${PORT}/api/health\n`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message)
  server.close(() => process.exit(1))
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message)
  process.exit(1)
})

export default app
