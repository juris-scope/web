import { GoogleGenerativeAI } from '@google/generative-ai'

let geminiModel = null
let initialized = false

export function getGeminiModel() {
  if (initialized) return geminiModel
  initialized = true
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  try {
    const genAI = new GoogleGenerativeAI(key)
    // Using light-weight flash model; can switch to gemini-1.5-pro for deeper reasoning later
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  } catch (e) {
    console.error('Gemini init error:', e.message)
    geminiModel = null
  }
  return geminiModel
}

export async function generateClauseSuggestion({ textSnippet, predictedType, riskBand, language }) {
  const model = getGeminiModel()
  if (!model) return null
  const prompt = `You are an expert contract analyst. Improve the following clause.
Clause Type: ${predictedType}
Language: ${language}
Risk Band: ${riskBand}
Clause Text: "${textSnippet}"
Provide ONE concise sentence suggesting a professional improvement focused on risk mitigation and clarity. Do not include prefaces.`
  try {
    const result = await model.generateContent(prompt)
    const suggestion = result.response?.text()?.trim() || null
    return suggestion
  } catch (e) {
    console.error('Gemini suggestion error:', e.message)
    return null
  }
}
