import { jsTool } from "./tools.js";

import { webTool } from "./webTool.js";

async function agent(userMessage) {
  // Toolを選ぶ（超シンプル版）
  if (userMessage.includes("計算")) {
    console.log("Tool: JavaScript Toolを使います");

    const code = userMessage.replace("計算して", "");
    const result = await jsTool(code);
    console.log("User:", userMessage);
    console.log("Answer:", result);
    return;
  }

  if (userMessage.includes("を調べて")) {
    console.log("Tool: Web Search Toolを使います");

    const query = userMessage.replace("を調べて", "");
    console.log("Query:", query);
    const result = await webTool(query);

    console.log("Answer:", result);
    return;
  }

  console.log("AI:", "すみません、そのタスクはまだできません");
}

await agent("JavaScript Hello World を調べて");
