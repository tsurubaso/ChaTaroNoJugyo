# Week2：AI AgentにToolを持たせる（本格版）

こんにちは、chaTaro先生です。
Week2ではついに「AIが道具（Tool）を使う」段階に入ります。

Week1ではAI（LLM）を動かしました。
でもAIは言葉を生成するだけで、現実の作業はできません。

そこでWeek2のテーマはこれです：

**AI + Tools = Agent**

つまり：

* AIが考える
* 必要ならToolを使う
* 結果を見て答える

これが「AI Agent」です。

---

## Week2のゴール

今回の最終ゴールは：

ユーザー：「2+10を計算してください」
AI：「計算が必要だ」
→ calculator tool を呼ぶ
→ 結果を受け取る
→ Final Answer を返す

if文で決めるのではなく、

**AIが自分でToolを選ぶ**

ここが本格的です。

---

## なぜTool Callingが難しいのか？

最初に私たちは `createToolCallingAgent` を試しました。

しかしOllama + Mistralは

* OpenAIのFunction Callingのような仕組みを持っていない

そのため：

Tool Calling Agentは動きませんでした。

---

## 解決策：ReAct Agent

Open Source環境で現実的なのはこれです：

**ReAct Agent**

ReActとは：

Reason（考える）
Action（道具を使う）
Observation（結果を見る）

この流れでAIが動きます。

AIは文章でこう書きます：

* Thought: 計算が必要だ
* Action: calculator
* Action Input: 2+10
* Observation: 12
* Final Answer: 答えは12です

LangChainがこの形式を読み取り、Toolを実行します。

---

# 実際に動くコード（Week2完成版）

以下があなたが成功した「本物のAgentコード」です。

---

## agent.js（ReAct + Ollama + Tool）

```js
import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { DynamicTool } from "@langchain/core/tools"

import { createReactAgent, AgentExecutor } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

async function main() {
  // 1. LLM（頭脳）
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // 2. Tool（道具）
  const calculator = new DynamicTool({
    name: "calculator",
    description: "Math calculator. Input should be like 2+2 or 10*5.",
    func: async (input) => {
      return String(eval(input))
    },
  })

  const tools = [calculator]

  // 3. ReAct Prompt（Agentのルール）
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are an AI agent.

You can use the following tools:

{tools}

Tool names: {tool_names}

Use this format:

Question: the input question
Thought: think step by step
Action: the tool name
Action Input: the input for the tool
Observation: the tool result
... (repeat if needed)
Final Answer: the final answer to the user
`,
    ],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ])

  // 4. Agent作成（ReAct）
  const agent = await createReactAgent({
    llm,
    tools,
    prompt,
  })

  // 5. Executor（実行管理）
  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  })

  // 6. 実行
  const result = await executor.invoke({
    input: "2+10を計算してください",
  })

  console.log("\n=== FINAL ANSWER ===")
  console.log(result.output)
}

main()
```

---

# 実行結果

実行すると：

```json
"output": "The answer to your question is 12."
```

成功です。

---

# Week2で学んだことまとめ

あなたはWeek2で以下を達成しました：

* Toolとは何か理解した
* AIがToolを使う必要性を学んだ
* OllamaはFunction Calling非対応だと理解した
* ReAct形式ならOpen SourceでAgentが動くと分かった
* LangChainで本物のAgentループを作った

つまり：

**あなたは本当にAI Agent開発を始めました**

---

# 次のWeek3でやること

Week2でToolが1つ動きました。

Week3では：

* Web検索Tool追加
* Toolを複数にする
* Memoryを入れる
* 複数ステップタスクをやらせる

最終的には：

「AI秘書」に進化します。

---

## chaTaro先生から一言😊

ここまで来た学生は少ないです。
あなたは本当に強いです。

次は自然です：

**Web検索Toolを追加してAgentを現実世界につなげましょう。**

[Week 3](Week3b.md)
