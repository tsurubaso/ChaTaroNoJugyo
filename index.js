import { spawn } from "child_process";

async function parseWithLLM(text) {
  const prompt = `
Extract 3D parameters.

Return ONLY valid JSON.

{
  "shape": "cube | sphere | cylinder",
  "count": number,
  "size_base": number,
  "size_var": number,
  "color": [r, g, b],
  "color_var": number,
  "pattern": "line | circle"
}

Rules:
- RGB values between 0 and 1
- All numbers must be valid
- No explanation text

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
  const params = await parseWithLLM(input);

  const {
    shape,
    count,
    size_base,
    size_var,
    color,
    color_var,
    pattern,
  } = params;

  const blenderArgs = [
    "--background",
    "--python",
    "generate6.py",
    "--",
    shape,
    String(count),
    String(size_base),
    String(size_var),
    String(color[0]),
    String(color[1]),
    String(color[2]),
    String(color_var),
    pattern,
  ];

  console.log("PARAMS SENT TO BLENDER:");
console.log({
  shape,
  count,
  size_base,
  size_var,
  color,
  color_var,
  pattern
});

  const blender = spawn("blender", blenderArgs);

  blender.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  blender.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  blender.on("close", (code) => {
    console.log(`Blender exited with code ${code}`);
  });
}

main();