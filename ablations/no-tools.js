// ABLATION — remove the HANDS (tools). It remembers and can loop, but it can only
// talk: arithmetic is now impossible. Agency dies.
const { runScript } = require('../shared/agent');
runScript('Full agent MINUS hands', { useMemory: true, useTools: false, useLoop: true });
