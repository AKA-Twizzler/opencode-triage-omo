# opencode-triage-omo — Agent Guide

## What this is

Extended OMO triage: routes to agents, skills, and tools via keyword scoring for OpenCode.
Forked from cascharly/opencode-triage.

## Entrypoints

- **Plugin** (`src/index.ts`) — exports `server`, consumed by OpenCode Bun runtime. No build step.
- **CLI** (`bin/opencode-triage.cjs`) — standalone Node.js script for user commands.
- **Postinstall** (`postinstall.cjs`) — auto-creates `/triage` command file on npm install.

## Commands

```sh
npm run check    # tsc --noEmit (only check, no build/compile)
```

No test runner, no linter, no formatter config. No tsconfig.json in repo.

## Architecture

- Scans 6 directories: `.agent/skills/`, `.claude/skills/`, `.opencode/skills/` (project) + `~/.agents/skills/`, `~/.claude/skills/`, `~/.config/opencode/skills/` (global)
- Also scans OMO agent directories (`.omo/agents/`) for agent definitions
- Reads `SKILL.md` files directly — `.disabled` suffix is fallback for older OpenCode
- Hides skills from LLM via 3-layer hook defense
- Extended dispatch table routes to agents, categories, and tools in addition to skills
- Keyword scoring: `THRESHOLD=30`, `MIN_WORD_LENGTH=3`, `NAME_WEIGHT=3`, `DESC_WEIGHT=1`, `BIGRAM_BONUS=10`, `PHRASE_BONUS=50`, `POSITION_DECAY=0.9`, `SCOPE_BONUS=5`
- Stemming: `stem()` strips `ies→y` and `ing→""` (MIN stem length 4)

## Publishing

`npm publish` — files included via `"files": ["src/", "bin/", "postinstall.cjs", "README.md"]` in package.json.
