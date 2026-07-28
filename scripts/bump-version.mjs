#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const [plugin, part, ...extra] = process.argv.slice(2);
if (!/^niko-[a-z0-9-]+$/.test(plugin ?? "") || !new Set(["patch", "minor", "major"]).has(part) || extra.length) {
  console.error("Usage: node bump-version.mjs <plugin> <patch|minor|major>");
  process.exit(1);
}

const marketplacePath = ".claude-plugin/marketplace.json";
const manifestPaths = [
  `plugins/${plugin}/.codex-plugin/plugin.json`,
  `plugins/${plugin}/.claude-plugin/plugin.json`,
  `plugins/${plugin}/.github/plugin/plugin.json`,
];

const parse = async (path) => {
  const source = await readFile(path, "utf8");
  return [path, JSON.parse(source)];
};

const [, marketplace] = await parse(marketplacePath);
const entries = marketplace.plugins.filter((entry) => entry.name === plugin);
if (entries.length !== 1) {
  throw new Error(`${marketplacePath}: expected one ${plugin} entry, found ${entries.length}`);
}

const entry = entries[0];
if (entry.source !== `./plugins/${plugin}`) {
  throw new Error(`${marketplacePath}: ${plugin} has unexpected source ${entry.source}`);
}
const manifests = await Promise.all(manifestPaths.map(parse));
for (const [path, manifest] of manifests) {
  if (manifest.name !== plugin) {
    throw new Error(`${path}: expected plugin name ${plugin}, found ${manifest.name}`);
  }
}

const versions = [entry.version, ...manifests.map(([, manifest]) => manifest.version)];
if (versions.some((version) => typeof version !== "string") || new Set(versions).size !== 1) {
  throw new Error(`${plugin} version fields are not synchronized: ${[...new Set(versions)].join(", ")}`);
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

const validator = process.env.PLUGIN_VALIDATOR ?? join(
  process.env.CODEX_HOME ?? join(homedir(), ".codex"),
  "skills/.system/plugin-creator/scripts/validate_plugin.py",
);
execFileSync("python3", [validator, `plugins/${plugin}`], { stdio: "inherit" });

entry.version = next;
for (const [, manifest] of manifests) manifest.version = next;
await Promise.all([
  writeFile(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`),
  ...manifests.map(([path, manifest]) => writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`)),
]);

console.log(`${plugin}: ${current} -> ${next}`);
