# opencode-triage-omo

> Extended OMO triage: routes to agents, **and** skills, and tools via keyword scoring for OpenCode.
>
> A fork of [cascharly/opencode-triage](https://github.com/cascharly/opencode-triage) — the original routes only to skills.
> This fork extends the dispatch table concept to also route to OMO agents and categories.

## Quick Start

```bash
npm install -g opencode-triage-omo
```

Restart OpenCode, then type `/triage on`. That's it.

## What It Does

OpenCode lists every skill's name and description in the prompt on every message. With many skills and OMO agents, that burns hundreds of tokens before you type a word.

Triage hides all skills **and agents** from the prompt. When you need one, the LLM calls `triage()` — the plugin finds the best match by keyword scoring and loads only that skill's instructions or routes to the right agent.

```
No triage:   [name+desc of A] [name+desc of B] [name+desc of C] ... [agent list] ...  ← every message
With triage: triage({ query }) → keyword match → loads one skill body OR routes to an agent when needed
```

**The more skills and agents you have, the more triage saves.** Each new entry adds tokens to the native prompt, but zero tokens when triage is on.

## Extended Scope: Agent + Skill Routing

The original `opencode-triage` only discovers and routes to `SKILL.md` files. This fork (`opencode-triage-omo`) extends the routing to also cover:

- **Skills** — Same as original: `SKILL.md` files from `.opencode/skills/`, `.claude/skills/`, `.agent/skills/`, `.agents/skills/` (project + global)
- **Agents** — OMO agent definitions from `.omo/agents/` directories, routing to the right subagent (`sisyphus`, `oracle`, `explore`, `librarian`, etc.)
- **Categories** — OMO category dispatch for task routing (`visual-engineering`, `ultrabrain`, `deep`, `artistry`, `quick`, etc.)
- **Tools** — Tool selection scoring to determine which MCP tool or built-in tool best fits the query

The scoring engine (keyword + IDF + bigram + phrase + stemming) remains the same powerful deterministic matcher — only the discovery scope and dispatch table are expanded.

### Dispatch Table Concept

The extended triage uses a **dispatch table** that maps (intent, complexity) pairs to (route_id, agent, tier):

| Intent | Complexity | Route |
|--------|-----------|-------|
| UI/UX work | any | `visual-engineering` category |
| Hard logic | high | `ultrabrain` category |
| Codebase search | any | `explore` agent |
| Documentation | any | `writing` category |
| Security audit | any | `security-research` skill |
| Git operations | any | `git-master` skill |

This allows the LLM to be routed to the **right agent/category/skill** in one `triage()` call, without having to reason about which subagent type or category to use.

## How It Works

```
User: "backup my database"
  │
  ▼
LLM: triage({ query: "backup my database" })
  │
  ▼
Plugin: scans filesystem → scores skills + agents → returns best match
  backup-restore     score=60  (matched: backup, database)
  database-sync      score=25  (matched: database)
  gap=35 ≥ threshold(30) → HIGH CONFIDENCE
```

No LLM reasoning overhead. No extra API calls. Just fast deterministic matching.

### Integration with OMO

When an OMO agent pattern is matched, the triage result returns structured routing information:

```
AGENT ROUTED: oracle
Route: oracle (deep reasoning)
Context: agent definition at .omo/agents/oracle.md
```

The LLM then delegates to the routed agent via the task mechanism, with triage providing the context needed.

### Spell Correction

If a query word doesn't match any skill, the plugin suggests the closest correction (e.g., `scurity` → `security`) and passes it to the LLM as a hint. The LLM can retry silently — no user-facing error.

## Commands

| Command | What it does |
|---|---|
| `/triage on` | Enable hooks to hide skills from the LLM prompt (global + local) |
| `/triage off` | Disable hooks, restore skills to the LLM prompt (global + local) |
| `/triage status` | See hook state and skill visibility |
| `/triage dedupe` | Remove project-level duplicates of global skills |
| `/triage compare` | Token savings estimate for your skills |

See the [original opencode-triage README](https://github.com/cascharly/opencode-triage) for full command documentation.

## Install

### Global (recommended)

```bash
npm install -g opencode-triage-omo
```

### Per-project

```bash
npm install opencode-triage-omo
```

## Token Savings

Same principle as the original — the more skills and agents installed, the more tokens saved per prompt.

## Compatibility

- OpenCode 1.14+
- OMO v4.x+
- Bun runtime (bundled with OpenCode)
- Node.js 18+ (for CLI script)

## License

MIT
