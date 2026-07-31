# memory-core-mcp - Core Repo Signal Pack

## Metadata
- Repository: Zekiog/memory-core-mcp
- URL: https://github.com/Zekiog/memory-core-mcp
- Default branch: main
- Primary language: Python
- Visibility: private
- Description: Self-hosted MCP memory server over Oracle ADB 23ai (native AI Vector Search). Bearer HTTP gateway + n8n workflows. Local-first, no cloud memory API.

## Structure Signals
- Top directories (9): db, deploy, docs, integrations, n8n, scripts, security, src, tests
- Top files (12): .gitignore, README.md, db, deploy, docs, integrations, n8n, pyproject.toml, scripts, security, src, tests
- Detected technology signals: Python runtime/dependency ecosystem, Workflow automation footprint

## README Snapshot (first 80 lines)
```md
# memory-core-mcp

Self-hosted **MCP memory server** for the Claude/agent stack, backed by an
**Oracle Autonomous Database 23ai** (`zmemory-adb`) on the Stockholm
Always-Free tier. Local-first, no cloud memory API, no vendor lock-in.

This is the "own MCP" core of the unified memory + connections platform:

- **Memory substrate:** Oracle 23ai native **AI Vector Search** (`VECTOR(384)`)
  — the functional equivalent of pgvector, but managed, auto-backed-up,
  mTLS-only, encrypted at rest.
- **Embeddings:** generated **in-database** via an ONNX model
  (`DBMS_VECTOR`), so no external embedding service is required. Until the
  model is loaded the server degrades gracefully to keyword search.
- **Graph:** typed links between memories (`memory_links`) mirror the
  vault's `[[wikilinks]]`.

## Architecture

```
Claude CLI / Desktop / agents
        │  (MCP: stdio local  |  streamable-http via CF tunnel)
        ▼
  memory-core-mcp  ──oracledb thin + mTLS wallet──►  zmemory-adb (Oracle 23ai)
        │                                              VECTOR + JSON + relational
        └── optional markdown mirror ──► ai-memory-vault (git)
```

`zmemory-adb` is a **dedicated** Always-Free Autonomous DB — it does not run on
the constrained Ampere VMs (avm-01 Hermes / avm-02 n8n), keeping memory load
off the compute boxes.

## MCP tools

| Tool | Purpose |
|------|---------|
| `memory_add` | Persist a memory (capture/decision/fact/reference/project) + optional links |
| `memory_search` | Semantic search (cosine); keyword fallback if model unloaded |
| `memory_get` | Fetch one memory + its outgoing graph links |
| `memory_recent` | Most-recently updated memories (filterable) |
| `memory_link` | Create a typed edge between two memories (idempotent) |
| `memory_stats` | Counts by scope/kind; whether semantic search is active |

## Setup

```bash
uv venv .venv
uv pip install --python .venv/bin/python -e .

# 1. Provision DB (already done): Always-Free ADB 23ai 'zmemory-adb'
# 2. Wallet → ~/.secrets.d/zmemory-wallet  (oci db autonomous-database generate-wallet)
# 3. Bootstrap user + schema
./.venv/bin/python db/bootstrap.py
# 4. (optional, lights up semantic search) load ONNX embedding model
#    see db/03_embedding_model.sql
```

Config lives in `.env` (copy from `.env.example`, `chmod 600`). Secrets are in
`~/.secrets.d/zmemory-adb.env` — **never** committed and never written to the vault.

## Run

```bash
./.venv/bin/memory-core-mcp           # stdio (local MCP client)
MCP_HTTP=1 ./.venv/bin/memory-core-mcp # streamable-http (multi-access via tunnel)
```

## Security posture

- mTLS-only DB connection (wallet); no public DB listener.
- Least-privilege schema `ZMEM` (not `ADMIN`).
- Secrets in `~/.secrets.d/*.env` (chmod 600), outside git.
- DB is Oracle-managed: automatic backups, patching, encryption at rest.
```
