#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const fast = args.includes("--fast");
const validateFirst = args.includes("--validate-first");
const strict = args.includes("--strict") || args.includes("--fail-on-warn") || args.includes("--strict-warnings");
const skipContactSheet = args.includes("--skip-contact-sheet") || args.includes("--no-contact-sheet");
const pagesIndex = args.findIndex(arg => arg === "--pages");
const pagesArgs = pagesIndex >= 0 && args[pagesIndex + 1] ? ["--pages", args[pagesIndex + 1]] : [];
const ignoredArgIndexes = new Set();
if (pagesIndex >= 0) {
  ignoredArgIndexes.add(pagesIndex);
  if (args[pagesIndex + 1]) ignoredArgIndexes.add(pagesIndex + 1);
}
const taskDir = args.find((arg, index) => !ignoredArgIndexes.has(index) && !arg.startsWith("-"));
if (!taskDir) {
  console.error("Usage: build-review-deck.mjs <task-dir> [--fast] [--validate-first] [--strict] [--pages 1,3,7] [--skip-contact-sheet]");
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const validateScript = path.join(scriptDir, "validate-review-deck.mjs");
const renderScript = path.join(scriptDir, "render-review-deck.mjs");

function run(label, script, args) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(process.execPath, [script, ...args], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`\nFAIL: ${label} failed.`);
    process.exit(result.status || 1);
  }
}

run("text preflight", validateScript, [taskDir, "--text-only"]);
if (fast) {
  run("render posters", renderScript, [taskDir, ...pagesArgs, ...(skipContactSheet ? ["--skip-contact-sheet"] : [])]);
  console.log("\n== full validation skipped (--fast) ==");
} else if (validateFirst) {
  run("full validation", validateScript, [taskDir, ...pagesArgs, ...(strict ? ["--fail-on-warn"] : [])]);
  run("render posters", renderScript, [taskDir, ...pagesArgs, ...(skipContactSheet ? ["--skip-contact-sheet"] : [])]);
} else {
  run("render posters", renderScript, [taskDir, ...pagesArgs, ...(skipContactSheet ? ["--skip-contact-sheet"] : [])]);
  run("full validation", validateScript, [taskDir, ...pagesArgs, ...(strict ? ["--fail-on-warn"] : [])]);
}

console.log("\nBuild completed.");
