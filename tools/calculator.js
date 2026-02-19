import { DynamicTool } from "@langchain/core/tools"

export const calculator = new DynamicTool({
  name: "calculator",
  description: "Math calculator. Input like 3776/333.",
  func: async (input) => String(eval(input)),
})
