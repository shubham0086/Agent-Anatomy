// PART 2 — + MEMORY. Now it remembers across turns. Ask its name and it knows.
// (Still no hands, so arithmetic still fails.)
const { runScript } = require('../../shared/agent');
runScript('Brain + memory', { useMemory: true });
