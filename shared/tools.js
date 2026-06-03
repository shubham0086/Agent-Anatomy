// THE HANDS. Tools let the agent act on the world instead of only talking.

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a simple arithmetic expression like "12 * 9".',
      parameters: { type: 'object', properties: { expression: { type: 'string' } }, required: ['expression'] },
    },
  },
];

function calc(expr) {
  const m = String(expr).match(/(-?\d+)\s*([*+\-/])\s*(-?\d+)/);
  if (!m) return 'NaN';
  const a = +m[1], b = +m[3];
  return String({ '*': a * b, '+': a + b, '-': a - b, '/': b ? a / b : NaN }[m[2]]);
}

function runTool(call) {
  const args = JSON.parse(call.function.arguments);
  if (call.function.name === 'calculator') return calc(args.expression);
  return 'unknown tool';
}

module.exports = { TOOLS, runTool };
