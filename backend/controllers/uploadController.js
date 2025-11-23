export async function handleUpload(req, res) {
  try {
    const language = req.body?.language || 'English'
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    // Placeholder: Future integration with models2 for analysis
    return res.json({
      message: 'File received',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      language,
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
