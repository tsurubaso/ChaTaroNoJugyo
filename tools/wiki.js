import axios from "axios"
import { DynamicTool } from "@langchain/core/tools"

export const wikiTool = new DynamicTool({
  name: "wikipedia_search",
  description: "Search Wikipedia and return a short summary.",
  func: async (query) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      query
    )}`

    const res = await axios.get(url)
    return res.data.extract
  },
})
