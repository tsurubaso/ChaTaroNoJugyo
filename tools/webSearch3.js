import axios from "axios"
import { DynamicTool } from "@langchain/core/tools"

export const webSearchTool = new DynamicTool({
  name: "web_search",
  description: "Search the web for factual information.",
  func: async (query) => {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json`

    const res = await axios.get(url)

    // 抽象文を返す
    return (
      res.data.AbstractText ||
      "No good abstract found. Try another query."
    )
  },
})
