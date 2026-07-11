import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { closeReviewServer, mimeType, safeResolve, startReviewServer, validateFeedback } from "./lavish-axi.mjs";

const servers = [];
const tempDirs = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map(closeReviewServer));
  await Promise.all(tempDirs.splice(0).map((directory) => fs.rm(directory, { recursive: true, force: true })));
});

async function fixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "lavish-review-"));
  tempDirs.push(directory);
  await fs.writeFile(path.join(directory, "style.css"), "body { color: red; }");
  const artifactPath = path.join(directory, "artifact.html");
  await fs.writeFile(artifactPath, "<!doctype html><html><head><link rel=stylesheet href=style.css></head><body><h1 id=title>Hello</h1></body></html>");
  const state = await startReviewServer({ artifactPath });
  servers.push(state);
  return { directory, artifactPath, state };
}

async function request(state, route, options = {}) {
  const headers = new Headers(options.headers ?? {});
  if (options.token) headers.set("X-Review-Token", state.token);
  const response = await fetch(`${state.url}${route}`, { ...options, headers });
  const body = await response.json();
  return { response, body };
}

test("validates feedback and rejects unsafe paths", () => {
  assert.equal(mimeType("file.css"), "text/css; charset=utf-8");
  assert.equal(mimeType("file.unknown"), "application/octet-stream");
  assert.equal(safeResolve("/tmp/review", "assets/app.js"), path.resolve("/tmp/review/assets/app.js"));
  assert.throws(() => safeResolve("/tmp/review", "../secret.txt"), /escapes/);
  assert.deepEqual(validateFeedback({ kind: "text", selectedText: "Hello", comment: "Change this" }).kind, "text");
  assert.throws(() => validateFeedback({ comment: "" }), /non-empty/);
  assert.throws(() => validateFeedback({ comment: "x", selector: "x".repeat(2049) }), /selector/);
});

test("serves the isolated shell, artifact, and local assets", async () => {
  const { state } = await fixture();
  const shell = await fetch(`${state.url}/`);
  assert.equal(shell.status, 200);
  assert.match(await shell.text(), /HTML Review/);
  const artifact = await fetch(`${state.url}/artifact/`);
  const artifactText = await artifact.text();
  assert.equal(artifact.status, 200);
  assert.match(artifactText, /src="\/bridge\.js"/);
  const asset = await fetch(`${state.url}/artifact/style.css`);
  assert.equal(asset.status, 200);
  assert.equal(asset.headers.get("content-type"), "text/css; charset=utf-8");
  const traversal = await fetch(`${state.url}/artifact/%2e%2e/%2e%2e/etc/passwd`);
  assert.notEqual(traversal.status, 200);
});

test("creates, waits for, lists, and resolves feedback", async () => {
  const { state } = await fixture();
  const invalid = await request(state, "/api/feedback", { method: "POST", body: "{}", headers: { "Content-Type": "application/json" } });
  assert.equal(invalid.response.status, 403);
  const created = await request(state, "/api/feedback", { method: "POST", token: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "element", selector: "#title", comment: "Shorten this" }) });
  assert.equal(created.response.status, 201);
  assert.match(created.body.id, /^fb_/);
  assert.equal(created.body.status, "open");
  const waited = await request(state, "/api/agent/wait?cursor=0&timeout=10");
  assert.equal(waited.body.type, "feedback");
  assert.equal(waited.body.items[0].id, created.body.id);
  const listed = await request(state, "/api/feedback");
  assert.equal(listed.body.items.length, 1);
  const resolved = await request(state, "/api/feedback/resolve", { method: "POST", token: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [created.body.id] }) });
  assert.deepEqual(resolved.body.resolved, [created.body.id]);
  const empty = await request(state, "/api/feedback");
  assert.deepEqual(empty.body.items, []);
});

test("long-poll timeout and session ending are structured states", async () => {
  const { state } = await fixture();
  const timeout = await request(state, "/api/agent/wait?cursor=0&timeout=5");
  assert.deepEqual(timeout.body, { type: "timeout", cursor: 0 });
  await request(state, "/api/feedback", { method: "POST", token: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ comment: "Review this" }) });
  const ended = await request(state, "/api/session/end", { method: "POST", token: true, headers: { "Content-Type": "application/json" }, body: "{}" });
  assert.equal(ended.body.ended, true);
  const waited = await request(state, "/api/agent/wait?cursor=0&timeout=10");
  assert.equal(waited.body.type, "feedback");
  const endedAfterFeedback = await request(state, `/api/agent/wait?cursor=${waited.body.cursor}&timeout=10`);
  assert.equal(endedAfterFeedback.body.type, "ended");
  const session = await request(state, "/api/session");
  assert.equal(session.body.active, false);
});

test("file changes produce a debounced reload event", async () => {
  const { artifactPath, state } = await fixture();
  const response = await fetch(`${state.url}/events`);
  const reader = response.body.getReader();
  await reader.read();
  await fs.writeFile(artifactPath, "<!doctype html><html><body><h1>Changed</h1></body></html>");
  const deadline = Date.now() + 2000;
  while (state.version === 0 && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 25));
  await reader.cancel();
  assert.equal(state.version, 1);
});
