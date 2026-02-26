import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import { wikiTool } from "../tools/wiki.js"
import { calculator } from "../tools/calculator.js"

async function main() {
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  const tools = [wikiTool, calculator]

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are a smart AI assistant.

You have access to these tools:

{tools}
Tool names: {tool_names}

RULES:
- When a question needs factual numbers, use wikipedia_search.
- When you need math, ALWAYS use calculator.
- Extract numeric values carefully before calculating.

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

  const result = await executor.invoke({
    input: "富士山の高さは東京タワー何個分ですか？",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
