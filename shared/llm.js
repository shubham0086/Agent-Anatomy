// Provider-agnostic LLM call. MOCK by default so the repo runs with zero setup.
// Flip to a real model: LLM_MOCK=0 + an OpenAI-compatible endpoint (Ollama etc).
// See SETUP.md.

const MOCK = process.env.LLM_MOCK !== '0';
const BASE_URL = process.env.LLM_BASE_URL || 'http://localhost:11434/v1';
const MODEL = process.env.LLM_MODEL || 'llama3.2';
const API_KEY = process.env.LLM_API_KEY || 'ollama';

async function llm(messages, { tools } = {}) {
  if (MOCK) return mock(messages, tools);
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, tools, temperature: 0.2 }),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  return (await res.json()).choices[0].message;
}

// ---- Mock brain: just enough behavior to make each organ's effect visible ----
function mock(messages, tools) {
  const all = messages.map((m) => m.content || '').join('\n');
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const u = (lastUser && lastUser.content ? lastUser.content : '').toLowerCase();
  const hasToolResult = messages.some((m) => m.role === 'tool');
  const mathMatch = u.match(/-?\d+\s*[*+\-/]\s*-?\d+/);

  // Needs the HANDS (a tool) to do arithmetic.
  if (mathMatch) {
    if (tools && tools.length && !hasToolResult) {
      return {
        role: 'assistant', content: null,
        tool_calls: [{ id: 'c1', type: 'function', function: { name: 'calculator', arguments: JSON.stringify({ expression: mathMatch[0] }) } }],
      };
    }
    if (hasToolResult) {
      const r = [...messages].reverse().find((m) => m.role === 'tool');
      return { role: 'assistant', content: `The answer is ${r.content}.` };
    }
    return { role: 'assistant', content: "I can't do arithmetic on my own — I'd need a calculator tool (hands)." };
  }

  // Stating a fact ("my name is X") — check before the recall question below.
  if (/name is/.test(u)) return { role: 'assistant', content: 'Nice to meet you, Alex!' };

  // Needs MEMORY to recall earlier turns.
  if (/my name/.test(u)) {
    const m = all.match(/name=(\w+)/i);
    return { role: 'assistant', content: m ? `Your name is ${m[1]}.` : "I don't know — I have no memory of you telling me." };
  }

  return { role: 'assistant', content: "I'm a brain (an LLM). I can reason and talk — but alone I have no hands, no memory, and I answer only once." };
}

module.exports = { llm, MOCK, MODEL };
