# Part 3 : The Hands (Tools)

**The difference between *talking about* doing something and *doing* it.**

We give the agent a `calculator` tool. Now it can reach for it when asked to
compute. But run the demo and notice the catch:

```bash
node demo.js
```

It *grabs* the tool and then freezes. Using a tool is a three-beat move :
**call → read the result → respond** : and that requires more than one step.
Hands without a loop reach but can't finish. That's exactly what the last organ
fixes.

➡ [Part 4 : The Loop](../4-the-loop/)
