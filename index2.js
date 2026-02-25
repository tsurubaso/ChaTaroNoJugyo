import { exec } from "child_process"

const input = process.argv.slice(2).join(" ").toLowerCase()

function parseInput(text) {
  let shape = "cube"
  let size = 2

  if (text.includes("sphere")) shape = "sphere"
  if (text.includes("cylinder")) shape = "cylinder"
  if (text.includes("cube")) shape = "cube"

  const numberMatch = text.match(/(\d+(\.\d+)?)/)
  if (numberMatch) {
    size = parseFloat(numberMatch[0])
  }

  return { shape, size }
}

const { shape, size } = parseInput(input)

console.log("Detected:", shape, size)

exec(
  `blender --background --python generate3.py -- ${shape} ${size}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error)
      return
    }
    console.log("Blender finished.")
  }
)