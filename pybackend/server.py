import os
import re
import json
import time 
import numpy as np
import torch
import traceback
import google.generativeai as genai
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModel
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask App
app = Flask(__name__)

# --- A. Configuration & Device Setup ---
gpu_device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Main Acceleration: {gpu_device}")

# PATH CONFIGURATION
BASE_MODEL_CHECKPOINT = "nlpaueb/legal-bert-base-uncased"
CLAUSE_MODEL_PATH = "./models2/clause_models" 
RISK_MODEL_PATH = "./models2/risk_models"

# --- Gemini Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
gemini_model = None

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        print("✅ Gemini Configured.")
    except Exception as e:
        print(f"⚠️ Gemini configuration error: {e}")
else:
    print("⚠️ No GEMINI_API_KEY found. Generative features disabled.")

# --- B. Smart Model Loading Helper ---

def load_model_smart(path_list, base_fallback, num_labels=2, model_type="classifier"):
    model = None
    tokenizer = None
    
    # 1. Try Loading from Local Paths
    for path in path_list:
        if not os.path.exists(path): continue
        
        # Check for actual weight files
        files = os.listdir(path) if os.path.isdir(path) else []
        has_weights = any(f in files for f in ['pytorch_model.bin', 'model.safetensors', 'tf_model.h5'])
        
        if not has_weights:
            print(f"   ⚠️ Found folder {path} but MISSING WEIGHTS.")
            continue

        try:
            print(f"   🔄 Attempting load from: {path}")
            tokenizer = AutoTokenizer.from_pretrained(path, local_files_only=True)
            if model_type == "classifier":
                model = AutoModelForSequenceClassification.from_pretrained(path, local_files_only=True).to(gpu_device).eval()
            else:
                model = AutoModel.from_pretrained(path, local_files_only=True).to(gpu_device).eval()
            print(f"   ✅ Success! Loaded from: {path}")
            break
        except Exception as e:
            print(f"   ❌ Failed loading from {path}: {str(e)[:100]}...")

    # 2. Fallback to Base Model
    if model is None:
        print(f"   ⚠️ LOCAL MODELS FAILED. Falling back to base: {base_fallback}")
        try:
            tokenizer = AutoTokenizer.from_pretrained(base_fallback)
            if model_type == "classifier":
                model = AutoModelForSequenceClassification.from_pretrained(base_fallback, num_labels=num_labels).to(gpu_device).eval()
            else:
                model = AutoModel.from_pretrained(base_fallback).to(gpu_device).eval()
            print(f"   ✅ FALLBACK ACTIVE: Using {base_fallback}")
        except Exception as e:
            print(f"   ❌ FATAL: Could not load fallback model: {e}")
    
    return tokenizer, model

# --- C. Load Models ---

# 1. Clause Classification
print("\n--- Loading Clause Model ---")
clause_id2label = {0: "Unknown"}
try:
    label_path = f'{CLAUSE_MODEL_PATH}/clause_labels.json'
    if os.path.exists(label_path):
        with open(label_path, 'r') as f:
            data = json.load(f)
            clause_id2label = {int(k): v for k, v in data.get('id2label', data).items()}
        print(f"   Labels loaded: {len(clause_id2label)}")
except:
    print("   ⚠️ Label file issue.")

clause_tokenizer, model_clause = load_model_smart(
    [f"{CLAUSE_MODEL_PATH}/clause_model", CLAUSE_MODEL_PATH], 
    BASE_MODEL_CHECKPOINT, 
    num_labels=len(clause_id2label)
)

# 2. Risk Scoring
print("\n--- Loading Risk Model ---")
RISK_WEIGHTS = {
    "Uncapped Liability": 0.9, "Cap on Liability": 0.4, "Indemnity": 0.8,
    "Termination for Convenience": 0.5, "Confidentiality": 0.6,
    "Governing Law": 0.2, "Effective Date": 0.1
}
SAMPLE_CATEGORIES = list(RISK_WEIGHTS.keys())

risk_tokenizer, infer_model = load_model_smart(
    [RISK_MODEL_PATH, f"{RISK_MODEL_PATH}/risk_model"], 
    BASE_MODEL_CHECKPOINT, 
    num_labels=len(RISK_WEIGHTS)
)

# 3. Anomaly Detection
print("\n--- Loading Embedding Model ---")
model_embedding = None
baseline_embs = None

try:
    # Use Clause Tokenizer for embeddings to save memory/complexity
    model_embedding = AutoModel.from_pretrained(BASE_MODEL_CHECKPOINT).to(gpu_device).eval()
    
    baseline_texts = [
        'The Parties shall keep confidential information in strict confidence.',
        'Each party will indemnify the other for losses arising from breach.',
        'This agreement is governed by the laws of India.'
    ]
    
    def get_paragraph_embeddings(texts):
        if not clause_tokenizer: 
            return np.zeros((len(texts), 768)) # Fallback if tokenizer failed
        
        inputs = clause_tokenizer(texts, padding=True, truncation=True, return_tensors='pt', max_length=512).to(gpu_device)
        with torch.no_grad():
            outputs = model_embedding(**inputs)
        return outputs.last_hidden_state.mean(dim=1).cpu().numpy()

    baseline_embs = get_paragraph_embeddings(baseline_texts)
    print(f"✅ Anomaly Baseline Ready. Shape: {baseline_embs.shape}")

