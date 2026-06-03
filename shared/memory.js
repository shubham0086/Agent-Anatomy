// THE MEMORY. Without it, every turn starts from zero — the agent is a goldfish.
// This is a deliberately tiny store; the real version of this idea is a whole
// engine (see the agentkernel repo's memory engine).

class Memory {
  constructor() { this.facts = {}; }

  // Extract durable facts from what the user said.
  learn(text) {
    const m = text.match(/name is (\w+)/i);
    if (m) this.facts.name = m[1];
  }

  // What the agent "remembers", injected back into context.
  dump() {
    const entries = Object.entries(this.facts);
    return entries.length ? entries.map(([k, v]) => `${k}=${v}`).join(', ') : '(nothing yet)';
  }
}

module.exports = { Memory };
