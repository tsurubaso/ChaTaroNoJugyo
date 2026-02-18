

今日はまず「AIエージェントとは何か」をNode.jsで形（かたち）にします。

目標（もくひょう）はこれです：

ユーザーが言う
→ AIが考える
→ 必要ならツールを使う
→ 答える

これがエージェントの基本です。

---

## 1. 今日つくるもの（最初のミニAgent）

今日は超（ちょう）シンプルにします。

Agentの仕事：

* ユーザーの入力（にゅうりょく）を読む
* LLMに送る
* AIの返事を出す

つまり：

「しゃべるAI」

---

## 2. 必要なもの（ひつよう）

Node.jsでOpen sourceを使うなら、まずこれが一番かんたんです：

### Ollama（オラマ）

OllamaはローカルでLLMを動かせます。

例：

* mistral
* llama3
* gemma

---

## 3. Step 1：Ollamaを入れる

まずインストール：

[https://ollama.com](https://ollama.com)

入れたらターミナルで：

```bash
ollama run mistral
```

これでAIと会話できます。

---

## 4. Step 2：Node.jsプロジェクトを作る

新しいフォルダ：

```bash
mkdir agent01
cd agent01
npm init -y
```

---

## 5. Step 3：必要なライブラリ

OllamaとNodeをつなぐ：

```bash
npm install ollama
```

---

## 6. Step 4：最初のAgentコード

`index.js` を作ります：

```js
import ollama from "ollama";
import readline from "readline";

// ユーザー入力を読む準備
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// AIに質問する関数
async function askAgent(question) {
  const response = await ollama.chat({
    model: "mistral",
    messages: [
      { role: "system", content: "You are a helpful AI agent." },
      { role: "user", content: question },
    ],
  });

  console.log("\n🤖 Agent:", response.message.content);
}

// ループ（会話を続ける）
function start() {
  rl.question("\n🧑 You: ", async (input) => {
    if (input === "exit") {
      console.log("bye bye 👋");
      rl.close();
      return;
    }

    await askAgent(input);
    start();
  });
}

console.log("=== chaTaro Agent v0 ===");
console.log("Type 'exit' to stop.\n");

start();
```

---

## 7. 実行（じっこう）

ターミナルで：

```bash
node index.js
```

すると：

```
=== chaTaro Agent v0 ===
You:
```

あなたが入力するとAIが返します。

---

## 8. 今日のポイント

これはまだ「ただのチャット」です。

でも大事です。

エージェントの基本は：

1. Input（入力）
2. LLMでReasoning（考える）
3. Output（返す）

ここから次は：

* Toolを使わせる
* Memoryを入れる
* 自動で仕事をする

---

## 次の授業（じゅぎょう）

次は「道具（ツール）」を持つAgentにします。

例：

ユーザー：「今何時？」
Agent：「時計ツールを使う」
→ 正しい時間を返す

これが本物のAgentです。


