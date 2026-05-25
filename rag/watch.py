"""
watch.py — Auto-reindex RAG corpus when TSX source files change.

Watches src/components/*.tsx and reruns the full pipeline
(extract_docs.py → setup_vectordb.py --reset) whenever a file changes.

Usage:
  pip install watchdog
  python3 rag/watch.py

Pairs well with npm run dev — run both terminals simultaneously.
The corpus is re-indexed automatically; restart the Beatrice server
(uvicorn / node) to reload the updated aetheris-docs-dump.json.
"""

import subprocess
import sys
import time
from pathlib import Path

try:
    from watchdog.events import FileSystemEventHandler
    from watchdog.observers import Observer
except ImportError:
    print("[ERROR] watchdog not installed. Run: pip install watchdog")
    sys.exit(1)

ROOT_DIR = Path(__file__).parent.parent
SRC_DIR  = ROOT_DIR / "src" / "components"
RAG_DIR  = Path(__file__).parent

EXTRACT_SCRIPT = str(RAG_DIR / "extract_docs.py")
SETUP_SCRIPT   = str(RAG_DIR / "setup_vectordb.py")

DEBOUNCE_SECONDS = 3.0


class TSXHandler(FileSystemEventHandler):
    def __init__(self):
        self._last_run: float = 0.0

    def on_modified(self, event):
        if event.is_directory:
            return
        if not str(event.src_path).endswith(".tsx"):
            return
        now = time.monotonic()
        if now - self._last_run < DEBOUNCE_SECONDS:
            return  # debounce — skip rapid saves
        self._last_run = now
        self._reindex(event.src_path)

    on_created = on_modified

    def _reindex(self, changed_path: str):
        print(f"\n📄  TSX changed: {Path(changed_path).name}")
        print("🔄  Extracting docs...")
        r1 = subprocess.run([sys.executable, EXTRACT_SCRIPT], capture_output=True, text=True)
        if r1.returncode != 0:
            print(f"[ERROR] extract_docs.py failed:\n{r1.stderr}")
            return
        print("🔄  Re-indexing ChromaDB...")
        r2 = subprocess.run(
            [sys.executable, SETUP_SCRIPT, "--reset"],
            capture_output=True, text=True
        )
        if r2.returncode != 0:
            print(f"[ERROR] setup_vectordb.py failed:\n{r2.stderr}")
            return
        print("✅  Corpus re-indexed. Restart Beatrice server to load new data.\n")


def main():
    handler  = TSXHandler()
    observer = Observer()
    observer.schedule(handler, str(SRC_DIR), recursive=False)
    observer.start()
    print(f"👁️   Watching {SRC_DIR}")
    print("     Auto-reindex triggers on any *.tsx save.")
    print("     Press Ctrl+C to stop.\n")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    main()
