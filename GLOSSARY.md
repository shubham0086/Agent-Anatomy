# Glossary: the words people use interchangeably (and shouldn't)

**Chatbot:** A brain with a conversation. It talks. It may remember the chat,
but it doesn't take actions in the world and doesn't run multi-step loops on its
own. ChatGPT in a text box is a chatbot.

**Assistant:** A fuzzy marketing word. Usually a chatbot with some tools bolted
on. Whether it's actually an *agent* depends on one question: does it loop?

**Tool / Function call:** The **hands**. A capability the model can invoke
(search, calculate, send an email, hit an API) to affect something outside the
conversation.

**Memory:** Anything that survives between turns or sessions. Short-term (this
conversation) or long-term (across sessions). Without it, the system is a
goldfish.

**The loop (agent loop):** The model takes a step, observes the result, and
decides the next step, repeatedly, until it's done. This is the single feature
that separates an agent from a chatbot.

**Agent:** **brain + hands + memory + loop.** It decides its own steps at
runtime instead of following a script. (See the **AI-systems-evolution** repo,
rung 03, for where this sits on the bigger ladder.)

**Workflow:** LLM calls arranged on a path a *human* wrote. Looks agent-ish, but
the control flow is fixed. (Rung 02 in AI-systems-evolution.)

**Multi-agent / agentic team:** Several agents with roles, coordinated by an
orchestrator over shared state. (Rung 04.)

**Swarm:** Many peer agents with no central controller; coordination emerges.
(Rung 05.)

---

### The one test that cuts through all of it
> *Does the system decide its own next step at runtime, and can it take more than
> one?* If yes → agent. If a human wrote the steps → workflow. If it answers once
> and stops → chatbot.
