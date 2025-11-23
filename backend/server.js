import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- 1. API KEY LOAD BALANCER ---
// We store the keys in an array and rotate through them
const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY3
].filter(key => key); // Filter out undefined keys

console.log(apiKeys);
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
    console.log(`Using API Key Index: ${keyIndex} (Load Balancing)`);
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

app.listen(port, () => {
    console.log(`Legal Lens Backend running on http://localhost:${port}`);
});