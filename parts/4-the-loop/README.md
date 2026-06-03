# Part 4 — The Loop

**The organ that makes it an agent.**

The loop lets the agent take more than one step: call a tool, read what came
back, decide what to do next, and only then answer. With the loop in place, all
four organs work together and the calculator question finally gets answered.

```bash
node demo.js
```

> **The one-line definition this whole repo is built around:**
> an **agent = brain (LLM) + hands (tools) + memory + loop**. Remove the loop and
> you're back to a chatbot — no matter how many tools you bolt on.

➡ Now break it on purpose: [the ablations](../../ablations/)
