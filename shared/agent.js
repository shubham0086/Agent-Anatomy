// ONE agent, FOUR organs you can switch on or off:
//
//   brain  — always on (the LLM itself). Without the others, that's all there is.
//   memory — recall facts across turns       (useMemory)
//   hands  — call tools to act on the world   (useTools)
//   loop   — take more than one step          (useLoop)
//
// Toggle the flags and watch the behavior change. That's the whole repo.

const { llm } = require('./llm');
const { TOOLS, runTool } = require('./tools');
const { Memory } = require('./memory');

function createAgent({ useMemory = false, useTools = false, useLoop = false } = {}) {
  const memory = new Memory();

  async function handle(userInput) {
    const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];

    // MEMORY: inject what we remember before answering.
    if (useMemory) messages.push({ role: 'system', content: `Known facts: ${memory.dump()}` });
    messages.push({ role: 'user', content: userInput });

    const tools = useTools ? TOOLS : undefined; // HANDS
    const maxSteps = useLoop ? 4 : 1; // LOOP

    let reply;
    for (let step = 0; step < maxSteps; step++) {
      reply = await llm(messages, { tools });
      messages.push(reply);

      if (reply.tool_calls && reply.tool_calls.length) {
        if (!useLoop) {
          // Hands without a loop: it reaches for the tool but can't act on the result.
          reply = { content: '(no loop) I reached for a tool, but without the loop organ I can\'t use the result.' };
          break;
        }
        for (const c of reply.tool_calls) {
          messages.push({ role: 'tool', tool_call_id: c.id, content: runTool(c) });
        }
        continue; // loop again with the tool result in context
      }
      break; // a normal answer — done
    }

    // MEMORY: store any new facts for next turn.
    if (useMemory) memory.learn(userInput);
    return reply.content;
  }

  return { handle };
}

// Run the same 3-turn script through any configuration.
async function runScript(label, config) {
  const agent = createAgent(config);
  const turns = ['Remember that my name is Alex.', 'What is my name?', 'What is 12 * 9?'];
  const organs = Object.entries(config).filter(([, v]) => v).map(([k]) => k.replace('use', '').toLowerCase());
  console.log(`\n=== ${label} ===`);
  console.log(`organs on: brain${organs.length ? ' + ' + organs.join(' + ') : ' only'}`);
  for (const t of turns) {
    console.log(`  you   ▸ ${t}`);
    console.log(`  agent ▸ ${await agent.handle(t)}`);
  }
}

module.exports = { createAgent, runScript };