except Exception as e:
    print(f"⚠️ Embedding Model Issue: {e}")
    traceback.print_exc() 


# --- D. Analysis Logic ---

def split_text(text):
    if not text: return []
    clauses = re.split(r'\n\s*([0-9]+[\.\)]\s+)|(\n\s*\n+)', text)
    clean = []
    curr = ""
    for p in clauses:
        if not p: continue
        p = p.strip()
        if re.match(r'^[0-9]+[\.\)]$', p): curr = p
        elif len(p.split()) > 3:
            clean.append(f"{curr} {p}" if curr else p)
            curr = ""
    return clean

def classify_clause(text):
    if model_clause is None: return "N/A"
    try:
        inputs = clause_tokenizer(text, return_tensors="pt", truncation=True, max_length=256).to(gpu_device)
        with torch.no_grad():
            logits = model_clause(**inputs).logits
        pred_idx = torch.argmax(logits, dim=1).item()
        return clause_id2label.get(pred_idx, f"Type_{pred_idx}")
    except Exception as e:
        print(f"Classify Error: {e}")
        return "Error"

def score_risk(text):
    if infer_model is None: return {"risk_score": 0.0, "risk_band": "N/A"}
    try:
        inputs = risk_tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=256).to(gpu_device)
        with torch.no_grad():
            logits = infer_model(**inputs).logits
        probs = torch.sigmoid(logits).cpu().numpy()[0]
        
        result = {"category": "General", "risk_score": 0.0, "risk_band": "Low Risk"}
        max_risk = 0.0

        for i, cat in enumerate(SAMPLE_CATEGORIES):
            if i >= len(probs): break
            score = float(probs[i]) * RISK_WEIGHTS.get(cat, 0.0)
            if score > max_risk:
                max_risk = score
                band = "High Risk" if score >= 0.7 else "Moderate Risk" if score >= 0.4 else "Low Risk"
                result = {"category": cat, "risk_score": score, "risk_band": band}
        return result
    except Exception as e:
        print(f"Risk Error: {e}")
        return {"category": "Error", "risk_score": 0.0, "risk_band": "Error"}

def calculate_anomaly(text):
    # 1. Check if models exist
    if model_embedding is None:
        print("Anomaly Skipped: model_embedding is None")
        return 0.0
    if baseline_embs is None:
        print("Anomaly Skipped: baseline_embs is None")
        return 0.0

    try:
        # 2. Tokenize Input
        inputs = clause_tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=256).to(gpu_device)
        
        # 3. Get Embedding
        with torch.no_grad():
            outputs = model_embedding(**inputs)
        
        emb = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
        
        # 4. Compute Similarity
        sim = cosine_similarity(emb, baseline_embs).max()
        
        # 5. Return Anomaly Score (Inverse of Similarity)
        return float(1.0 - sim)

    except Exception as e:
        # PRINT THE ERROR so you can see it in terminal
        print(f"❌ Anomaly Calculation Error: {e}")
        return 0.0

def gemini_analysis(text, c_type, risk_band):
    if not gemini_model: return "N/A"
    try:
        # Enhanced Prompt for one-clause-at-a-time context
        prompt = f"""
        Act as a legal expert reviewing this single contract clause.
        
        Clause: "{text}"
        Context: Classified as '{c_type}' with '{risk_band}' rating.
        
        Task: Provide ONE specific, concise suggestion to improve clarity or mitigate risk. 
        If the clause is standard and safe, strictly output "Standard clause, no changes needed."
        """
        resp = gemini_model.generate_content(prompt)
        return resp.text.strip()
    except Exception as e:
        print(f"      [Gemini Error] {e}")
        return "AI analysis unavailable"

def get_summary(risks):
    scores = [r['risk_score'] for r in risks if isinstance(r.get('risk_score'), float)]
    if not scores: return {'composite_score': 0, 'contract_risk_score': 0}
    avg_risk = np.mean(scores)
    return {"contract_risk_score": float(avg_risk), "composite_score": float(1.0 - avg_risk)}

# --- E. Routes ---

@app.route('/api/analyze/full', methods=['POST'])
def analyze_full():
    try:
        data = request.get_json()
        text = data.get('text', '')
        clauses = split_text(text)
        print(f"\nProcessing {len(clauses)} clauses...")

        results = []
        risks = []

        for i, c in enumerate(clauses):
            print(f"   Clause {i+1}...", end=" ", flush=True)
            
            # STEP 1: CLAUSE
            ctype = classify_clause(c)
            
            # STEP 2: RISK
            risk = score_risk(c)
            
            # STEP 3: ANOMALY
            anom = calculate_anomaly(c)
            
            # STEP 4: GEMINI (With Rate Limit Protection)
            # We process this one by one in the loop
            gem = "N/A"
            if gemini_model:
                time.sleep(1.0) # Pause 1s to respect rate limits
                gem = gemini_analysis(c, ctype, risk['risk_band'])
            
            print(f"[C:{ctype[:10]}] [R:{risk['risk_score']:.2f}] [A:{anom:.2f}] [AI: {gem[:20]}...]")

            results.append({
                "text": c,
                "clause_type": ctype,
                "risk_score": risk['risk_score'],
                "risk_band": risk['risk_band'],
                "anomaly_score": anom,
                "improvement_suggestion": gem
            })
            risks.append(risk)

        return jsonify({"clauses": results, "summary": get_summary(risks)})

    except Exception as e:
        print(f"❌ Server Error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)