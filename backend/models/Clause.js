import mongoose from 'mongoose'

const ClauseSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', index: true },
  label: String,
  clauseType: { type: String },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Unavoidable'], default: 'Low' },
  anomalyScore: { type: Number, min: 0, max: 1, default: 0 },
  startIndex: Number,
  endIndex: Number,
  text: String
}, { timestamps: true })

export default mongoose.models.Clause || mongoose.model('Clause', ClauseSchema)
