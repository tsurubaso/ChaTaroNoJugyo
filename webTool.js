import axios from "axios";

export async function webTool(query) {
  await console.log("Web Tool: Searching for", query);
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  
  try {
    const res = await axios.get(url);
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    return {
        query: query,
        url: url,
      success: false,
      error: err.message,
    };
  }
}
