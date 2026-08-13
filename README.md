# ComplexityLens

Real-time algorithm complexity analyzer — write code, get static complexity analysis, real sandboxed execution metrics, and empirical Big-O estimation, all visualized.

## Status: Functional MVP

Core backend and frontend are built and working end-to-end. See [Known Limitations](#known-limitations) and [Planned / Open Items](#planned--open-items) below before adding new features, to avoid duplicate work.

## Architecture

```
ComplexityLens/
├── backend/
│   ├── api.py                     # FastAPI app, route definitions
│   ├── analyzer/
│   │   ├── complexity.py          # Static AST-based complexity estimation
│   │   ├── operation_counter.py   # Static, input-size-aware operation counting
│   │   ├── empirical.py           # Multi-size data collection + growth-curve fitting
│   │   ├── sandbox.py             # Docker-based sandboxed execution (local dev)
│   │   └── sandbox_subprocess.py  # OS-level resource-limited execution (for hosting, Linux only)
│   ├── models/schemas.py          # Pydantic request/response schemas
│   ├── services/analyzer_service.py  # Shared analysis pipeline used by /analyze and /compare
│   ├── tests/                     # pytest unit + integration tests
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api/ (or services/ — see note below)
    │   └── components/
    │       ├── analyzer/  (CodeEditorPanel, AnalysisPanel, GrowthChart, ComplexityChart, OptimizationPanel)
    │       └── layout/
    └── package.json
```

## How It Works

1. User writes code in the Monaco editor (Python only is fully supported right now — see limitations).
2. Frontend sends `{code, language, input_size}` to `POST /analyze`.
3. Backend runs three independent analyses:
   - **Static complexity** — AST walk detecting loop nesting depth and basic recursion, distinguishing input-dependent loop bounds (`range(n)`) from fixed ones (`range(10)`).
   - **Operation counting** — AST walk counting comparisons/assignments/arithmetic/calls, scaled by `input_size` and loop depth.
   - **Empirical estimation** — runs operation counting across a fixed range of input sizes (`[10, 100, 500, 1000, 5000]`) and fits the growth pattern against known Big-O curves.
4. Backend also runs the actual code in a sandbox (Docker locally) to measure real execution time and memory.
5. Frontend renders complexity, operation count, timing/memory, and a real growth-curve chart.

There's also a `POST /compare` endpoint that runs the full pipeline on multiple named code snippets in one request, with per-item error isolation (one broken snippet doesn't fail the whole batch).

## Running Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn api:app --reload
```
Requires Docker Desktop running (for the sandbox).

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Tests:**
```bash
cd backend
python -m pytest tests/ -v
```
16 tests currently passing (unit tests for complexity/operation-counter logic, integration tests hitting real API routes via FastAPI's TestClient).

## Known Limitations

Being upfront about these — they're intentional scope boundaries, not bugs, unless noted:

- **Python only.** Static analysis (`ast.parse`) only understands Python. Submitting JS/C++ returns a clean `400` error rather than crashing, but there's no real analysis for those languages yet.
- **Space complexity is not implemented.** The frontend shows "N/A" honestly rather than fake data.
- **Recursion detection is basic.** Only linear vs. multi-call recursion is distinguished (`O(n)` vs `O(2^n)`) — divide-and-conquer patterns (e.g. merge sort) will be misclassified as exponential rather than `O(n log n)`.
- **The Docker sandbox doesn't fully block network access** in the subprocess-based fallback (`sandbox_subprocess.py`) used for hosting — only CPU/memory/timeout limits are enforced there, since full network isolation without containers needs more advanced OS-level work not yet built.
- **`operation_count` on some large-loop test cases has looked lower than expected** in ad-hoc testing — flagged for investigation, not yet root-caused.

## Planned / Open Items — sync before starting

- **`/benchmark` endpoint**: frontend (`services/api.js`) has a `benchmarkAlgorithm()` function calling a `/benchmark` endpoint that doesn't exist on the backend yet. It currently fails silently. Decide: build it, or repoint the frontend at `/analyze`'s existing `growth_data` field (which already provides multi-size data)?
- **Duplicate API client files**: `frontend/src/api/analyzeApi.js` (unused after latest merge) vs `frontend/src/services/api.js` (currently in use). Should be consolidated — delete the unused one.
- **Deployment**: sandbox needs real Docker access, which most free hosting tiers don't provide. Options under consideration: GitHub Student Pack VPS credit (keeps full Docker sandbox), or the subprocess-based fallback (`sandbox_subprocess.py`, weaker isolation, Linux-only) for free-tier hosting.
- **C++ execution/analysis**: not started. Realistic path would need `tree-sitter-cpp` or similar — full arbitrary C++ parsing is out of scope.
- **Docker Compose**: `docker-compose.yml` drafted for local multi-container orchestration; not yet finalized for deployment.

## Tech Stack

**Backend:** FastAPI, Pydantic, Python `ast` module, Docker SDK (via subprocess), pytest
**Frontend:** React, Vite, Tailwind CSS, Monaco Editor, Recharts