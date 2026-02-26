import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { DynamicTool } from "@langchain/core/tools"

import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

async function main() {
  // LLM (Ollama)
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // Tool
  const calculator = new DynamicTool({
    name: "calculator",
    description: "Math calculator. Input should be like 2+2 or 10*5.",
    func: async (input) => {
      return String(eval(input))
    },
  })

  const tools = [calculator]

  // ✅ Correct ReAct Prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are an AI agent.

You can use the following tools:

{tools}

Tool names: {tool_names}

Use this format:

Question: the input question
Thought: think step by step
Action: the tool name
Action Input: the input for the tool
Observation: the tool result
... (repeat if needed)
Final Answer: the final answer to the user
`,
    ],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ])

  // ReAct Agent
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

  // Run
  const result = await executor.invoke({
    input: "2+10を計算してください",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
