from __future__ import annotations

import logging
from typing import Any, Dict

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

# Local engines
import processing_engine as pe
import insight_engine as ie


# ----------------------------------------------------------------------------
# Flask app setup
# ----------------------------------------------------------------------------
# Note on environment variables:
# - If you want real LLM responses, set BLACKBOX_API_KEY in your environment.
#   On Windows (PowerShell):  $env:BLACKBOX_API_KEY = "sk-..."
#   On macOS/Linux (bash):     export BLACKBOX_API_KEY="sk-..."
# ----------------------------------------------------------------------------

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


@app.get("/health")
def health() -> Any:
    return jsonify({"status": "ok"}), 200


@app.get("/student/<int:student_id>")
def get_student(student_id: int) -> Any:
    """Summarize a student and generate insights in one call."""
    try:
        summary = pe.summarize_student(student_id)
        insights = ie.generate_insights(summary)
        return jsonify({"summary": summary, "insights": insights}), 200
    except Exception as e:
        logger.exception("/student/%s failed: %s", student_id, e)
        return jsonify({"error": "Internal Server Error"}), 500


@app.post("/generate_insights")
def generate_insights() -> Any:
    """Accepts a JSON body with student data and returns three insights.

    Expected body example:
    {
      "usn": "1RV22CS001",
      "attendance": {"AI": 88, "DBMS": 90, "CN": 75},
      "grades": {"AI": 9.0, "DBMS": 8.2, "CN": 7.5},
      "projects": ["AI Chatbot", "Smart Attendance"],
      "skills": ["Python", "React", "ML"]
    }
    """
    try:
        payload: Dict[str, Any] | None = request.get_json(silent=True)
        if not payload or not isinstance(payload, dict):
            return jsonify({"error": "Invalid JSON body"}), 400
        insights = ie.generate_insights(payload)
        # Return flattened insights: { academic, behavioral, career }
        return jsonify({
            "academic": insights.get("academic", ""),
            "behavioral": insights.get("behavioral", ""),
            "career": insights.get("career", ""),
        }), 200
    except Exception as e:
        logger.exception("/generate_insights failed: %s", e)
        return jsonify({"error": "Internal Server Error"}), 500


@app.post("/ask")
def ask_proxy() -> Any:
    """Proxy RAG questions to the ai_echo service (running on port 5001)."""
    try:
        payload = request.get_json(silent=True) or {}
        r = requests.post(
            "http://127.0.0.1:5001/ask",
            json=payload,
            timeout=25,
        )
        if r.status_code != 200:
            return jsonify({"error": "RAG service error", "status": r.status_code}), 502
        data = r.json() if r.headers.get('content-type', '').startswith('application/json') else {"answer": r.text}
        return jsonify(data), 200
    except requests.Timeout:
        return jsonify({"error": "RAG service timeout"}), 504
    except Exception as e:
        logger.exception("/ask proxy failed: %s", e)
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    # Run on port 5000 so frontend can call a single domain or via proxy
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)


