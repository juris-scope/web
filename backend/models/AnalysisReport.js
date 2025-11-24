import mongoose from 'mongoose'

const AnalysisReportSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', index: true },
  summary: String,
  clausesAnalyzed: { type: Number, default: 0 },
  modelVersion: { type: String, default: 'gemini-2.0-flash' },
  recommendations: [String],
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.AnalysisReport || mongoose.model('AnalysisReport', AnalysisReportSchema)
