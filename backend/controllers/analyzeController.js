import fetch from 'node-fetch'; // Ensure you have "type": "module" in package.json or use import('node-fetch') wrapper

// Default to port 8000 as defined in the Python app
const PY_BACKEND_URL = process.env.PY_BACKEND_URL || 'http://localhost:8000';

// Helper to handle the request forwarding
async function forwardToPython(path, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout for ML models
  
  try {
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
    // Handle abort error specifically if needed
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// 1. Full Pipeline Analysis (Most efficient: calls Python once)
export async function analyzeMock(req, res) {
  const { language = 'English', text = '' } = req.body || {};
  try {
    // Maps to the @app.route('/api/analyze/full') in Python
    const data = await forwardToPython('/api/analyze/full', { language, text });
    res.json(data);
  } catch (e) {
    console.error("Python Bridge Error:", e);
    res.status(502).json({ error: String(e?.message || e), source: 'python-bridge' });
  }
}

// 2. Individual Clause Classification
export async function analyzeClause(req, res) {
  const { text = '' } = req.body || {};
  try {
    const data = await forwardToPython('/api/analyze/clauses', { text });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: String(e?.message || e) });
  }
}

// 3. Individual Risk Scoring
export async function analyzeRisk(req, res) {
  const { text = '' } = req.body || {};
  try {
    const data = await forwardToPython('/api/analyze/risk', { text });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: String(e?.message || e) });
  }
}

// 4. Individual Anomaly Detection
export async function analyzeAnomaly(req, res) {
  const { text = '' } = req.body || {};
  try {
    const data = await forwardToPython('/api/analyze/anomaly', { text });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: String(e?.message || e) });
  }
}