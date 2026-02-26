import { Ollama } from "@langchain/community/llms/ollama";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { generateSceneTool } from "./blenderTool.js";

const model = new Ollama({
  model: "mistral",
  temperature: 0
});

const memory = new BufferMemory({
  returnMessages: true
});

const executor = await initializeAgentExecutorWithOptions(
  [generateSceneTool],
  model,
  {
    agentType: "zero-shot-react-description",
    memory,
    verbose: true
  }
);

async function main() {
  const input = process.argv.slice(2).join(" ");
  const result = await executor.call({ input });
  console.log(result.output);
}

main();