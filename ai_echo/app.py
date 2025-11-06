from __future__ import annotations

import concurrent.futures
import logging
from typing import Any, Dict

from flask import Flask, request, jsonify
from flask_cors import CORS

from rag_engine import query_rag


# Basic Flask app with wide-open CORS for local dev/frontends
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# Small worker pool to enforce per-request timeouts on RAG calls
_pool = concurrent.futures.ThreadPoolExecutor(max_workers=4)
_RAG_TIMEOUT_SECONDS = 20


@app.get("/health")
def health() -> Any:
    """Lightweight health check."""
    return jsonify({"status": "ok"}), 200


@app.post("/ask")
def ask() -> Any:
    """Accepts JSON {"query": "..."} and returns RAG result.

    Applies a small timeout so slow LLMs don't block the server indefinitely.
    """
    try:
        payload: Dict[str, Any] | None = request.get_json(silent=True)
        if not payload or not isinstance(payload.get("query"), str):
            return jsonify({"error": "Invalid payload. Expect JSON {\"query\": string}."}), 400

        query = payload["query"].strip()
        if not query:
            return jsonify({"error": "Query must be a non-empty string."}), 400

        # Run the RAG pipeline with timeout protection
        future = _pool.submit(query_rag, query)
        try:
            result = future.result(timeout=_RAG_TIMEOUT_SECONDS)
        except concurrent.futures.TimeoutError:
            logger.warning("RAG query timed out after %ss", _RAG_TIMEOUT_SECONDS)
            return jsonify({"error": "RAG query timed out. Please try again."}), 504

        # Ensure expected response shape
        context = result.get("context", "") if isinstance(result, dict) else ""
        answer = result.get("answer", "") if isinstance(result, dict) else ""
        return jsonify({"context": context, "answer": answer}), 200

    except Exception as e:  # Defensive catch-all to avoid 500 traces leaking
        logger.exception("/ask failed: %s", e)
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    # Run Flask app on port 5001 for local development
    app.run(host="0.0.0.0", port=5001, debug=False, threaded=True)


