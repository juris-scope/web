import mongoose from 'mongoose'

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { dbName: 'juriscope' })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
  }
}
