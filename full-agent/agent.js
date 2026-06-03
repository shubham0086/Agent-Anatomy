// THE COMPLETE AGENT — all four organs assembled.
//   brain (LLM) + memory + hands (tools) + loop
// Run this, then run the ablations/ to see what breaks when you remove one.
const { runScript } = require('../shared/agent');
runScript('Complete agent', { useMemory: true, useTools: true, useLoop: true });
