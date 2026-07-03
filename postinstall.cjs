const fs = require("fs")
const path = require("path")
const os = require("os")

const CMD = `---
description: Toggle, inspect, and benchmark the triage skill & agent router
---
Run npx -y opencode-triage-omo $ARGUMENTS and show the output verbatim.
If output contains "Restart opencode", tell the user to restart.
`

const isGlobal = process.env.npm_config_global === "true"

if (isGlobal) {
  const dir = path.join(os.homedir(), ".config", "opencode", "commands")
  const file = path.join(dir, "triage.md")
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, CMD, "utf-8")
  console.log()
  console.log("  opencode-triage-omo installed globally")
  console.log()
  console.log("  1. Restart OpenCode")
  console.log("  2. Type /triage on to activate")
  console.log("  3. Will hide skills from LLM prompt")
  console.log()
} else {
  const projectRoot = process.env.INIT_CWD || process.cwd()
  const dir = path.join(projectRoot, ".opencode", "commands")
  const file = path.join(dir, "triage.md")
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, CMD, "utf-8")
  console.log()
  console.log("  opencode-triage-omo installed locally")
  console.log()
  console.log("  1. Restart OpenCode")
  console.log("  2. Type /triage on --local to activate")
  console.log("  3. Will hide skills from LLM prompt")
  console.log()
}
