import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

const OPTIONAL_MODULE_PATHS = [
  process.env.PLAYWRIGHT_MODULE_PATH,
  process.env.PLAYWRIGHT_MODULE_PATH && path.join(process.env.PLAYWRIGHT_MODULE_PATH, "playwright"),
  path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"),
].filter(Boolean);

export async function loadChromium() {
  const attempts = [];

  try {
    const module = await import("playwright");
    if (module.chromium) return module.chromium;
    attempts.push("playwright import succeeded without chromium export");
  } catch (error) {
    attempts.push(`local import: ${error.code || error.message}`);
  }

  const require = createRequire(import.meta.url);
  for (const modulePath of OPTIONAL_MODULE_PATHS) {
    try {
      const module = require(modulePath);
      if (module.chromium) return module.chromium;
      attempts.push(`${modulePath}: missing chromium export`);
    } catch (error) {
      attempts.push(`${modulePath}: ${error.code || error.message}`);
    }
  }

  const error = new Error(`Playwright is unavailable. Attempts: ${attempts.join(" | ")}`);
  error.attempts = attempts;
  throw error;
}

export function chromeExecutablePath() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROME_EXECUTABLE,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  return candidates.find(candidate => existsSync(candidate)) || null;
}
