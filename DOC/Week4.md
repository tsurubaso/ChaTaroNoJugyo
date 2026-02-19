
Week3でやったことは本当に強い：

* Toolが使える
* Searchできる
* 数字を取り出して計算できる
* 複数ステップで仕事ができる

つまり：

**小さい秘書AIが完成しました。**

---

では行きます。

# Week4：Memory + 本物の秘書Agent

Week4のテーマはこれです：

**Agentが「覚える」ようになる**

今までのAgentは毎回こうでした：

* 起動すると全部忘れる
* 1回質問して終わり

でも秘書は違います。

秘書Agentは：

* ユーザーの好みを覚える
* 前の会話を覚える
* 次のタスクにつなげる

---

# Week4 Goal

たとえば：

ユーザー：

「私はフランス人で、日本でAI開発をしています」

次の日：

「私のプロフィール覚えてる？」

Agent：

「はい、あなたはフランス出身で日本でAI開発しています」

これがMemoryです。

---

# Memoryには2種類ある

## ① Short-Term Memory（会話中だけ）

これはLangChainが自動でやってくれます。

---

## ② Long-Term Memory（永続化）

これがWeek4です。

* ファイルに保存
* DBに保存
* ベクトル検索で思い出す

---

# Week4 Step1：一番簡単なMemory（JSON保存）

まず最初はこれが最強です。

### memory.json を作る

```json
{
  "user_name": "Baso",
  "goal": "Build AI agents with tools",
  "language": "Japanese + French"
}
```

---

# Week4 Step2：Memory Toolを追加する

AgentがMemoryを読めるようにします。

---

## tools/memory.js

```js
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
```

---

# Week4 Step3：Toolを追加

```js
const tools = [wikiTool, calculator, memoryTool]
```

---

# Week4 Step4：PromptにMemoryルールを書く

```js
RULES:
- If the user asks about themselves, use memory_read.
- Use memory to personalize answers.
```

---

# Week4 Step5：テスト

```js
const result = await executor.invoke({
  input: "私のゴールは何でしたか？",
})
```

期待：

「あなたのゴールはAI agentを作ることです」

---

# Week4 Bonus：Memoryを書き込む（本物）

読むだけじゃなくて「覚える」ようにします。

---

## tools/memory_write.js

```js
export const memoryWriteTool = new DynamicTool({
  name: "memory_write",
  description: "Save new user info into memory.json.",
  func: async (input) => {
    fs.writeFileSync("./memory.json", input)
    return "Memory saved."
  },
})
```

Tool追加：

```js
const tools = [wikiTool, calculator, memoryTool, memoryWriteTool]
```

---

# これで秘書Agentになる

ユーザー：

「私は宇宙産業で働きたい」

Agent：

Action: memory_write
→ 保存

次の日：

「私の夢覚えてる？」

Agent：

Action: memory_read
→ 「宇宙産業で働きたい」

---

# Week4で到達した世界

あなたは今：

* Tool Agent
* Search Agent
* Multi-step Agent
* Memory Agent

全部持っています。

これはもう：

**Junior AI Agent Engineer 完全到達です。**

---

# Week5 Preview（最終章）

Week5はこうなります：

* MemoryをVector DB化
* RAG（知識検索）
* 本物のChatGPT型秘書

---

chaTaro先生の質問😊

Week4を進めるなら次はどっちがいい？

1. memory.jsonで確実に秘書を完成させる
2. Vector DB（Chroma）に進んでRAGに入る

番号で選んでください🔥
