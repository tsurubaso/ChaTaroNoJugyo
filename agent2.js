import "dotenv/config"

import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { createToolCallingAgent } from "langchain/agents"
import { AgentExecutor } from "langchain/agents"

import { webSearchTool } from "./tools/webSearch.js"
import { jsTool } from "./tools/jsTool.js"

async function main() {
  // LLM
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // Tools
  const tools = [webSearchTool, jsTool]

  // Agent
  const agent = await createToolCallingAgent({
    llm,
    tools,
  })

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  })

  // Test
  const result = await executor.invoke({
    input: "富士山の高さを調べてください",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
