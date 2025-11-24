import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  device: String,
  location: String,
  ip: String,
  lastActive: Date
}, { _id: true })

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  jobTitle: String,
  organization: String,
  barNumber: String,
  experience: String,
  practiceAreas: [String],
  specialization: String,
  avatar: String,
  memberSince: { type: Date, default: Date.now },
  role: { type: String, default: 'Professional' },

  preferences: {
    analysisDepth: { type: String, default: 'standard' },
    autoSave: { type: Boolean, default: true },
    includeGemini: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
    colorScheme: { type: String, default: 'standard' },
    resultsLayout: { type: String, default: 'detailed' },
    itemsPerPage: { type: Number, default: 20 },
    exportFormat: { type: String, default: 'pdf-charts' },
    exportIncludes: { type: [String], default: ['summary','clauses','charts','recommendations','metadata'] },
    language: { type: String, default: 'en-US' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    timezone: { type: String, default: 'GMT+5:30' },
    currency: { type: String, default: 'INR' }
  },

  notifications: {
    email: { type: Boolean, default: true },
    weeklySummary: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
    educational: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },

  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  backupCodes: [String],
  sessions: [SessionSchema],

  statistics: {
    totalAnalyses: { type: Number, default: 0 },
    totalClauses: { type: Number, default: 0 },
    highRiskAlerts: { type: Number, default: 0 },
    lastActive: Date
  }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
