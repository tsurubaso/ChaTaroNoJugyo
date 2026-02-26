import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { Document } from "langchain/document"

async function main() {
  // LLM
  const llm = new ChatOllama({
    model: "mistral",
    temperature: 0,
  })

  // Embeddings
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  })

  // In-memory Vector Store
  const vectorStore = new MemoryVectorStore(embeddings)

  // --- Example: store something ---
  await vectorStore.addDocuments([
    new Document({
      pageContent: "User prefers Pizza and lives in Tokyo.",
    }),
  ])

  // --- User question ---
  const userInput = "Where does the user live now?"

  // 1️⃣ Retrieve relevant memory
  const relevantDocs = await vectorStore.similaritySearch(userInput, 3)

  const memoryContext = relevantDocs
    .map(doc => doc.pageContent)
    .join("\n")

  // 2️⃣ Create final prompt
  const finalPrompt = `
You are a helpful assistant.

Relevant past memory:
${memoryContext}

User question:
${userInput}

Answer clearly.
`

  // 3️⃣ Ask LLM
  const response = await llm.invoke(finalPrompt)

  console.log("\n=== ANSWER ===")
  console.log(response.content)

  // 4️⃣ Save current interaction
  await vectorStore.addDocuments([
    new Document({
      pageContent: `User asked: ${userInput}`,
    }),
  ])
}

main()