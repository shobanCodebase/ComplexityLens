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
│   │   ├── recursion_classifier.py # Distinguishes linear/divide-and-conquer/exponential recursion
│   │   ├── space_complexity.py    # Heuristic auxiliary space complexity estimation
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
    │   ├── services/api.js        # Canonical API client (analyzeAlgorithm, benchmarkAlgorithm, checkBackendHealth)
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
23 tests currently passing (unit tests for complexity/operation-counter logic, integration tests hitting real API routes via FastAPI's TestClient).

## Known Limitations

Being upfront about these — they're intentional scope boundaries, not bugs, unless noted:

- **Python only.** Static analysis (`ast.parse`) only understands Python. Submitting JS/C++ returns a clean `400` error rather than crashing, but there's no real analysis for those languages yet.
- **Space complexity is a basic heuristic**, not a rigorous analysis. It detects container-growth patterns (`.append()`/`.add()`/etc. inside a loop, or list/set/dict comprehensions) and reports `O(n)` if found, `O(1)` otherwise. It does **not** distinguish `O(n)` from `O(n²)` space (e.g. a 2D list growing in a nested loop still reports `O(n)`), and does **not** account for recursion's call-stack space (e.g. naive recursive Fibonacci reports `O(1)` space, though it actually uses `O(n)` stack depth). Frontend previously showed "N/A" for this field — needs updating to display the real value now that the backend provides it.
- **Recursion detection uses a narrow heuristic**, not a general recurrence solver. It classifies each recursive call's argument as "divides" (e.g. `n // 2`) or "decrements" (e.g. `n - 1`), then infers: single-call decrement → `O(n)`, single-call divide → `O(log n)`, multi-call all-divide → `O(n log n)` (e.g. merge sort), multi-call with any decrement → `O(2^n)` (e.g. naive Fibonacci). This correctly distinguishes divide-and-conquer from true exponential recursion (a real fix from earlier misclassification), but it only inspects the *first* argument of each recursive call and won't catch more complex shrinking patterns (e.g. size passed via a helper variable rather than directly in the call). See `analyzer/recursion_classifier.py` and `tests/test_complexity.py`'s divide-and-conquer tests.
- **The Docker sandbox doesn't fully block network access** in the subprocess-based fallback (`sandbox_subprocess.py`) used for hosting — only CPU/memory/timeout limits are enforced there, since full network isolation without containers needs more advanced OS-level work not yet built.
- **`operation_count` on some large-loop test cases has looked lower than expected** in ad-hoc testing — investigated: this is intentional/correct behavior, not a bug. `operation_count` only scales with loops bound to a variable (e.g. `range(n)`), not loops bound to a literal constant (e.g. `range(1000000)`), regardless of the `input_size` parameter sent. `input_size` represents "what `n` should be," and only affects code that actually references a variable in its loop bound. Now covered by `test_hardcoded_constant_loop_does_not_scale_with_input_size`.

## Planned / Open Items — sync before starting

- **`/benchmark` endpoint**: frontend (`services/api.js`) has a `benchmarkAlgorithm()` function calling a `/benchmark` endpoint that doesn't exist on the backend yet. It currently fails silently. Decide: build it, or repoint the frontend at `/analyze`'s existing `growth_data` field (which already provides multi-size data)?
- **Duplicate API client files**: `frontend/src/api/analyzeApi.js` was unused after the latest merge and has been deleted. `frontend/src/services/api.js` is the canonical API client going forward.
- **Deployment**: sandbox needs real Docker access, which most free hosting tiers don't provide. Options under consideration: GitHub Student Pack VPS credit (keeps full Docker sandbox), or the subprocess-based fallback (`sandbox_subprocess.py`, weaker isolation, Linux-only) for free-tier hosting (e.g. Render).
- **C++ execution/analysis**: not started. Realistic path would need `tree-sitter-cpp` or similar — full arbitrary C++ parsing is out of scope.
- **Docker Compose**: `docker-compose.yml` drafted for local multi-container orchestration; not yet finalized for deployment.

## Tech Stack

**Backend:** FastAPI, Pydantic, Python `ast` module, Docker SDK (via subprocess), pytest
**Frontend:** React, Vite, Tailwind CSS, Monaco Editor, Recharts