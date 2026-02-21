import fs from "fs"
import { DynamicTool } from "@langchain/core/tools"

export const memoryTool = new DynamicTool({
  name: "memory_read",
  description: "Read user memory from memory.json file.",
  func: async () => {
    const data = fs.readFileSync("./memory.json", "utf-8")
    return data
  },
})
