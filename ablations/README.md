# Ablations — break it on purpose

The fastest way to understand what an organ *does* is to remove it and watch what
fails. Each script below is the full agent with exactly one organ taken out.

```bash
node ablations/no-memory.js   # forgets your name across turns      → continuity dies
node ablations/no-tools.js    # can't do 12 * 9, can only talk      → agency dies
node ablations/no-loop.js     # reaches for a tool, then freezes    → it's a chatbot
```

| Remove | What breaks | What it proves |
|--------|-------------|----------------|
| **Memory** | Forgets earlier turns | Memory = continuity across time |
| **Hands** (tools) | Can only talk, never act | Tools = the ability to affect the world |
| **Loop** | Can't use a tool result | The loop = the chatbot→agent line |

The takeaway: an agent isn't one thing, it's four things working together. Take
any one away and it collapses into something simpler — usually a plain chatbot.
