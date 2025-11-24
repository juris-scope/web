import mongoose from 'mongoose'

const RiskAssessmentSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', index: true },
  overallScore: { type: Number, min: 0, max: 1, default: 0 },
  lowCount: { type: Number, default: 0 },
  mediumCount: { type: Number, default: 0 },
  highCount: { type: Number, default: 0 },
  unavoidableCount: { type: Number, default: 0 },
  anomaliesCount: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.RiskAssessment || mongoose.model('RiskAssessment', RiskAssessmentSchema)
