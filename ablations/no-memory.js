// ABLATION — remove MEMORY from the full agent. It can still use tools and loop,
// but it forgets your name across turns. Continuity dies.
const { runScript } = require('../shared/agent');
runScript('Full agent MINUS memory', { useMemory: false, useTools: true, useLoop: true });
