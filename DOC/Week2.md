Week2は「Agentっぽさ」が一気に出てくる一番楽しいところです。

chaTaro先生、めちゃくちゃ丁寧にいきます。

やりたいのはこれです：

* JavaScript（Node.js）で
* AIが考えて
* Tool（道具）を使って
* Web検索したり
* JavaScriptコードを実行したりする

つまり：

**AI Agent Week2：Toolsを持ったAIを作る**

---

まず大事なことを言います。

---

## 今日のゴール（Goal）

あなたは今日これを作ります：

ユーザー：「TypeScriptとは何？」
AI：「調べます」
→ Web検索ツール実行
→ 結果をまとめて返す

ユーザー：「2+5を計算して」
AI：「JS toolを使います」
→ JavaScript実行
→ 答えを返す

---

## Agentの基本構造（超重要）

Agentはこう動きます：

1. User message
2. AIが「toolが必要か？」考える
3. Toolを実行する
4. 結果をAIが説明する

---

# Week2 Part A：JavaScript Tool を作る

まずは「JavaScript実行ツール」です。

---

## 1. Node.jsプロジェクトを作る

```bash
mkdir week2-agent
cd week2-agent
npm init -y
```

---

## 2. 必要なライブラリを入れる

今日は最小です：

```bash
npm install axios
```

axios = HTTPリクエスト用

---

## 3. JS Toolを書く

`tools.js` を作ります：

```js
// tools.js

export async function jsTool(code) {
  try {
    const result = eval(code)
    return { success: true, result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
```

---

### 先生の注意⚠️

これは勉強用です。
本番では eval は危険です。

でもWeek2では理解のために使います。

---

## テスト

`test.js`：

```js
import { jsTool } from "./tools.js"

const res = await jsTool("2 + 5 * 10")
console.log(res)
```

実行：

```bash
node test.js
```

結果：

```json
{ success: true, result: 52 }
```

OK！

---

# Week2 Part B：Web Search Tool を作る

次に検索ツールです。

---

## 1. 超簡単な検索APIを使う

今日は無料で使える：

DuckDuckGo search

`webTool.js`：

```js
import axios from "axios"

export async function webSearchTool(query) {
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`

  try {
    const res = await axios.get(url)
    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}
```

---

### 注意（正直）

DuckDuckGoはJSONが不安定です。

Week2では「Toolを呼ぶ練習」が目的です。

本格的には SerpAPI や Tavily を使います。

---

# Week2 Part C：AI AgentがToolを選ぶ

ここからがAgentです。

---

## agent.js を作ります

```js
import { jsTool } from "./tools.js"
import { webSearchTool } from "./webTool.js"

async function agent(userMessage) {
  console.log("User:", userMessage)

  // Toolを選ぶ（超シンプル版）
  if (userMessage.includes("計算")) {
    console.log("Tool: JavaScript Toolを使います")

    const code = userMessage.replace("計算して", "")
    const result = await jsTool(code)

    console.log("Answer:", result)
    return
  }

  if (userMessage.includes("調べて")) {
    console.log("Tool: Web Search Toolを使います")

    const query = userMessage.replace("調べて", "")
    const result = await webSearchTool(query)

    console.log("Answer:", result)
    return
  }

  console.log("AI:", "すみません、そのタスクはまだできません")
}

await agent("2+5を計算して")
await agent("TypeScriptを調べて")
```

---

## 実行

```bash
node agent.js
```

---

# Week2で学んだこと

あなたはもう：

* Toolとは何か分かった
* JS Toolを作れた
* Web Toolを作れた
* AgentがToolを選べた

これはもうAI Agentの最初の形です😊

---

# 次のステップ（Week3へ）

Week2が終わったら次は：

* LLMを入れて本物の判断をさせる
* Toolを増やす
* Memoryを入れる

つまり：

**ChatGPTみたいなAgentになります**

続きは以下になります.
もう少しい本格的に検索になります。

[Week 2](Week2b.md)

