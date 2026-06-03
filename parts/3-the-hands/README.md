# Part 3 : The Hands (Tools)

**The difference between *talking about* doing something and *doing* it.**

We give the agent a `calculator` tool. Now it can reach for it when asked to
compute. But run the demo and notice the catch:

```bash
node demo.js
```

It *grabs* the tool and then freezes. Using a tool is a three-beat move :
**call → read the result → respond** : and that requires more than one step.
**Real hands in the wild:** Claude's computer use (moves a cursor, clicks, types — literal hands). ChatGPT's web browsing and code interpreter. Cursor reading and editing files in your project. Perplexity fetching live search results. Any time an AI "does" something outside the conversation window — runs code, reads a URL, calls an API — that is the hands organ. A model without hands can only talk about doing things.

Hands without a loop reach but can't finish. That's exactly what the last organ
fixes.

➡ [Part 4 : The Loop](../4-the-loop/)
