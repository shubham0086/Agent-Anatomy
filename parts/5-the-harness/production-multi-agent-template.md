# The production multi-agent template (the harness, fully specified)

> Part 5 taught the idea: put guarantees in the **deterministic control plane**, never in the
> probabilistic model. This file is that idea taken all the way — a complete, copy-paste template
> for a multi-agent system that doesn't drift, doesn't blow its budget, and doesn't forget what it
> learned. It is distilled from production engines (a multi-agent SDLC system and a content-agency
> OS), then made platform-agnostic so you can drop it onto any stack.

---

## First, the problem this exists to solve: context and memory

A raw LLM call — any model, any vendor — has two structural weaknesses that no amount of clever
prompting fixes:

1. **A finite context window.** Everything the model "knows" in a turn has to fit in the window.
   Past some size it cannot see your whole codebase, so it pattern-matches on whatever fragment you
   pasted and confidently fills the gaps. More tokens is not more understanding.
2. **No memory between sessions.** Close the chat, and it is amnesiac. It does not remember the bug
   it hit yesterday or the solution it found last week. Every session starts cold.

These produce the two failure modes everyone who has used an LLM as a coding partner has felt:

- **Drift** — it trusts a stale doc or a half-remembered fragment and builds on a fiction.
- **Repetition** — it re-makes a mistake it already made, because nothing told it not to.

### How a coding-agent IDE (e.g. Claude Code) fixes this

An IDE-integrated coding agent is not "a chatbot in a sidebar." It is a **harness** around the model
(see [the harness](README.md)) that supplies exactly what the raw call lacks:

- **Context management** — it loads *relevant* files (often via a code graph / blast-radius lookup),
  not the whole repo, so the window holds signal instead of noise. This is *context engineering*.
- **Durable memory** — lifecycle hooks persist state to disk/DB on session end and restore it on
  session start, so continuity survives the session boundary deterministically.
- **Guardrails** — permissions and forbidden-action rules constrain what the agent can touch.

The template below is the full version of that harness for a *multi-agent* system: not one model in
an IDE, but several agents that have to share state, survive failures, and respect a budget. The same
principle scales — **the reliability lives in the deterministic scaffolding, not in the prompts.**

---

## How to use this template

1. Copy the sections you need into your project's agent-config (`.claude/`, `AGENTS.md`, a system
   prompt, or wherever your stack keeps agent instructions).
2. Replace every `<PLACEHOLDER>` (see the customization checklist at the end).
3. Create the `reality/` files first — they are the source of truth the agents read *before* acting.
4. Wire the recovery supervisor and cost enforcer before you let anything run unattended.

---

## A. System identity & core rules (non-negotiable)

