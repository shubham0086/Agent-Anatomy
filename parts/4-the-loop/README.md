# Part 4 : The Loop

**The organ that makes it an agent.**

The loop lets the agent take more than one step: call a tool, read what came
back, decide what to do next, and only then answer. With the loop in place, all
four organs work together and the calculator question finally gets answered.

```bash
node demo.js
```

> **The one-line definition this whole repo is built around:**
> an **agent = brain (LLM) + hands (tools) + memory + loop**. Remove the loop and
> you're back to a chatbot : no matter how many tools you bolt on.

**The loop is what separates tools from agents.** Cursor in agent mode: edits the file, runs the tests, reads the error, edits again — nobody pressed anything between those steps. Devin: writes code, runs it in a sandbox, sees what breaks, keeps going. Open Interpreter: writes Python, executes it, reads the output, decides the next step. OpenClaw: reads a file, runs a shell command, checks the result, loops until the task is done — all locally on your machine. When you see an AI "keep going" without you prompting it — that is the loop organ. Every model you have ever used has a brain. Very few ship with a real loop wired in.

➡ Now break it on purpose: [the ablations](../../ablations/)
