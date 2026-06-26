#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validator = path.join(root, "scripts", "validate-review-deck.mjs");

const cases = [
  {
    name: "valid minimal deck",
    fixture: path.join(root, "tests", "fixtures", "valid-minimal"),
    expectPass: true,
  },
  {
    name: "invalid static failures",
    fixture: path.join(root, "tests", "fixtures", "invalid-static"),
    expectPass: false,
    expectOutput: [
      "deck-data style_route",
      "inline layout patch styles",
    ],
  },
  {
    name: "invalid duplicate image",
    fixture: path.join(root, "tests", "fixtures", "invalid-duplicate-image"),
    expectPass: false,
    expectOutput: [
      "same image asset is reused",
    ],
  },
  {
    name: "invalid disclaimer surface wording",
    fixture: path.join(root, "tests", "fixtures", "invalid-disclaimer-surface"),
    expectPass: false,
    expectOutput: [
      "disclaimer/unverified/source-note wording",
      "中文零售页可见",
      "以版本包装为准",
    ],
  },
];

let failures = 0;

for (const item of cases) {
  const result = spawnSync(process.execPath, [validator, item.fixture, "--text-only"], {
    encoding: "utf8",
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const passed = result.status === 0;

  if (passed !== item.expectPass) {
    failures += 1;
    console.error(`FAIL ${item.name}: expected ${item.expectPass ? "pass" : "fail"}, got ${passed ? "pass" : "fail"}.`);
    console.error(output);
    continue;
  }

  for (const expected of item.expectOutput || []) {
    if (!output.includes(expected)) {
      failures += 1;
      console.error(`FAIL ${item.name}: missing expected validator output: ${expected}`);
      console.error(output);
    }
  }

  if (!failures) {
    console.log(`PASS ${item.name}`);
  }
}

if (failures) {
  console.error(`\n${failures} fixture assertion(s) failed.`);
  process.exit(1);
}

console.log("\nValidator fixture tests passed.");
