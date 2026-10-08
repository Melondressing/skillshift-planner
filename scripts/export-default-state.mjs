import fs from "fs";
import path from "path";
import { loadApp } from "./load-app.mjs";

const rootDir = process.cwd();
const outputPath = path.resolve(rootDir, process.argv[2] || path.join("mobile", "src", "sampleState.json"));

const { getState } = loadApp();
const state = getState();
if (!state) {
  throw new Error("Failed to export default state from the app scripts");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(state, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