```
You are <SYSTEM_NAME>, a multi-agent system focused on <DOMAIN>.

1. REALITY-FIRST
   - Truth lives in `reality/*.yaml`, not in documentation. Docs rot; reality files are maintained.
   - If docs and code conflict, trust the reality files and the actual code.
   - Before proposing a change, read the current-state file. Is this area hot or broken?

2. MEMORY ROUTING (three tiers — see "the context & memory" section above)
   - Short-term: a central in-process store (a blackboard / Redis / equivalent).
   - Operational: `current-state.md` + `reality/*.yaml`.
   - Long-term: a persistent store (SQLite / vector index) for recalling past solutions.
   - Hallucination guard: if a result is not in the persistent store, assume it never happened.
     DO NOT guess.

3. PRE-MODIFICATION CHECKLIST (always, before changing code)
   [ ] Read current-state — is this area hot/broken?
   [ ] Read the relevant reality file — does my plan match actual behaviour?
   [ ] Read known-issues — has this been tried and failed before?
   [ ] Read patterns — is there a canonical approach already?

4. MODIFICATION POLICY
   - Never overwrite wholesale. Merge with the existing reality.
   - Comment deprecated blocks, do not delete them — preserve the fallback reference.
   - Read the entire file before writing. Update reality files BEFORE code changes.

5. SECURITY (the DNA contract)
   [ ] No eval / exec / dynamic code execution.
   [ ] No filesystem access without the guardian module.
   [ ] No secrets in logs, commit messages, or event broadcasts — redact before emission.
   [ ] Validate ALL external input (user, LLM output, files, network).
   [ ] Path traversal: resolve -> bounds-check -> sanitize.
   [ ] No shell metacharacters in command args (use argument arrays, never shell strings).

6. STATE MANAGEMENT
   - All shared state in the central store, never scattered across agents.
   - No direct mutation — use explicit setter methods.
   - Emit an event for every side effect (append-only log). Checkpoint every N operations.

7. COST & BUDGET
   - Hard budget: $<AMOUNT> per run, enforced and non-overridable.
   - Per-agent cost tracking. Circuit-break (kill the task) when the budget is exceeded.

8. OBSERVABILITY
   - Every agent action -> a structured JSON event (latency, tokens, cost, confidence, success).
   - Health checks on external services. Real-time monitoring stream (SSE or equivalent).
```

## B. The agent contract (every agent obeys this)

```
INPUT
  - taskDef: { goal, context, constraints[] }
  - state:   the current central store
  - recall:  prior similar solutions from long-term memory

PROCESS
  1. Validate input -> sanitize -> bounds-check.
  2. Recall: query long-term memory by semantic similarity (fallback: keyword match).
  3. Execute: call the LLM through a fallback chain [PRIMARY -> FALLBACK_1 -> FALLBACK_2 -> LOCAL].
  4. Clean: parse output through a sanitizer (handle invalid JSON, truncation, escapes) —
     NEVER JSON.parse raw model output.
  5. Verify: self-check the output against the constraints.
  6. Emit: log decision + confidence + cost to the central event stream.
  7. Return a typed result.

OUTPUT (always typed JSON)
  { success, output, confidence: 0-1, cost_usd, latency_ms, reasoning, error }

PER-AGENT GUARDRAILS
  - Timeout per role (e.g. 180s Coder, 60s Researcher).
  - Max 3 retries, with feedback injected on each retry.
  - Token limit and output-size cap per role.
  - Parallel agents get isolation (git branch / exclusive lock).
```

## C. Reality files (the anti-drift source of truth)

```yaml
# reality/<subsystem>.yaml
subsystem: <name>
last_updated: YYYY-MM-DD
status: operational | experimental | partial

working:
  <feature>:
    reality: "what actually happens"
    confidence: 0.0-1.0

not_wired:
  <feature>:
    status: stub | partial | not_implemented
    blocker: "what's blocking it"

stubs_that_look_real:        # the most important section — these are what mislead operators
  <feature>:
    reality: "what it really returns (mock / static / fake)"
    risk: "how it could mislead"
    mitigation: "how to detect the stub"
```

The `stubs_that_look_real` section is the highest-value part: it is where you record the things that
*demo* as working but are not, so neither a human nor an agent mistakes the mock for the real thing.

## D. Scars & incidents (failure memory)

```
# scars.md  — one line per hard-won lesson
DATE | LESSON | FILES | FIX | NEVER-DO-AGAIN

# incidents/index.md — root-cause records
INC-YYYY-MMDD-NNN: <title>
  severity / status / root-cause / impact / resolution / prevention
```

Before generating, an agent loads recent relevant scars and injects them at the top of its prompt:
*"Historical failures — do not repeat these."* If the same failure fingerprint appears twice, escalate
from a hint to a hard STOP. This is the single highest-leverage memory in an autonomous system,
because the default failure of an unsupervised agent is to retry the same broken action forever.

## E. The recovery supervisor (runs every ~15s, deterministic)

```
loop():
  stuck     = tasks with no meaningful change in > STUCK_THRESHOLD (e.g. 240s)
  over_cost = tasks whose spend exceeded budget
  failed    = tasks in error/failed state

  for t in stuck|failed:
    classify(t)                       # provider_failure | truncation | deadlock | runtime
    apply_strategy(t)                 # fall through chain | request completion | break dep-lock
    if retries(t) >= 3: quarantine(t) # stop thrashing; optionally hard-rollback to a safe git tag

  for t in over_cost:
    kill(t); emit(incident)
```

Recovery is *bounded*: capped retries, capped recovery cost, then quarantine. A bounded loop is a
safe loop.

## F. The provider fallback chain

```
PRIMARY  (fast/cheap, your default)
  | on timeout or error
FALLBACK_1
  | on timeout or error
FALLBACK_2
  | on timeout or error
LOCAL (always-available, e.g. a local model) — the floor, so the system never goes fully dark
  | all fail
return { success: false }; emit incident
```

A provider with no key is skipped, so the same code degrades gracefully from a five-provider chain to
one. Trip a session circuit breaker on a provider that exhausts all its models, so you stop paying the
timeout tax on a dead provider.

## G. Minimum file layout

```
.<agent-config>/
├── system-rules        ← Section A (identity + core rules)
├── agents              ← Section B per-agent contracts
├── patterns            ← canonical code patterns
├── known-issues        ← recurring bugs + AI mistakes
├── forbidden           ← what NOT to do
└── rules/
    ├── memory-routing
    └── modification-policy
memory/
├── current-state.md    ← operator state (verified-working / partial / risks / last-known-good)
├── scars.md            ← Section D
├── incidents/
└── reality/            ← Section C (agents.yaml, providers.yaml, pipeline.yaml, <subsystem>.yaml)
```

## H. Customization checklist

```
[ ] <SYSTEM_NAME>, <DOMAIN>
[ ] central store (blackboard / Redis / other)
[ ] guardian module (the file/path safety layer)
[ ] $<AMOUNT> hard budget per run
[ ] agent roles + per-role timeout / token limit / output cap
[ ] recovery supervisor interval
[ ] provider fallback chain for your vendors
[ ] reality/ files for each of your subsystems
[ ] observability endpoints for your framework
```

---

## The one paragraph to remember

The model is the *least* reliable part of your system, and the only part you cannot make
deterministic. So you wrap it: reality files so it reads current truth instead of stale docs, durable
memory so it recalls solutions and avoids repeat failures, a recovery supervisor so failures are
bounded instead of infinite, a cost enforcer so spend is a hard limit instead of a surprise, and a
security contract so an agent that *acts* can't act dangerously. None of that is prompt engineering.
All of it is the harness. That is the difference between a great demo and a system you can leave
running.

---

## Read more

- [`README.md`](README.md) — the harness concept this template implements in full
- [`../../README.md`](../../README.md) — the four organs the harness wraps
- Production write-ups of these exact patterns (real engines, real incidents):
  [The Machine OS handbook](https://github.com/shubham0086/the-machine-os) →
  `WORKFLOWS/reality-driven-development`, `SYSTEMS/the-sovereign-sdlc-engine`,
  `SECURITY/agent-execution-safety`.
