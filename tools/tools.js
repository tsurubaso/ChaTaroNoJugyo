// tools.js

export async function jsTool(code) {
  try {
    const result = eval(code)
    return { success: true, result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
