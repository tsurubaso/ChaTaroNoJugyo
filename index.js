import { exec } from "child_process";

async function parseWithLLM(text) {
  const prompt = `
Extract 3D parameters.

Return ONLY valid JSON.

{
  "shape": "cube | sphere | cylinder",
  "size": number,
  "color": [r, g, b]
}

Color must be RGB values between 0 and 1.

Sentence:
"${text}"
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  const raw = data.response;

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid JSON from LLM");

  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const input = process.argv.slice(2).join(" ");

  const { shape, size, color } = await parseWithLLM(input);

  exec(
    `blender --background --python generate5.py -- ${shape} ${size} ${color[0]} ${color[1]} ${color[2]}`,
    (error) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("Blender finished.");
      console.log(`${shape} ${size} ${color[0]} ${color[1]} ${color[2]}`)
    }
  );
}

main();