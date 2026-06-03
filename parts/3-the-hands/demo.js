// PART 3 — + HANDS (tools). Now it CAN reach for the calculator... but notice it
// can't finish: using a tool means call → get result → respond, and that needs
// the loop. Hands without a loop = it grabs the tool and freezes. Motivates Part 4.
const { runScript } = require('../../shared/agent');
runScript('Brain + memory + hands (no loop yet)', { useMemory: true, useTools: true });
