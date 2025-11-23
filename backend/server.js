import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import uploadRoutes from './routes/uploadRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import analyzeRoutes from './routes/analyzeRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin }))

// Middleware
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

// DB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/juriscope'
connectDB(mongoUri)

// Routes
app.use('/api/upload', uploadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/analyze', analyzeRoutes)

app.get('/', (req,res)=>{
  res.json({ name: 'JuriScope API', status: 'ok' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`JuriScope backend running on http://localhost:${PORT}`)
})
