#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const part = process.argv[2];
if (!new Set(["patch", "minor", "major"]).has(part)) {
  console.error("Usage: node bump-version.mjs <patch|minor|major>");
  process.exit(1);
}

const files = new Map([
  ["package.json", 1],
  [".claude-plugin/marketplace.json", 2],
  ["plugins/niko-skills/.codex-plugin/plugin.json", 1],
  ["plugins/niko-skills/.claude-plugin/plugin.json", 1],
  ["plugins/niko-skills/.github/plugin/plugin.json", 1],
]);
const pattern = /"version"(\s*:\s*)"([^"]+)"/g;
const updates = [];
const versions = [];

for (const [file, expectedCount] of files) {
  const source = await readFile(file, "utf8");
  JSON.parse(source);
  const found = [...source.matchAll(pattern)];
  if (found.length !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} version field(s), found ${found.length}`);
  }
  versions.push(...found.map((match) => match[2]));
  updates.push([file, source]);
}

if (new Set(versions).size !== 1) {
  throw new Error(`Version fields are not synchronized: ${[...new Set(versions)].join(", ")}`);
}

const current = versions[0];
const numbers = current.match(/^(\d+)\.(\d+)\.(\d+)$/)?.slice(1).map(Number);
if (!numbers?.every(Number.isSafeInteger)) {
  throw new Error(`Unsupported version: ${current}`);
}

if (part === "major") numbers.splice(0, 3, numbers[0] + 1, 0, 0);
if (part === "minor") numbers.splice(1, 2, numbers[1] + 1, 0);
if (part === "patch") numbers[2] += 1;
const next = numbers.join(".");

for (const [file, source] of updates) {
  await writeFile(file, source.replaceAll(pattern, `"version"$1"${next}"`));
}

console.log(`${current} -> ${next}`);
