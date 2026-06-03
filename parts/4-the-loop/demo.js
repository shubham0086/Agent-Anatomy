// PART 4 — + THE LOOP. The final organ. Now the agent can call a tool, read the
// result, and respond. All four organs present = a complete agent. This is the
// line between "a chatbot" and "an agent".
const { runScript } = require('../../shared/agent');
runScript('Full agent (brain + memory + hands + loop)', { useMemory: true, useTools: true, useLoop: true });
