import { DynamicTool } from "@langchain/core/tools"
import vm from "node:vm"

export const jsTool = new DynamicTool({
  name: "javascript_calculator",
  description: "Math calculation tool. Input must be a math expression like 2+5*10",
  func: async (input) => {
    const result = vm.runInNewContext(input)
    return String(result)
  },
})
