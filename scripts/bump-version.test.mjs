import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = fileURLToPath(new URL("bump-version.mjs", import.meta.url));
const plugins = ["niko-frontend", "niko-other"];
const manifestPaths = (plugin) => [
  `plugins/${plugin}/.codex-plugin/plugin.json`,
  `plugins/${plugin}/.claude-plugin/plugin.json`,
  `plugins/${plugin}/.github/plugin/plugin.json`,
];

const setup = async () => {
  const root = await mkdtemp(join(tmpdir(), "version-bump-"));
  const marketplace = {
    plugins: plugins.map((name) => ({
      name,
      version: "1.2.3",
      source: `./plugins/${name}`,
    })),
  };
  await mkdir(join(root, ".claude-plugin"), { recursive: true });
  await writeFile(join(root, ".claude-plugin/marketplace.json"), `${JSON.stringify(marketplace, null, 2)}\n`);
  await writeFile(join(root, "validate_plugin.py"), "import pathlib, sys\nassert pathlib.Path(sys.argv[1]).is_dir()\n");

  for (const plugin of plugins) {
    for (const file of manifestPaths(plugin)) {
      const path = join(root, file);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, `${JSON.stringify({ name: plugin, version: "1.2.3" }, null, 2)}\n`);
    }
  }
  return root;
};

const run = (root, ...args) => spawnSync(process.execPath, [script, ...args], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, PLUGIN_VALIDATOR: join(root, "validate_plugin.py") },
});

const versions = async (root, plugin) => {
  const marketplace = JSON.parse(await readFile(join(root, ".claude-plugin/marketplace.json"), "utf8"));
  const values = [marketplace.plugins.find((entry) => entry.name === plugin).version];
  for (const file of manifestPaths(plugin)) {
    values.push(JSON.parse(await readFile(join(root, file), "utf8")).version);
  }
  return values;
};

test("bumps only the selected plugin", async () => {
  for (const [part, expected] of Object.entries({ patch: "1.2.4", minor: "1.3.0", major: "2.0.0" })) {
    const root = await setup();
    const result = run(root, "niko-frontend", part);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), `niko-frontend: 1.2.3 -> ${expected}`);
    assert.deepEqual(await versions(root, "niko-frontend"), Array(4).fill(expected));
    assert.deepEqual(await versions(root, "niko-other"), Array(4).fill("1.2.3"));
  }
});

test("rejects invalid arguments", async () => {
  const result = run(await setup(), "niko-frontend");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage:/);
});

test("rejects an unknown plugin", async () => {
  const result = run(await setup(), "niko-missing", "patch");

  assert.notEqual(result.status, 0);
});

test("rejects mismatched selected-plugin versions", async () => {
  const root = await setup();
  const path = join(root, manifestPaths("niko-frontend")[0]);
  await writeFile(path, `${JSON.stringify({ name: "niko-frontend", version: "1.2.2" }, null, 2)}\n`);
  const result = run(root, "niko-frontend", "patch");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not synchronized/);
  assert.deepEqual(await versions(root, "niko-other"), Array(4).fill("1.2.3"));
});

test("does not bump a plugin that fails validation", async () => {
  const root = await setup();
  await writeFile(join(root, "validate_plugin.py"), "raise SystemExit(1)\n");
  const result = run(root, "niko-frontend", "patch");

  assert.notEqual(result.status, 0);
  assert.deepEqual(await versions(root, "niko-frontend"), Array(4).fill("1.2.3"));
});
