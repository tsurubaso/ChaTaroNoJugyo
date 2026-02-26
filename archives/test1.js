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