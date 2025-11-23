import fs from 'fs'
import path from 'path'

// Lazy loaders so server can start even if optional parsers missing
let pdfParse = null
let mammoth = null
try { pdfParse = (await import('pdf-parse')).default } catch {}
try { mammoth = await import('mammoth') } catch {}

export async function handleUpload(req, res) {
  try {
    const language = req.body?.language || 'English'
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const filePath = path.resolve('uploads', req.file.filename)
    const ext = path.extname(req.file.originalname).toLowerCase()
    let extractedText = ''

    if (ext === '.txt') {
      extractedText = fs.readFileSync(filePath, 'utf-8')
    } else if (ext === '.pdf') {
      if (pdfParse) {
        const data = await pdfParse(fs.readFileSync(filePath))
        extractedText = data.text || ''
      } else {
        extractedText = '(PDF parser not installed)'
      }
    } else if (ext === '.docx') {
      if (mammoth) {
        const result = await mammoth.extractRawText({ path: filePath })
        extractedText = result.value || ''
      } else {
        extractedText = '(DOCX parser not installed)'
      }
    } else {
      extractedText = '(Unsupported format)'
    }

    // Trim extremely large text for initial analysis stage (frontend can warn)
    const MAX_CHARS = 100000
    if (extractedText.length > MAX_CHARS) {
      extractedText = extractedText.slice(0, MAX_CHARS)
    }

    return res.json({
      message: 'File received',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      language,
      text: extractedText,
      next: {
        clause: '/api/analyze/clause',
        risk: '/api/analyze/risk',
        anomaly: '/api/analyze/anomaly'
      }
    })
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Upload error' })
  }
}
