// ABLATION — remove the LOOP. It has tools and memory, but it can't act on a tool
// result. It reaches for the calculator and freezes. This is the chatbot line.
const { runScript } = require('../shared/agent');
runScript('Full agent MINUS loop', { useMemory: true, useTools: true, useLoop: false });
