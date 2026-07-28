import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = fileURLToPath(new URL("bump-version.mjs", import.meta.url));
const files = [
  "package.json",
  ".claude-plugin/marketplace.json",
  "plugins/niko-skills/.codex-plugin/plugin.json",
  "plugins/niko-skills/.claude-plugin/plugin.json",
  "plugins/niko-skills/.github/plugin/plugin.json",
];

test("synchronizes patch, minor, and major versions", async () => {
  for (const [part, expected] of Object.entries({ patch: "1.2.4", minor: "1.3.0", major: "2.0.0" })) {
    const root = await mkdtemp(join(tmpdir(), `version-bump-${part}-`));
    for (const file of files) {
      const path = join(root, file);
      await mkdir(join(path, ".."), { recursive: true });
      const value = file === ".claude-plugin/marketplace.json"
        ? { metadata: { version: "1.2.3" }, plugins: [{ version: "1.2.3" }] }
        : { version: "1.2.3" };
      await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
    }

    const result = spawnSync(process.execPath, [script, part], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), `1.2.3 -> ${expected}`);

    for (const file of files) {
      const matches = [...(await readFile(join(root, file), "utf8")).matchAll(/"version"\s*:\s*"([^"]+)"/g)];
      assert.ok(matches.length > 0);
      assert.ok(matches.every((match) => match[1] === expected));
    }
  }
});
