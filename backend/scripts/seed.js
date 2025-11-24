import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Contract from '../models/Contract.js'
import Clause from '../models/Clause.js'
import RiskAssessment from '../models/RiskAssessment.js'
import AnalysisReport from '../models/AnalysisReport.js'

dotenv.config()

async function run() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('Missing MONGO_URI in .env')
    process.exit(1)
  }

  await connectDB(uri)

  try {
    console.log('Clearing existing documents...')
    await Promise.all([
      Contract.deleteMany({}),
      Clause.deleteMany({}),
      RiskAssessment.deleteMany({}),
      AnalysisReport.deleteMany({})
    ])

    // --- Contracts ---
    const contracts = await Contract.insertMany([
      { title: 'MSA - Acme x Globex', filename: 'msa_acme_globex.pdf', parties: ['Acme Corp', 'Globex LLC'], status: 'analyzed', tags: ['MSA','SaaS'], summary: 'Master Service Agreement for SaaS subscription.' },
      { title: 'NDA - Contoso', filename: 'nda_contoso.pdf', parties: ['Juriscope', 'Contoso Ltd'], status: 'uploaded', tags: ['NDA'], summary: 'Mutual NDA for preliminary talks.' },
      { title: 'SOW - Data Migration', filename: 'sow_data_migration.pdf', parties: ['Acme Corp', 'Initech'], status: 'analyzed', tags: ['SOW','Services'], summary: 'Scope for data migration project.' },
      { title: 'DPA - Privacy Addendum', filename: 'dpa_privacy_addendum.pdf', parties: ['Umbrella Inc', 'Wayne Tech'], status: 'analyzed', tags: ['DPA','Privacy'], summary: 'Data Processing Addendum under GDPR.' },
      { title: 'Supplier Agreement', filename: 'supplier_agreement.pdf', parties: ['Stark Industries', 'Pied Piper'], status: 'archived', tags: ['Supply'], summary: 'Supplier terms for hardware components.' }
    ])

    // Helper to pick a random contract id
    const pickContract = () => contracts[Math.floor(Math.random()*contracts.length)]._id

    // --- Clauses ---
    await Clause.insertMany([
      { contract: pickContract(), label: 'Confidentiality', clauseType: 'Confidentiality', riskLevel: 'Low', anomalyScore: 0.12, text: 'Each party shall keep confidential information confidential for 5 years.' },
      { contract: pickContract(), label: 'Indemnification', clauseType: 'Indemnification & Liability', riskLevel: 'High', anomalyScore: 0.73, text: 'Supplier shall indemnify Customer for third-party IP claims without cap.' },
      { contract: pickContract(), label: 'Payment Terms', clauseType: 'Consideration & Payment', riskLevel: 'Medium', anomalyScore: 0.28, text: 'Net 45 payment terms; late fee at 1.5% per month.' },
      { contract: pickContract(), label: 'Termination for Convenience', clauseType: 'Term & Termination', riskLevel: 'Medium', anomalyScore: 0.35, text: 'Either party may terminate for convenience with 30 days notice.' },
      { contract: pickContract(), label: 'Dispute Resolution', clauseType: 'Dispute Resolution & Jurisdiction', riskLevel: 'Low', anomalyScore: 0.18, text: 'Disputes shall be resolved by arbitration in Singapore.' }
    ])

    // --- Risk Assessments ---
    await RiskAssessment.insertMany([
      { contract: contracts[0]._id, overallScore: 0.31, lowCount: 3, mediumCount: 1, highCount: 0, unavoidableCount: 0, anomaliesCount: 2 },
      { contract: contracts[1]._id, overallScore: 0.12, lowCount: 4, mediumCount: 0, highCount: 0, unavoidableCount: 0, anomaliesCount: 1 },
      { contract: contracts[2]._id, overallScore: 0.55, lowCount: 1, mediumCount: 2, highCount: 1, unavoidableCount: 0, anomaliesCount: 3 },
      { contract: contracts[3]._id, overallScore: 0.42, lowCount: 2, mediumCount: 2, highCount: 0, unavoidableCount: 0, anomaliesCount: 2 },
      { contract: contracts[4]._id, overallScore: 0.68, lowCount: 0, mediumCount: 2, highCount: 2, unavoidableCount: 0, anomaliesCount: 4 }
    ])

    // --- Analysis Reports ---
    await AnalysisReport.insertMany([
      { contract: contracts[0]._id, summary: 'Balanced MSA with low risk profile.', clausesAnalyzed: 18, modelVersion: 'gemini-2.0-flash', recommendations: ['Add liability cap','Clarify SLA remedies'] },
      { contract: contracts[1]._id, summary: 'Standard mutual NDA with narrow exceptions.', clausesAnalyzed: 8, modelVersion: 'gemini-2.0-flash', recommendations: ['Define residuals','Confirm survival period'] },
      { contract: contracts[2]._id, summary: 'SOW exposes delivery risk; tighten acceptance.', clausesAnalyzed: 12, modelVersion: 'gemini-2.0-flash', recommendations: ['Add acceptance criteria','Milestone-based payments'] },
      { contract: contracts[3]._id, summary: 'DPA aligns with GDPR; add breach timing.', clausesAnalyzed: 10, modelVersion: 'gemini-2.0-flash', recommendations: ['24h breach notice','Subprocessor list update cadence'] },
      { contract: contracts[4]._id, summary: 'Supplier agreement with high liability exposure.', clausesAnalyzed: 15, modelVersion: 'gemini-2.0-flash', recommendations: ['Introduce cap at 12x fees','Exclusions for indirect loss'] }
    ])

    console.log('Seeding complete ✅')
  } catch (err) {
    console.error('Seed failed:', err)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

run()
