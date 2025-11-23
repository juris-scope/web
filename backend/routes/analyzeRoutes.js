import express from 'express'
import { analyzeClause, analyzeRisk, analyzeAnomaly } from '../controllers/analyzeController.js'

const router = express.Router()

router.post('/clause', analyzeClause)
router.post('/risk', analyzeRisk)
router.post('/anomaly', analyzeAnomaly)

export default router
