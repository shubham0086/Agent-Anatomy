# Part 2 : The Memory

**What turns a goldfish into something that learns about you.**

We inject what the agent knows back into its context before each answer, and we
store new facts after. Now "what is my name?" works. Without this organ, every
turn starts from zero.

```bash
node demo.js
```

**Real memory in the wild:** ChatGPT's "Memory" feature (stores facts about you across sessions). Claude Projects (your instructions persist across conversations). Note: a long context window is *not* memory. Giving the model 200,000 tokens just means it reads more text per turn. Memory means something survives after the conversation ends and is recalled in a future one. Without memory, every chat — even with the smartest model — starts from zero.

This tiny `Memory` class is the toy version of a real idea. A production memory
layer (persistence across sessions, recall ranking, drift control) is an entire
engine : see the **agentkernel** repo.

➡ [Part 3 : The Hands](../3-the-hands/)
