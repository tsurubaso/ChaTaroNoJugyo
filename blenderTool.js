import { DynamicTool } from "@langchain/core/tools";
import { runBlender } from "./runBlender.js";

export const generateSceneTool = new DynamicTool({
  name: "generate_scene",
  description: `
Generate or update a Blender 3D scene.
Input must be JSON string with:
{
  "objects": [
    {
      "shape": "cube | sphere | cylinder",
      "size": number,
      "color": [r,g,b],
      "position": [x,y,z]
    }
  ]
}
`,
  func: async (input) => {
    const parsed = JSON.parse(input);
    const result = await runBlender(parsed);
    return JSON.stringify(result);
  }
});