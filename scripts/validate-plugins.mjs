#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const validator = process.env.PLUGIN_VALIDATOR ?? join(
  process.env.CODEX_HOME ?? join(homedir(), ".codex"),
  "skills/.system/plugin-creator/scripts/validate_plugin.py",
);
const changes = execFileSync(
  "git",
  ["status", "--porcelain=v1", "-z", "--untracked-files=all", "--", "plugins"],
  { encoding: "utf8" },
);
const plugins = [...new Set(
  changes.split("\0").flatMap((record) => record.match(/plugins\/([^/]+)/)?.[1] ?? []),
)].filter((plugin) => existsSync(`plugins/${plugin}`)).sort();

for (const plugin of plugins) {
  execFileSync("python3", [validator, `plugins/${plugin}`], { stdio: "inherit" });
}

console.log(plugins.length ? `Validated changed plugins: ${plugins.join(", ")}` : "No changed plugins.");
