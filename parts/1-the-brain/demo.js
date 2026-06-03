// PART 1 — THE BRAIN (the LLM alone). No memory, no hands, no loop.
// It can reason and talk. That's it. Watch it forget and fail to calculate.
const { runScript } = require('../../shared/agent');
runScript('Brain only', {});
