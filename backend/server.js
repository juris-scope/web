import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// This explicitly allows all domains for CORS
app.use(cors({ origin: '*' }));
app.use(express.json());
// Static uploads for avatars
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Optional DB connection if MONGO_URI provided
if (process.env.MONGO_URI) {
    connectDB(process.env.MONGO_URI)
}

// --- 1. API KEY LOAD BALANCER ---
// We store the keys in an array and rotate through them
const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY3
].filter(key => key); // Filter out undefined keys

console.log(`Gemini keys loaded: ${apiKeys.length}`);
if (apiKeys.length === 0) {
    console.error("Error: No API Keys found in .env file");
    process.exit(1);
}

let keyIndex = 0;

// Function to get the next key in the rotation (Round-Robin)
const getNextGeminiClient = () => {
    const key = apiKeys[keyIndex];
    // Move index to next, loop back to 0 if at end
    keyIndex = (keyIndex + 1) % apiKeys.length;
    // Masked log of key rotation (no key value)
    console.log(`Using Gemini key #${keyIndex + 1}/${apiKeys.length}`);
    return new GoogleGenerativeAI(key);
};

// --- 2. SCORING LOGIC ---
const calculateRiskScore = (clauses) => {
    if (!clauses || clauses.length === 0) return 0;

    const weights = {
        'Low': 1,
        'Medium': 3,
        'High': 5,
        'Unavoidable': 7
    };

    let totalWeight = 0;
    let hasUnavoidable = false;
    let anomalySum = 0;

    clauses.forEach(clause => {
        // Normalize risk level string case
        const risk = clause.risk_level || 'Low';
        const weight = weights[risk] || 1; // Default to 1 if unknown
        
        totalWeight += weight;
        anomalySum += (clause.anomaly_score || 0);

        if (risk === 'Unavoidable') {
            hasUnavoidable = true;
        }
    });

    // Calculate raw average (Max weight is 7)
    // Formula: (Sum of weights) / (Number of clauses * Max Weight)
    let normalizedRisk = totalWeight / (clauses.length * 7);

    // Logic: If Unavoidable risk exists, score MUST be > 0.9
    if (hasUnavoidable) {
        normalizedRisk = Math.max(normalizedRisk, 0.91); 
    }

    // Composite score (inverse of risk, just for "Health" metric)
    const compositeScore = 1 - normalizedRisk;

    return {
        contract_risk_score: parseFloat(normalizedRisk.toFixed(2)),
        composite_score: parseFloat(compositeScore.toFixed(2)),
        avg_anomaly: parseFloat((anomalySum / clauses.length).toFixed(2))
    };
};

// --- 3. ANALYZE ENDPOINT ---
app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Get client (rotates key)
        const genAI = getNextGeminiClient();
        // Use the Flash model for speed and cost-efficiency
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        You are a legal contract analyzer. 
        1. Split the following contract text into separate logical clauses.
        2. For each clause, identify its type from this list: [Consideration & Payment, Confidentiality, Indemnification & Liability, Dispute Resolution & Jurisdiction, Term & Termination]. If it doesn't fit perfectly, choose the closest one.
        3. Analyze the risk of the clause. Assign a "risk_level" of exactly one of these values: "Low", "Medium", "High", "Unavoidable".
           - Low: Standard standard.
           - Medium: Slightly biased against one party.
           - High: Heavily biased or dangerous.
           - Unavoidable: Critical deal-breaker or illegal term.
        4. Assign an "anomaly_score" between 0.0 (standard) and 1.0 (highly unusual).
        5. DO NOT provide suggestions.
        6. Give the score in 2 decimal places.

        Return ONLY a JSON object with this structure:
        {
            "clauses": [
                {
                    "text": "exact text of the clause",
                    "clause_type": "Type",
                    "risk_level": "Low/Medium/High/Unavoidable",
                    "anomaly_score": 0.5
                }
            ]
        }

        Contract Text to Analyze:
        ${text}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonResponse = JSON.parse(responseText);

        // --- 4. POST PROCESSING ---
        // We do the mapping and math here in Node.js
        const processedClauses = jsonResponse.clauses.map(c => ({
            text: c.text,
            clause_type: c.clause_type,
            risk_band: `${c.risk_level} Risk`, // Format for Frontend
            anomaly_score: c.anomaly_score,
            improvement_suggestion: "N/A" // Explicitly removed as requested
        }));

        const summary = calculateRiskScore(jsonResponse.clauses);

        res.json({
            clauses: processedClauses,
            summary: summary
        });

    } catch (error) {
        console.error('Error processing contract:', error);
        res.status(500).json({ error: 'Analysis failed. Please try again.' });
    }
});

