

import { exec } from "child_process"

const size = process.argv[2] || 2


exec(
  `blender --background --python generate2.py -- ${size}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error)
      return
    }
    console.log("Blender finished")
    console.log(stdout)
  }
)