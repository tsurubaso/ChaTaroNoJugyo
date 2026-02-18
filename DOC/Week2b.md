

# 本格Toolで作るAI Agent（Real Version）

あなたが求めているのはこれです：

* LLMが「Toolを選ぶ」
* Toolを正しい形で呼ぶ
* 結果を見て次を決める

つまり：

**Function Calling / Tool Calling Agent**

---

# 今日の本物スタック（先生おすすめ）

Open Sourceで本格的にやります：

* Ollama（ローカルLLM）
* LangChain JS（Agent Framework）
* Tavily Search（本物の検索API）
* Tool Calling（function schema）

これが今一番現実的です。

---

# Step 0：必要なもの

確認：

* Node.js OK
* Ollama OK（動く状態）

まず：

```bash
ollama run mistral
```

これが動けば準備OKです。

---

# Step 1：本格ライブラリを入れる

プロジェクトで：

```bash
npm install langchain @langchain/community @langchain/core
npm install tavily-search
```

---

# Step 2：Tavily API Key を取る

TavilyはAgent用の検索で一番安定です。

サイト：

[https://tavily.com/](https://tavily.com/)

無料でキーがもらえます。

キーを `.env` に入れます：

```env
TAVILY_API_KEY=xxxxx
```

そして：

```bash
npm install dotenv
```

---

# Step 3：本物のWeb Search Tool

`tools/webSearch.js`

```js
import { TavilySearchResults } from "@langchain/community/tools/tavily_search"

export const webSearchTool = new TavilySearchResults({
  maxResults: 3,
})
```

これはもう本物です。

---

# Step 4：本物のJavaScript Tool

eval禁止。安全版。

`tools/jsTool.js`

```js
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
```

これが本格Toolです。

---

# Step 5：Ollama LLMをAgentに入れる

`agent.js`

```js
import "dotenv/config"

import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { createToolCallingAgent } from "langchain/agents"
import { AgentExecutor } from "langchain/agents"

import { webSearchTool } from "./tools/webSearch.js"
import { jsTool } from "./tools/jsTool.js"

async function main() {
  // LLM
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // Tools
  const tools = [webSearchTool, jsTool]

  // Agent
  const agent = await createToolCallingAgent({
    llm,
    tools,
  })

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  })

  // Test
  const result = await executor.invoke({
    input: "富士山の高さを調べてください",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
```

---

# Step 6：実行

```bash
node agent.js
```

するとこうなります：

* LLMが判断する
* webSearchToolを呼ぶ
* 結果を読む
* 日本語で答える

本物です。

---

# これが「ふりじゃないAgent」

あなたが欲しかったのはこれです：

* if文で選ぶのではない
* AIが自分でToolを選ぶ
* 本物の検索をする
* 本物の計算をする

---

# chaTaro先生の質問（超重要）

ここで止まる人が多いので確認します。

あなたは今：

✅ Ollamaは動いていますか？
（`ollama run mistral` が成功する？）

そして：

Tavily API Key は取れますか？

もしまだなら、先生は

* Tavilyなし版（無料Web検索）
* 完全ローカル版

も教えられます。

どっちがいいですか？

1. Tavilyで本格Web検索（おすすめ）
2. 完全ローカルだけでTool Agent（ネット無し）
