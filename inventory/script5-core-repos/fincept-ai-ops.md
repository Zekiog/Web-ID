# fincept-ai-ops - Core Repo Signal Pack

## Metadata
- Repository: Zekiog/fincept-ai-ops
- URL: https://github.com/Zekiog/fincept-ai-ops
- Default branch: main
- Primary language: Python
- Visibility: public
- Description: Fincept AI Ops — Research-first, supervised paper trading system. FastAPI + N8N + MCP. 5 connectors. Enterprise grade.

## Structure Signals
- Top directories (9): .github, agents, api, apps, data, docs, mcp, tests, workflows
- Top files (23): .env.example, .github, .gitignore, AGENTS.md, CHANGELOG.md, CONTRIBUTING.md, Dockerfile, LICENSE, README.md, ROADMAP.md, SECURITY.md, agents, api, apps, data, docker-compose.yml, docs, mcp, requirements-dev.txt, requirements.txt, tests, vercel.json, workflows
- Detected technology signals: Python runtime/dependency ecosystem, Containerization and runtime packaging, GitHub Actions CI/CD automation, MCP integration/control plane, Agent orchestration topology, Workflow automation footprint

## README Snapshot (first 80 lines)
```md
# 🏗️ Fincept AI Ops

> Research-first, supervised paper trading system.
> FastAPI + N8N + MCP. 5 active connectors. Enterprise grade.

**Status:** 🟢 Production-Ready — Audit Score 8.4/10
**Default Branch:** `main` ← canonical, fully up-to-date
**Owner:** Mehmet Zeki (ZeZilly)
**Version:** 1.0 / MVP
**Last Updated:** 2026-05-22

---

## ⚠️ Branch Status

| Branch | Role | Content | Status |
|---|---|---|---|
| `main` | **Canonical / Production** | Full implementation | ✅ Default & Active |
| `youtube` | Legacy dev branch | Identical to main | 🔒 Frozen (no divergence) |

> `main` contains 100% of all implementation. `youtube` was the development branch during initial build — all content was squash-merged into `main` on 2026-05-22. **Use `main` for all future work.**

---

## Core Principle

> No live trading. No execution without human approval. No broker action without audit log.

---

## System Overview

```
Market Data + News + Fundamentals
            ↓
      Research Pipeline
            ↓
      Strategy Lab (signal candidate)
            ↓
      Risk Policy (evaluate)
            ↓
    Human Approval Gate
            ↓
    Paper Broker Execution
            ↓
    Audit Logger + State Store
            ↓
    Daily Briefing Generator
```

---

## 5 Active Connectors (MVP)

| # | Connector | Purpose | Status |
|---|---|---|---|
| 1 | market_data | Price, OHLCV, watchlist | ✅ Active |
| 2 | fundamentals | Balance sheet, income, cash flow | ✅ Active |
| 3 | news | News and event data | ✅ Active |
| 4 | backtest | Signal test and performance | ✅ Active |
| 5 | broker_sandbox | Paper order execution | ✅ Active |

All other connectors are **disabled** in MVP.

---

## What's Implemented (v1.0)

### Agent Layer
- `risk_guard` — Portfolio-context-enriched risk evaluation
- `execution_ops` — Dual-gate: risk check + human approval before execution

### MCP Server
- `mcp/server.py` — Full StdIO MCP server with 7 tools
- `mcp/tools/market_data.py`
- `mcp/tools/research_execution.py`

### API & Middleware
- FastAPI app with rate limiting + request size limits
- CORS env-driven configuration
```
