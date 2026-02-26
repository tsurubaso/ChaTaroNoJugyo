import { exec } from "child_process";

export function runBlender(sceneInput) {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(sceneInput).replace(/"/g, '\\"');

    exec(
      `blender --background --python generate_scene.py -- "${jsonString}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          status: "success",
          scene_state: sceneInput,
          summary: `${sceneInput.objects.length} objects generated`
        });
      }
    );
  });
}