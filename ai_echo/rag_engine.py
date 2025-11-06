import os
import glob
import pickle
import logging
import hashlib
import json
import time
from pathlib import Path
from typing import Tuple, List

import requests

try:
    import faiss  # type: ignore
except Exception as e:  # pragma: no cover
    faiss = None  # Will error later with a clearer message

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore import InMemoryDocstore


logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


BASE_DIR = Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR / 'documents'
INDEX_FILE = BASE_DIR / 'embeddings.index'
DOCS_PKL = BASE_DIR / 'docs.pkl'
LOCK_FILE = BASE_DIR / 'index.lock'
CACHE_DIR = BASE_DIR / 'cache'


def _load_text_documents() -> List[Document]:
    if not DOCS_DIR.exists():
        logger.warning("Documents directory does not exist: %s", DOCS_DIR)
        return []

    # Use LangChain's DirectoryLoader + TextLoader for .txt files
    loader = DirectoryLoader(str(DOCS_DIR), glob='*.txt', loader_cls=TextLoader, show_progress=False)
    docs = loader.load()
    logger.info("Loaded %d raw documents", len(docs))

    splitter = CharacterTextSplitter(chunk_size=400, chunk_overlap=50)
    split_docs = splitter.split_documents(docs)
    logger.info("Split into %d chunks", len(split_docs))
    return split_docs


def _get_embeddings() -> SentenceTransformerEmbeddings:
    return SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")


def _save_faiss_index(store: FAISS) -> None:
    if faiss is None:
        raise RuntimeError("faiss is not installed. Please install faiss-cpu.")
    INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Save FAISS index to a single file
    faiss.write_index(store.index, str(INDEX_FILE))

    # Persist docstore mapping in a stable order matching index_to_docstore_id.
    # Also save a simple list of chunk texts for easy reload.
    ordered_ids = [store.index_to_docstore_id[i] for i in range(len(store.index_to_docstore_id))]
    documents = [store.docstore._dict[doc_id] for doc_id in ordered_ids]
    texts = [getattr(doc, 'page_content', str(doc)) for doc in documents]
    metadatas = [getattr(doc, 'metadata', {}) for doc in documents]
    payload = {
        'ordered_ids': ordered_ids,
        'texts': texts,
        'metadatas': metadatas,
    }
    with open(DOCS_PKL, 'wb') as f:
        pickle.dump(payload, f)
    logger.info("Saved FAISS index to %s and docs to %s", INDEX_FILE, DOCS_PKL)


def _load_faiss_index() -> FAISS:
    if faiss is None:
        raise RuntimeError("faiss is not installed. Please install faiss-cpu.")
    if not INDEX_FILE.exists() or not DOCS_PKL.exists():
        raise FileNotFoundError("Index or docs metadata not found.")

    index = faiss.read_index(str(INDEX_FILE))
    with open(DOCS_PKL, 'rb') as f:
        payload = pickle.load(f)
    # Support both old and new payload formats
    if 'id_to_doc' in payload:
        id_to_doc: dict = payload['id_to_doc']
        ordered_ids: List[str] = payload.get('ordered_ids') or list(id_to_doc.keys())
        docstore = InMemoryDocstore(id_to_doc)
        index_to_docstore_id = {i: ordered_ids[i] for i in range(len(ordered_ids))}
    else:
        texts: List[str] = payload.get('texts', [])
        metadatas: List[dict] = payload.get('metadatas', [{} for _ in texts])
        # Reconstruct a minimal docstore mapping
        from langchain.docstore.document import Document
        docs = [Document(page_content=t, metadata=m if isinstance(m, dict) else {}) for t, m in zip(texts, metadatas)]
        id_to_doc = {str(i): d for i, d in enumerate(docs)}
        docstore = InMemoryDocstore(id_to_doc)
        index_to_docstore_id = {i: str(i) for i in range(len(docs))}

    embeddings = _get_embeddings()
    store = FAISS(
        embedding_function=embeddings,
        index=index,
        docstore=docstore,
        index_to_docstore_id=index_to_docstore_id,
    )
    logger.info("Loaded FAISS index with %d vectors", len(index_to_docstore_id))
    return store


def _latest_docs_mtime() -> float:
    """Return latest modification time among .txt docs; 0.0 if none."""
    if not DOCS_DIR.exists():
        return 0.0
    mtimes = [p.stat().st_mtime for p in DOCS_DIR.glob('*.txt') if p.is_file()]
    return max(mtimes) if mtimes else 0.0


