import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import { wikiTool } from "../tools/wiki.js"
import { calculator } from "../tools/calculator.js"
import { memoryTool } from "../tools/memory.js"
import { memoryWriteTool } from "../tools/memory_write.js"
async function main() {
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

const tools = [wikiTool, calculator, memoryTool, memoryWriteTool]



  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are a smart AI assistant.

You have access to these tools:

{tools}
Tool names: {tool_names}

RULES (Important):

1. Decide first:

   * If a tool is needed → choose an Action.
   * If no tool is needed → go to rule 7.

2. When choosing an Action:

   * Action must be one of the tool names.
   * Never write: Action: None
   * Write only:
     Action: tool_name
     Action Input: ...
   * After writing Action, STOP.
     Do NOT write Final Answer.
     Wait for Observation.

3. If the user asks about themselves or past info, use:
   Action: memory_read

4. If the user says "remember this", use:
   Action: memory_write

5. If the question needs factual information (height, date, etc.), use:
   Action: wikipedia_search

6. If math is required, ALWAYS use:
   Action: calculator
   Extract numbers carefully before calculating.

7. If no tool is needed, respond directly with:
   Final Answer: ...

8. Never write Action and Final Answer in the same step.



Use ReAct format except in the case that no tool is necessary, go for rule 7 instead :

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
  input: "remember this I really love Pizza, I love Paris also",
})

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
