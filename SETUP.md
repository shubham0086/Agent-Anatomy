# Setup

## Requirements
- Node.js 18+ (built-in `fetch`, no dependencies, no `npm install`)

## Run it (zero setup, offline mock)
```bash
# the four organs, added one at a time
node parts/1-the-brain/demo.js
node parts/2-the-memory/demo.js
node parts/3-the-hands/demo.js
node parts/4-the-loop/demo.js

# the complete agent
node full-agent/agent.js

# break it on purpose
node ablations/no-memory.js
node ablations/no-tools.js
node ablations/no-loop.js
```

## Run it with a real model
```bash
# Ollama (free, local)
ollama pull llama3.2
LLM_MOCK=0 node full-agent/agent.js

# or any OpenAI-compatible endpoint
LLM_MOCK=0 LLM_BASE_URL=https://api.openai.com/v1 LLM_MODEL=gpt-4o-mini LLM_API_KEY=sk-... \
  node full-agent/agent.js
```

## Python parity
JavaScript is the reference implementation; a Python port is a welcome first
contribution (mirror `shared/` and the demos).
