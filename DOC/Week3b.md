

Week2であなたは：

* Ollama + LangChain + ReAct Agent
* Toolを1つ（calculator）使える

ところまで来ました。

Week3ではこう進化します：

**Toolが増える**
**記憶（Memory）が入る**
**複数ステップの仕事ができる**

つまり：

「調べて → 計算して → まとめて答える」

本物の秘書Agentです。

---

# Week3：AI Agentを現実にする（Web + Memory）

---

## Week3のゴール

最終的にこうなります：

ユーザー：

「富士山の高さを調べて、東京タワー何個分か計算して」

Agent：

1. Web検索する
2. 高さを取得
3. 計算する
4. 結果をまとめて答える

これがWeek3です。

---

# Part A：Web Search Tool を追加する

まずToolを増やします。

---

## 1. Web検索Tool（axios版）

あなたはすでにaxiosを持っています。

`tools/webSearch.js`

```js
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
```

---

# Part B：Toolを2つにする

Week2ではcalculatorだけでした。

Week3では：

* calculator
* web_search

両方使います。

---

## agent.js（Week3版）

```js
import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { DynamicTool } from "@langchain/core/tools"

import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import { webSearchTool } from "./tools/webSearch.js"

async function main() {
  // LLM
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // Calculator Tool
  const calculator = new DynamicTool({
    name: "calculator",
    description: "Math calculator. Input should be like 2+2 or 1000/3.",
    func: async (input) => {
      return String(eval(input))
    },
  })

  // Tools
  const tools = [calculator, webSearchTool]

  // Prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are an AI agent.

You can use these tools:

{tools}

Tool names: {tool_names}

When you need fresh information, use web_search.
When you need math, use calculator.

Use ReAct format:

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

  // Agent
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

  // Run test
  const result = await executor.invoke({
    input: "富士山の高さを調べてください",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
```

---

## 実行

```bash
node agent.js
```

AIが：

* web_search を選ぶ
* 調べる
* 答える

これで「現実世界に接続」です。

---

# Part C：Memoryを入れる（Week3の核心）

ここから秘書になります。

---

## Memoryとは？

Agentが覚える：

* ユーザーの好み
* 前の質問
* プロジェクトの流れ

---

## Conversation Memoryを追加

インストール：

```bash
npm install langchain
```

（すでにOK）

---

## agent_memory.js

```js
import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { DynamicTool } from "@langchain/core/tools"
import { webSearchTool } from "./tools/webSearch.js"

import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import { BufferMemory } from "langchain/memory"

async function main() {
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  const calculator = new DynamicTool({
    name: "calculator",
    description: "Math calculator tool.",
    func: async (input) => String(eval(input)),
  })

  const tools = [calculator, webSearchTool]

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are an AI agent with memory.

{tools}
Tool names: {tool_names}

Conversation history:
{history}

Use ReAct format.
`,
    ],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ])

  // ✅ Memory
  const memory = new BufferMemory({
    memoryKey: "history",
    returnMessages: true,
  })

  const agent = await createReactAgent({
    llm,
    tools,
    prompt,
  })

  const executor = new AgentExecutor({
    agent,
    tools,
    memory,
    verbose: true,
  })

  // Conversation
  console.log("---- First question ----")
  console.log(
    await executor.invoke({ input: "私は東京に住んでいます" })
  )

  console.log("---- Second question ----")
  console.log(
    await executor.invoke({ input: "私が住んでいる都市はどこ？" })
  )
}

main()
```

---

# Week3で到達した世界

あなたのAgentはもう：

* Web検索できる
* 計算できる
* 会話を覚えられる
* 複数ステップが可能

つまり：

**AI秘書のプロトタイプ完成です**

---

# chaTaro先生の質問😊

次の最強ステップはこれです：

1. 「検索→計算→まとめ」を1つの質問でやらせる
2. Memoryをファイル保存して永続化する
3. Toolを増やしてメールやDB操作に進む

どれに行きましょう？