// --- 3. NEW: IMPROVE CLAUSE ENDPOINT ---
app.post('/improve-clause', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'No text provided' });

        const genAI = getNextGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are an expert legal editor. 
        Refine the following contract clause to be more legally compliant, professional, and robust. 
        Protect the interests of the party drafting it, but remain fair.
        Remove ambiguities.

        Original Text: "${text}"

        Return ONLY the improved text. Do not add conversational filler.
        `;

        const result = await model.generateContent(prompt);
        const improvedText = result.response.text().trim();

        res.json({ improved_text: improvedText });

    } catch (error) {
        console.error('Improvement failed:', error);
        res.status(500).json({ error: 'Improvement failed' });
    }
});

// --- 4. NEW: GENERATE DRAFT OPTIONS ENDPOINT ---
app.post('/generate-clause', async (req, res) => {
    try {
        const { prompt: userPrompt } = req.body;
        if (!userPrompt) return res.status(400).json({ error: 'No prompt provided' });

        const genAI = getNextGeminiClient();
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        You are a senior legal counsel. The user wants a clause drafted based on this requirement: "${userPrompt}".
        
        Generate TWO distinct variations of this clause:
        1. Option A: Aggressive/Protective (Strongly favors the drafter).
        2. Option B: Balanced/Neutral (Standard industry terms, fair to both).

        Return JSON format:
        {
            "option_a": { "title": "Protective Approach", "text": "..." },
            "option_b": { "title": "Balanced Approach", "text": "..." }
        }
        `;

        const result = await model.generateContent(prompt);
        const jsonResponse = JSON.parse(result.response.text());

        res.json(jsonResponse);

    } catch (error) {
        console.error('Drafting failed:', error);
        res.status(500).json({ error: 'Drafting failed' });
    }
});

// --- 5. NEW: DOCUMENT ANALYSIS ENDPOINT (Multi-block) ---
// Input: { blocks: ["clause text", ...] }
// Output: {
//   overall_analysis: string,
//   block_analyses: [string,...], // same length/order as input blocks
//   suggestions: [string,...]     // actionable drafting/improvement prompts
// }
app.post('/analyze-document', async (req, res) => {
    try {
        const { blocks } = req.body;

        if (!Array.isArray(blocks) || blocks.length === 0) {
            return res.status(400).json({ error: 'Blocks array required' });
        }

        const genAI = getNextGeminiClient();
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: 'application/json' }
        });

        // Build numbered list for clarity in prompt
        const numberedClauses = blocks.map((b, i) => `${i + 1}. ${b}`).join('\n');

        const prompt = `You are an expert commercial contracts analyst.\n` +
            `Analyze the following numbered clauses and produce ONLY valid JSON with this schema:\n` +
            `{\n  "overall_analysis": "Concise paragraph (<= 3 sentences) summarizing key risk themes, balance, and notable issues.",\n  "block_analyses": ["For clause 1: 1-2 sentence critical risk/opportunity assessment.", "For clause 2: ..."],\n  "suggestions": ["Concise actionable drafting prompt 1", "Prompt 2", "Prompt 3"]\n}` +
            `\nRules:\n` +
            `- block_analyses LENGTH must equal number of clauses (exact order).\n` +
            `- suggestions: 3-6 items; each a short imperative prompt (e.g., "Add limitation of liability cap").\n` +
            `- Do not include explanatory text outside JSON.\n` +
            `Clauses:\n${numberedClauses}`;

        let jsonResponse;
        try {
            const result = await model.generateContent(prompt);
            const raw = result.response.text();
            jsonResponse = JSON.parse(raw);
        } catch (modelErr) {
            console.warn('Gemini document analysis failed, falling back:', modelErr);
            // Fallback heuristic analysis
            const blockAnalyses = blocks.map((text, idx) => {
                const length = text.length;
                let note = 'Standard clause.';
                if (length > 800) note = 'Long clause; consider splitting for clarity.';
                if (/indemnif/i.test(text)) note = 'Indemnity detected; ensure scope and caps are balanced.';
                if (/terminat/i.test(text)) note = 'Termination language; verify notice periods and cure rights.';
                if (/confidential/i.test(text)) note = 'Confidentiality clause; check exceptions & duration.';
                return `Clause ${idx + 1}: ${note}`;
            });
            jsonResponse = {
                overall_analysis: 'Heuristic summary: Mixed standard clauses with typical commercial themes. Manual AI analysis unavailable; review indemnity and termination for balance.',
                block_analyses: blockAnalyses,
                suggestions: [
                    'Add liability cap clause',
                    'Clarify termination cure period',
                    'Enhance confidentiality exceptions',
                    'Insert dispute resolution jurisdiction',
                    'Consider data protection addendum'
                ]
            };
        }

        // Basic validation & normalization
        if (!Array.isArray(jsonResponse.block_analyses) || jsonResponse.block_analyses.length !== blocks.length) {
            // Repair if lengths mismatch
            jsonResponse.block_analyses = blocks.map((b, i) => jsonResponse.block_analyses[i] || `Clause ${i + 1}: Review required.`);
        }
        if (!Array.isArray(jsonResponse.suggestions)) {
            jsonResponse.suggestions = [];
        }
        res.json({
            overall_analysis: jsonResponse.overall_analysis || 'Analysis unavailable.',
            block_analyses: jsonResponse.block_analyses,
            suggestions: jsonResponse.suggestions.slice(0, 8)
        });
    } catch (error) {
        console.error('Document analysis endpoint error:', error);
        res.status(500).json({ error: 'Document analysis failed.' });
    }
});

// --- User Profile & Settings Routes ---
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Legal Drafting Backend running on http://localhost:${port}`);
});
