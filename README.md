<div align="center">

# Agent Anatomy — What Is an Agent, Really?

**One agent. Four organs. Switch each one off and watch it break.**

`brain (LLM)` + `hands (tools)` + `memory` + `loop` = agent

</div>

---

## The one-liner

An **agent** is not a model. It's a model (the **brain**) wired to three more
things: **hands** to act (tools), **memory** to carry state across turns, and a
**loop** to take more than one step. Take any one away and it collapses into
something simpler — usually a plain chatbot.

This repo lets you *feel* that. The same agent runs with organs added one at a
time, then with each one removed.

## See each organ added

```bash
node parts/1-the-brain/demo.js    # talks, but forgets & can't act
node parts/2-the-memory/demo.js   # now it remembers your name
node parts/3-the-hands/demo.js    # reaches for a tool... but freezes (no loop yet)
node parts/4-the-loop/demo.js     # full agent — finally completes the tool call
```

## Then break it on purpose

```bash
node ablations/no-memory.js   # forgets across turns      → continuity dies
node ablations/no-tools.js    # can only talk             → agency dies
node ablations/no-loop.js     # freezes mid-tool-use      → it's a chatbot
```

Zero setup: Node 18+, no dependencies, runs offline in mock mode. Flip to a real
model (Ollama or any OpenAI-compatible endpoint) with one env var — see
[`SETUP.md`](SETUP.md).

## Interactive version

Open [`web/index.html`](web/index.html): four toggle switches (brain / hands /
memory / loop). Flip one off and the live demo shows the broken behavior.

## Read

- [`GLOSSARY.md`](GLOSSARY.md) — chatbot vs. assistant vs. agent vs. workflow vs.
  swarm, settled with one test.
- [`ablations/README.md`](ablations/README.md) — what each organ proves.

## Where this sits

This is the **zoom-in** on a single agent. For the bigger picture — how a plain
script becomes a workflow, an agent, a team, and a swarm — see the companion repo
**[AI-systems-evolution](https://github.com/shubham0086/AI-systems-evolution)** (rung 03 is the agent
this repo dissects). For production-grade versions of memory, tools, and routing,
see **agentkernel** and **agentic-systems**.

---

<div align="center">

Built by [Shubham Prajapati](https://github.com/shubham0086) ·
[Portfolio](https://shubham0086.github.io/MyPortfolio.github.io/)
· MIT (code) · CC BY 4.0 (content)

</div>
