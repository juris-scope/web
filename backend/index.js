import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3000;
// Point this to where your Python Flask app is running
const PY_BACKEND_URL = process.env.PY_BACKEND_URL || 'http://localhost:8000';

// --- Middleware ---
app.use(cors()); // Allow frontend to talk to this backend
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies (increased limit for large contracts)

// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// --- Helper Function ---
// Forwards requests from Node -> Python -> Node
async function forwardToPython(path, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000000); // 60 second timeout for heavy ML models
  
  try {
    console.log(`[Node] Forwarding to Python: ${PY_BACKEND_URL}${path}`);
    const resp = await fetch(`${PY_BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await resp.json().catch(() => ({}));
    
    if (!resp.ok) {
      const msg = data?.detail || `Python backend error (${resp.status})`;
      throw new Error(msg);
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Python analysis timed out (60s limit).');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// --- Routes ---

// 1. Full Analysis Endpoint (The main one used by Frontend)
app.post('/analyze', async (req, res) => {
  console.log("Reached here")
  const { language = 'English', text = '' } = req.body || {};
  
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    // Calls the /api/analyze/full endpoint in Python
    const data = await forwardToPython('/api/analyze/full', { language, text });
    res.json(data);
  } catch (e) {
    console.error("Python Bridge Error:", e.message);
    res.status(502).json({ error: String(e.message), source: 'python-bridge' });
  }
});

// 2. Individual Clause Classification
app.post('/api/analyze/clauses', async (req, res) => {
  const { text = '' } = req.body || {};
  try {
    const data = await forwardToPython('/api/analyze/clauses', { text });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// 3. Individual Risk Scoring
app.post('/api/analyze/risk', async (req, res) => {
  const { text = '' } = req.body || {};
  try {
    const data = await forwardToPython('/api/analyze/risk', { text });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// 4. Individual Anomaly Detection
app.post('/api/analyze/anomaly', async (req, res) => {
  const { text = '' } = req.body || {};
  try {
    const data = await forwardToPython('/api/analyze/anomaly', { text });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`\n🚀 Node.js Server running on http://localhost:${PORT}`);
  console.log(`🔗 Connected to Python Backend at ${PY_BACKEND_URL}`);
});

// Upload route (RESTores /api/upload expected by frontend)
app.use('/api/upload', uploadRoutes);