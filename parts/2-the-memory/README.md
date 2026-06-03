# Part 2 : The Memory

**What turns a goldfish into something that learns about you.**

We inject what the agent knows back into its context before each answer, and we
store new facts after. Now "what is my name?" works. Without this organ, every
turn starts from zero.

```bash
node demo.js
```

This tiny `Memory` class is the toy version of a real idea. A production memory
layer (persistence across sessions, recall ranking, drift control) is an entire
engine : see the **agentkernel** repo.

➡ [Part 3 : The Hands](../3-the-hands/)
