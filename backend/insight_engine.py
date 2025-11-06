from __future__ import annotations

import json
import logging
import os
import time
import hashlib
from pathlib import Path
from typing import Any, Dict

import requests


logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
INSIGHTS_CACHE_DIR = BASE_DIR / 'cache' / 'insights'


def _to_readable_summary(summary: Dict[str, Any]) -> str:
    try:
        return json.dumps(summary, indent=2, ensure_ascii=False)
    except Exception:
        return str(summary)


def call_llm(prompt: str, retries: int = 2, backoff_sec: float = 1.0) -> str:
    # File-based cache for prompts to avoid re-calling LLM during dev
    try:
        INSIGHTS_CACHE_DIR.mkdir(parents=True, exist_ok=True)
        key = hashlib.sha256(prompt.encode('utf-8')).hexdigest()
        cache_path = INSIGHTS_CACHE_DIR / f"ins_{key}.json"
        if cache_path.exists() and (time.time() - cache_path.stat().st_mtime) < 7 * 24 * 3600:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cached = json.load(f)
                if isinstance(cached, dict) and 'value' in cached:
                    return str(cached['value'])
    except Exception as e:
        logger.warning("Insights cache read failed: %s", e)
    api_key = os.getenv('BLACKBOX_API_KEY')
    if not api_key:
        val = (
            '{"academic":"Simulated academic insight","behavioral":"Simulated behavior","career":"Simulated career suggestion"}'
        )
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump({'value': val, 'ts': time.time()}, f)
        except Exception:
            pass
        return val

    url = 'https://api.blackbox.ai/api/v1/query'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    payload = {"prompt": prompt}

    last_err: Exception | None = None
    for attempt in range(retries + 1):
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=30)
            if resp.status_code != 200:
                logger.warning("Blackbox non-200 (%s): %s", resp.status_code, resp.text[:200])
                last_err = RuntimeError(f"status={resp.status_code}")
            else:
                data = resp.json()
                # common fields that may contain text
                if isinstance(data, dict):
                    for key2 in ("response", "text", "answer", "data"):
                        sval = data.get(key2)
                        if isinstance(sval, str) and sval.strip():
                            try:
                                with open(cache_path, 'w', encoding='utf-8') as f:
                                    json.dump({'value': sval, 'ts': time.time()}, f)
                            except Exception:
                                pass
                            return sval
                sval = json.dumps(data)
                try:
                    with open(cache_path, 'w', encoding='utf-8') as f:
                        json.dump({'value': sval, 'ts': time.time()}, f)
                except Exception:
                    pass
                return sval
        except Exception as e:
            last_err = e
            logger.warning("Blackbox request failed (attempt %d/%d): %s", attempt + 1, retries + 1, e)
        time.sleep(backoff_sec)

    logger.error("Falling back to simulated insight due to errors: %s", last_err)
    sval = (
        '{"academic":"Simulated academic insight","behavioral":"Simulated behavior","career":"Simulated career suggestion"}'
    )
    try:
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump({'value': sval, 'ts': time.time()}, f)
    except Exception:
        pass
    return sval


def generate_insights(summary: Dict[str, Any]) -> Dict[str, str]:
    """Generate academic, behavioral, and career insights from a student summary.

    Returns a dict with keys: academic, behavioral, career
    """
    readable = _to_readable_summary(summary)
    prompt = (
        "You are EduWeave's Insight Engine. Based on the provided student summary, "
        "generate concise insights strictly in JSON with keys: academic, behavioral, career.\n\n"
        "Constraints:\n"
        "- academic_insight: 1–2 sentences highlighting strengths/risks across subjects and attendance.\n"
        "- behavioral_insight: 1–2 sentences on habits, pace, and consistency.\n"
        "- career_insight: 1–2 sentences suggesting roles, projects, or next steps.\n\n"
        f"Summary:\n{readable}\n\n"
        "Return JSON only, no extra commentary."
    )

    llm_text = call_llm(prompt)
    # Attempt to parse JSON output from the model; be lenient
    insights = {
        "academic": "",
        "behavioral": "",
        "career": "",
    }
    try:
        parsed = json.loads(llm_text)
        if isinstance(parsed, dict):
            # Map common possible keys to our canonical keys
            insights["academic"] = str(parsed.get("academic") or parsed.get("academic_insight") or "")
            insights["behavioral"] = str(parsed.get("behavioral") or parsed.get("behavioral_insight") or "")
            insights["career"] = str(parsed.get("career") or parsed.get("career_insight") or "")
            return insights
    except Exception:
        logger.info("LLM output not JSON, returning as academic and leaving others empty")
        insights["academic"] = llm_text
        return insights

    # If parsing produced something unexpected
    insights["academic"] = llm_text
    return insights


def clear_cache() -> None:
    """Remove cached insight files (<backend>/cache/insights)."""
    try:
        if not INSIGHTS_CACHE_DIR.exists():
            return
        for p in INSIGHTS_CACHE_DIR.glob('*'):
            try:
                if p.is_file():
                    p.unlink()
            except Exception:
                continue
    except Exception as e:
        logger.warning("Failed to clear insights cache: %s", e)


if __name__ == "__main__":
    # Minimal smoke test
    demo_summary = {
        "student": {"student_id": 1, "name": "Demo"},
        "avg_grade": 8.1,
        "avg_attendance": 85.0,
        "subject_details": {"AI": 9.0, "DBMS": 8.2},
        "attendance_details": {"AI": 88, "DBMS": 82},
        "projects": [{"name": "AI Bot", "tags": ["ML", "NLP"]}],
        "tags": ["ML", "NLP"],
    }
    out = generate_insights(demo_summary)
    print(json.dumps(out, indent=2))


