import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { DynamicTool } from "@langchain/core/tools"

import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import { wikiTool } from "./tools/wiki.js"

async function main() {
  // LLM
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // Calculator Tool
  const calculator = new DynamicTool({
    name: "calculator",
    description: "Math calculator. Input should be like 2+2 or 1000/3.",
    func: async (input) => {
      return String(eval(input))
    },
  })

  // Tools
  const tools = [calculator, wikiTool]

  // Prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are an AI agent.

You can use these tools:

{tools}

Tool names: {tool_names}

When you need fresh information, use web_search.
When you need math, use calculator.

Use ReAct format:

Question: ...
Thought: ...
Action: ...
Action Input: ...
Observation: ...
Final Answer: ...
`,
    ],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ])

  // Agent
  const agent = await createReactAgent({
    llm,
    tools,
    prompt,
  })

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  })

  // Run test
  const result = await executor.invoke({
    input: "富士山の高さを調べてください",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