def _acquire_lock(timeout_sec: int = 10) -> bool:
    """Create a lock file to avoid concurrent rebuilds."""
    start = time.time()
    while time.time() - start < timeout_sec:
        try:
            fd = os.open(str(LOCK_FILE), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.close(fd)
            return True
        except FileExistsError:
            time.sleep(0.1)
    return False


def _release_lock() -> None:
    try:
        if LOCK_FILE.exists():
            LOCK_FILE.unlink()
    except Exception:
        pass


def _build_index_from_docs() -> FAISS:
    docs = _load_text_documents()
    if not docs:
        logger.warning("No documents found to index. Creating an empty vectorstore.")
        embeddings = _get_embeddings()
        store = FAISS.from_texts([""], embeddings)
        _save_faiss_index(store)
        return store
    embeddings = _get_embeddings()
    store = FAISS.from_documents(docs, embeddings)
    _save_faiss_index(store)
    return store


def rebuild_index(force: bool = False) -> FAISS:
    """Rebuild the FAISS index.

    If force is True, delete existing files and rebuild.
    Uses a simple file lock to avoid concurrent rebuilds.
    """
    if force:
        try:
            if INDEX_FILE.exists():
                INDEX_FILE.unlink()
            if DOCS_PKL.exists():
                DOCS_PKL.unlink()
        except Exception as e:
            logger.warning("Failed to delete old index files: %s", e)

    if not _acquire_lock():
        logger.warning("Could not acquire index rebuild lock; using existing index if available.")
        if INDEX_FILE.exists() and DOCS_PKL.exists():
            return _load_faiss_index()
        return _build_index_from_docs()

    try:
        return _build_index_from_docs()
    finally:
        _release_lock()


def build_or_load_index() -> FAISS:
    """Build and persist a FAISS index from ai_echo/documents or load if present.

    If index exists but documents are newer, rebuild (with locking).
    """
    try:
        if INDEX_FILE.exists() and DOCS_PKL.exists():
            index_mtime = INDEX_FILE.stat().st_mtime
            docs_mtime = _latest_docs_mtime()
            if index_mtime >= docs_mtime:
                return _load_faiss_index()
            logger.info("Documents changed since last index; rebuilding.")
            return rebuild_index(force=False)
    except Exception as e:
        logger.warning("Failed loading existing index, rebuilding. Error: %s", e)
        return rebuild_index(force=False)

    return rebuild_index(force=False)


def get_top_contexts(query: str, k: int = 2) -> str:
    try:
        store = build_or_load_index()
        results = store.similarity_search(query, k=k)
        combined = "\n\n".join([r.page_content for r in results])
        logger.info("Retrieved %d context chunks", len(results))
        return combined
    except Exception as e:
        logger.error("get_top_contexts failed: %s", e)
        return ""


def call_llm_with_context(prompt: str) -> str:
    # Simple file-based cache to avoid repeated calls
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        key = hashlib.sha256(prompt.encode('utf-8')).hexdigest()
        cache_path = CACHE_DIR / f"rag_{key}.json"
        # Fresh if < 7 days old
        if cache_path.exists() and (time.time() - cache_path.stat().st_mtime) < 7 * 24 * 3600:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cached = json.load(f)
                if isinstance(cached, dict) and 'value' in cached:
                    return str(cached['value'])
    except Exception as e:
        logger.warning("RAG cache read failed: %s", e)

    api_key = os.getenv('BLACKBOX_API_KEY')
    if not api_key:
        resp_text = f"Simulated LLM response for prompt: {prompt[:200]}"
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump({'value': resp_text, 'ts': time.time()}, f)
        except Exception:
            pass
        return resp_text

    try:
        url = 'https://api.blackbox.ai/api/v1/query'
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        resp = requests.post(url, headers=headers, json={"prompt": prompt}, timeout=30)
        if resp.status_code != 200:
            logger.warning("Blackbox API non-200: %s - %s", resp.status_code, resp.text[:200])
            resp_text = f"Simulated LLM response for prompt: {prompt[:200]}"
            try:
                with open(cache_path, 'w', encoding='utf-8') as f:
                    json.dump({'value': resp_text, 'ts': time.time()}, f)
            except Exception:
                pass
            return resp_text
        data = resp.json()
        # Try common fields
        for key in ("response", "text", "answer", "data"):
            if isinstance(data, dict) and key in data and isinstance(data[key], str) and data[key].strip():
                resp_text = data[key]
                try:
                    with open(cache_path, 'w', encoding='utf-8') as f:
                        json.dump({'value': resp_text, 'ts': time.time()}, f)
                except Exception:
                    pass
                return resp_text
        # Fallback: stringify
        resp_text = str(data)[:1000]
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump({'value': resp_text, 'ts': time.time()}, f)
        except Exception:
            pass
        return resp_text
    except Exception as e:
        logger.error("Blackbox API call failed: %s", e)
        resp_text = f"Simulated LLM response for prompt: {prompt[:200]}"
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump({'value': resp_text, 'ts': time.time()}, f)
        except Exception:
            pass
        return resp_text


def clear_cache() -> None:
    """Remove all cache files under ai_echo/cache."""
    try:
        if not CACHE_DIR.exists():
            return
        for p in CACHE_DIR.glob('*'):
            try:
                if p.is_file():
                    p.unlink()
            except Exception:
                continue
    except Exception as e:
        logger.warning("Failed to clear RAG cache: %s", e)


def query_rag(question: str) -> dict:
    context = get_top_contexts(question, k=2)
    prompt = (
        "You are AI Echo, EduWeave's campus memory engine.\n\n"
        f"Context: {context}\n\n"
        f"Question: {question}\n\n"
        "Answer concisely and in 2–3 sentences using the context if relevant."
    )
    answer = call_llm_with_context(prompt)
    return {"context": context, "answer": answer}


if __name__ == '__main__':  # Simple manual test
    q = "What AI projects improved placements?"
    result = query_rag(q)
    print("Context:\n", result["context"][:500])
    print("\nAnswer:\n", result["answer"])


