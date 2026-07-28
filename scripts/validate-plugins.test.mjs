import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("validate-plugins.mjs", import.meta.url));

test("validates only changed plugins", async () => {
  const root = await mkdtemp(join(tmpdir(), "validate-plugins-"));
  const plugin = join(root, "plugins/niko-existing");
  await mkdir(plugin, { recursive: true });
  await writeFile(join(plugin, "SKILL.md"), "before\n");
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  execFileSync("git", ["add", "."], { cwd: root });
  execFileSync("git", ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "--quiet", "-m", "initial"], { cwd: root });

  await writeFile(join(plugin, "SKILL.md"), "after\n");
  await mkdir(join(root, "plugins/niko-new"));
  await writeFile(join(root, "plugins/niko-new/SKILL.md"), "new\n");
  await writeFile(join(root, "validate_plugin.py"), "import os, sys\nwith open(os.environ['VALIDATION_LOG'], 'a') as log: log.write(sys.argv[1] + '\\n')\n");

  const log = join(root, "validated.log");
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, PLUGIN_VALIDATOR: join(root, "validate_plugin.py"), VALIDATION_LOG: log },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual((await readFile(log, "utf8")).trim().split("\n"), [
    "plugins/niko-existing",
    "plugins/niko-new",
  ]);
});
