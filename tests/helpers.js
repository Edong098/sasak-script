import { run } from "../src/index.js";

export async function output(source, options = {}) {
  const lines = [];
  await run(source, { ...options, output: (value) => lines.push(value) });
  return lines;
}
