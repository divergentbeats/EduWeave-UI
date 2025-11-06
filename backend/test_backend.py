from __future__ import annotations

import json

from app import app


def pretty(obj):
    try:
        return json.dumps(obj, indent=2, ensure_ascii=False)
    except Exception:
        return str(obj)


def run_tests() -> None:
    print("Starting backend tests with Flask test client...\n")
    with app.test_client() as client:
        # 1) Health check
        h = client.get("/health")
        print("[Health] status:", h.status_code)
        try:
            print(pretty(h.get_json()))
        except Exception:
            print(h.data.decode("utf-8", errors="ignore"))
        print()

        # 2) Generate insights with example payload
        example_payload = {
            "student": {"student_id": 1, "name": "Test User"},
            "avg_grade": 8.2,
            "avg_attendance": 87.5,
            "subject_details": {"AI": 9.0, "DBMS": 8.0},
            "attendance_details": {"AI": 90, "DBMS": 85},
            "projects": [{"name": "Chatbot", "tags": ["NLP", "Flask"]}],
            "tags": ["NLP", "Flask"],
        }
        gi = client.post("/generate_insights", json=example_payload)
        print("[Generate Insights] status:", gi.status_code)
        try:
            print(pretty(gi.get_json()))
        except Exception:
            print(gi.data.decode("utf-8", errors="ignore"))
        print()

        # 3) RAG ask (proxied)
        # Note: requires ai_echo service running on 5001 to get real response; otherwise may error/timeout
        ask = client.post("/ask", json={"query": "Summarize 2024 AI projects"})
        print("[Ask] status:", ask.status_code)
        try:
            print(pretty(ask.get_json()))
        except Exception:
            print(ask.data.decode("utf-8", errors="ignore"))
        print()


if __name__ == "__main__":
    run_tests()


