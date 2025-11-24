import mongoose from 'mongoose'

const ContractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parties: [String],
  effectiveDate: Date,
  expirationDate: Date,
  status: { type: String, enum: ['uploaded', 'analyzed', 'archived'], default: 'uploaded' },
  tags: [String],
  size: Number,
  mimeType: String,
  summary: String
}, { timestamps: true })

export default mongoose.models.Contract || mongoose.model('Contract', ContractSchema)
