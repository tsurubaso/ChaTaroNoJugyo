import { DynamicTool } from "@langchain/core/tools"


export const memoryWriteTool = new DynamicTool({
  name: "memory_write",
  description: "Save new user info into memory.json.",
  func: async (input) => {
    fs.writeFileSync("./memory.json", input)
    return "Memory saved."
  },
})
