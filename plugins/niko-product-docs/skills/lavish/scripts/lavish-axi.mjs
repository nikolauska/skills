#!/usr/bin/env node

import http from "node:http";
import { promises as fs } from "node:fs";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import os from "node:os";

export const HOST = "127.0.0.1";
export const DEFAULT_PORT = 4387;
export const MAX_WAIT_MS = 60_000;
export const BODY_LIMIT = 64 * 1024;
export const SESSION_FILE = path.join(os.homedir(), ".light-review", "session.json");

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"], [".html", "text/html; charset=utf-8"], [".htm", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json; charset=utf-8"], [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"], [".png", "image/png"], [".svg", "image/svg+xml"], [".webp", "image/webp"],
  [".woff", "font/woff"], [".woff2", "font/woff2"],
]);
const jsonHeaders = { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" };

export function mimeType(filePath) {
  return MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

export function safeResolve(root, requestPath) {
  let decoded;
  try { decoded = decodeURIComponent(requestPath); } catch { throw new Error("invalid encoded path"); }
  if (decoded.includes("\0")) throw new Error("invalid path");
  const rootPath = path.resolve(root);
  const resolved = path.resolve(rootPath, decoded.replace(/^[/\\]+/, ""));
  if (resolved !== rootPath && !resolved.startsWith(`${rootPath}${path.sep}`)) throw new Error("path escapes artifact directory");
  return resolved;
}

export function validateFeedback(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("feedback must be an object");
  const kind = input.kind ?? "general";
  if (!["element", "text", "general"].includes(kind)) throw new Error("kind must be element, text, or general");
  const comment = typeof input.comment === "string" ? input.comment.trim() : "";
  if (!comment) throw new Error("comment must be non-empty");
  if (comment.length > 4000) throw new Error("comment is too long");
  const stringField = (name, max) => {
    if (input[name] == null) return null;
    if (typeof input[name] !== "string" || input[name].length > max) throw new Error(`${name} is invalid`);
    return input[name];
  };
  const selector = stringField("selector", 2048);
  const selectedText = stringField("selectedText", 2000);
  const textPreview = stringField("textPreview", 500);
  let range = null;
  if (input.range != null) {
    if (!input.range || !Number.isInteger(input.range.startOffset) || !Number.isInteger(input.range.endOffset) || input.range.startOffset < 0 || input.range.endOffset < input.range.startOffset) throw new Error("range is invalid");
    range = { startOffset: input.range.startOffset, endOffset: input.range.endOffset };
  }
  return { kind, selector, selectedText, range, textPreview, comment };
}

function responseJson(res, status, value) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(value));
}

function responseText(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType, "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

function errorResponse(res, status, message) {
  responseJson(res, status, { error: message });
}

async function readBody(req) {
  const length = Number(req.headers["content-length"]);
  if (Number.isFinite(length) && length > BODY_LIMIT) throw new Error("request body is too large");
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > BODY_LIMIT) throw new Error("request body is too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonBody(req) {
  const raw = await readBody(req);
  try { return JSON.parse(raw); } catch { throw new Error("request body must be valid JSON"); }
}

function tokenValid(req, state) {
  return req.headers["x-review-token"] === state.token;
}

function pendingFeedback(state) {
  return state.feedback.filter((item) => item.status === "open");
}

function waitResult(state, cursor) {
  const events = state.events.filter((event) => event.cursor > cursor);
  const feedbackEvents = events.filter((event) => event.type === "feedback");
  const items = feedbackEvents.map((event) => event.item);
  if (items.length) return { type: "feedback", cursor: feedbackEvents.at(-1).cursor, items };
  if (events.some((event) => event.type === "ended")) return { type: "ended", cursor: events.at(-1).cursor };
  return null;
}

function broadcast(state, type, data) {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of state.eventClients) {
    try { client.res.write(message); } catch { state.eventClients.delete(client); clearInterval(client.keepAlive); }
  }
}

function wakeWaiters(state) {
  for (const waiter of [...state.waiters]) {
    const result = waitResult(state, waiter.cursor);
    if (!result) continue;
    state.waiters.delete(waiter);
    clearTimeout(waiter.timer);
    waiter.finish(result);
  }
}

function addFeedback(state, input) {
  const feedback = {
    id: `fb_${state.nextId++}_${randomBytes(3).toString("hex")}`,
    ...validateFeedback(input),
    status: "open",
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
  state.feedback.push(feedback);
  state.cursor += 1;
  state.events.push({ cursor: state.cursor, type: "feedback", item: feedback });
  broadcast(state, "feedback", { items: pendingFeedback(state), cursor: state.cursor });
  wakeWaiters(state);
  return feedback;
}

function endSession(state) {
  if (state.ended) return false;
  state.ended = true;
  state.cursor += 1;
  state.events.push({ cursor: state.cursor, type: "ended" });
  broadcast(state, "ended", {});
  wakeWaiters(state);
  if (state.persist) setTimeout(() => closeReviewServer(state), 500).unref();
  return true;
}

async function serveFile(res, filePath, contentType = mimeType(filePath)) {
  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    res.end(content);
  } catch (error) {
    if (error.code === "ENOENT") errorResponse(res, 404, "file not found");
    else errorResponse(res, 500, "could not read file");
  }
}

async function artifactHtml(state) {
  let html = await fs.readFile(state.artifactPath, "utf8");
  const bridge = '<script src="/bridge.js"></script>';
  if (!/<script\s+src=["']\/bridge\.js["']/i.test(html)) {
    const closingBody = html.search(/<\/body\s*>/i);
    html = closingBody === -1 ? `${html}\n${bridge}` : `${html.slice(0, closingBody)}${bridge}${html.slice(closingBody)}`;
  }
  return html;
}

async function handleRequest(req, res, state) {
  const parsed = new URL(req.url, `http://${HOST}`);
  const pathname = parsed.pathname;
  try {
    if (req.method === "GET" && pathname === "/") {
      let shell = await fs.readFile(path.join(SCRIPT_DIR, "shell.html"), "utf8");
      shell = shell.replace("__REVIEW_TOKEN__", JSON.stringify(state.token));
      return responseText(res, 200, shell, "text/html; charset=utf-8");
    }
    if (req.method === "GET" && pathname === "/shell.js") return serveFile(res, path.join(SCRIPT_DIR, "shell.js"), "text/javascript; charset=utf-8");
    if (req.method === "GET" && pathname === "/bridge.js") return serveFile(res, path.join(SCRIPT_DIR, "bridge.js"), "text/javascript; charset=utf-8");
    if (req.method === "GET" && pathname === "/review.css") return serveFile(res, path.join(SCRIPT_DIR, "review.css"), "text/css; charset=utf-8");
    if (req.method === "GET" && pathname === "/artifact") { res.writeHead(302, { Location: "/artifact/" }); return res.end(); }
    if (req.method === "GET" && pathname === "/artifact/") return responseText(res, 200, await artifactHtml(state), "text/html; charset=utf-8");
    if (req.method === "GET" && pathname.startsWith("/artifact/")) return serveFile(res, safeResolve(state.artifactDirectory, pathname.slice("/artifact/".length)));
    if (req.method === "GET" && pathname === "/api/session") return responseJson(res, 200, { active: !state.ended, artifact: state.artifactPath, url: state.url, pendingFeedback: pendingFeedback(state).length, cursor: state.cursor, version: state.version });
    if (req.method === "GET" && pathname === "/api/feedback") return responseJson(res, 200, { items: pendingFeedback(state) });
    if (req.method === "POST" && pathname === "/api/feedback") {
      if (!tokenValid(req, state)) return errorResponse(res, 403, "invalid session token");
      return responseJson(res, 201, addFeedback(state, await readJsonBody(req)));
    }
    if (req.method === "POST" && pathname === "/api/feedback/resolve") {
      if (!tokenValid(req, state)) return errorResponse(res, 403, "invalid session token");
      const input = await readJsonBody(req);
      const ids = input?.all ? pendingFeedback(state).map((item) => item.id) : input?.ids;
      if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) throw new Error("ids must be an array of strings");
      const now = new Date().toISOString();
      const resolved = [];
      for (const item of state.feedback) if (ids.includes(item.id) && item.status === "open") { item.status = "resolved"; item.resolvedAt = now; resolved.push(item.id); }
      broadcast(state, "feedback", { items: pendingFeedback(state), cursor: state.cursor });
      return responseJson(res, 200, { resolved });
    }
    if (req.method === "POST" && pathname === "/api/session/end") {
      if (!tokenValid(req, state)) return errorResponse(res, 403, "invalid session token");
      endSession(state);
      return responseJson(res, 200, { ended: true, cursor: state.cursor });
    }
    if (req.method === "GET" && pathname === "/api/agent/wait") {
      const requestedCursor = parsed.searchParams.has("cursor") ? Number(parsed.searchParams.get("cursor")) : state.agentCursor;
      const cursor = Number.isInteger(requestedCursor) && requestedCursor >= 0 ? requestedCursor : state.agentCursor;
      const requestedTimeout = Number(parsed.searchParams.get("timeout"));
      const timeout = Number.isFinite(requestedTimeout) ? Math.min(Math.max(0, requestedTimeout), MAX_WAIT_MS) : MAX_WAIT_MS;
      const immediate = waitResult(state, cursor);
      if (immediate) { state.agentCursor = immediate.cursor; return responseJson(res, 200, immediate); }
      let done = false;
      const finish = (value) => { if (done) return; done = true; state.agentCursor = value.cursor ?? state.agentCursor; responseJson(res, 200, value); };
      const waiter = { cursor, finish, timer: setTimeout(() => { state.waiters.delete(waiter); finish({ type: "timeout", cursor: state.agentCursor }); }, timeout) };
      state.waiters.add(waiter);
      req.on("close", () => { if (!done) { done = true; state.waiters.delete(waiter); clearTimeout(waiter.timer); } });
      return;
    }
    if (req.method === "GET" && pathname === "/events") {
      res.writeHead(200, { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache", Connection: "keep-alive", "X-Content-Type-Options": "nosniff" });
      res.write(`event: connected\ndata: ${JSON.stringify({ version: state.version, ended: state.ended })}\n\n`);
      const client = { res, keepAlive: setInterval(() => res.write(": keep-alive\n\n"), 20_000) };
      state.eventClients.add(client);
      req.on("close", () => { state.eventClients.delete(client); clearInterval(client.keepAlive); });
      return;
    }
    return errorResponse(res, 404, "route not found");
  } catch (error) {
    const status = error.message.includes("too large") || error.message.includes("invalid") || error.message.includes("must be") || error.message.includes("escapes") ? 400 : 500;
    return errorResponse(res, status, error.message);
  }
}

function watchArtifact(state) {
  const watcher = watch(state.artifactDirectory, (_event, filename) => {
    if (!filename || filename.toString() !== path.basename(state.artifactPath)) return;
    clearTimeout(state.reloadTimer);
    state.reloadTimer = setTimeout(() => { state.version += 1; broadcast(state, "reload", { version: state.version }); }, 150);
  });
  watcher.on("error", () => {});
  state.watcher = watcher;
}

async function writeSessionMetadata(state) {
  await fs.mkdir(path.dirname(state.sessionFile), { recursive: true, mode: 0o700 });
  await fs.writeFile(state.sessionFile, JSON.stringify({ pid: process.pid, port: state.port, host: HOST, artifactPath: state.artifactPath, startedAt: state.startedAt, sessionToken: state.token }, null, 2));
  await fs.chmod(state.sessionFile, 0o600);
}

export async function startReviewServer({ artifactPath, port = 0, persist = false, sessionFile = SESSION_FILE } = {}) {
  const stat = await fs.stat(artifactPath);
  if (!stat.isFile()) throw new Error("artifact is not a file");
  const absoluteArtifact = path.resolve(artifactPath);
  const state = {
    artifactPath: absoluteArtifact, artifactDirectory: path.dirname(absoluteArtifact), startedAt: new Date().toISOString(), token: randomBytes(24).toString("hex"), ended: false,
    version: 0, cursor: 0, agentCursor: 0, nextId: 1, feedback: [], events: [], waiters: new Set(), eventClients: new Set(), persist, sessionFile, reloadTimer: null,
  };
  const server = http.createServer((req, res) => handleRequest(req, res, state));
  state.server = server;
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, HOST, resolve); });
  state.port = server.address().port;
  state.url = `http://${HOST}:${state.port}`;
  watchArtifact(state);
  if (persist) await writeSessionMetadata(state);
  return state;
}

export async function closeReviewServer(state) {
  clearTimeout(state.reloadTimer);
  state.watcher?.close();
  for (const client of state.eventClients) { clearInterval(client.keepAlive); client.res.end(); }
  state.eventClients.clear();
  if (state.server?.listening) await new Promise((resolve) => state.server.close(() => resolve()));
  if (state.persist) await fs.rm(state.sessionFile, { force: true });
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? 65_000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? `request failed with ${response.status}`);
    return body;
  } finally { clearTimeout(timer); }
}

function pidAlive(pid) { try { process.kill(pid, 0); return true; } catch { return false; } }

async function discoverSession({ cleanup = true } = {}) {
  let metadata;
  try { metadata = JSON.parse(await fs.readFile(SESSION_FILE, "utf8")); } catch (error) {
    if (error.code === "ENOENT") return null;
    if (cleanup) await fs.rm(SESSION_FILE, { force: true });
    return null;
  }
  if (!pidAlive(metadata.pid)) { if (cleanup) await fs.rm(SESSION_FILE, { force: true }); return null; }
  try { return await fetchJson(`http://${metadata.host}:${metadata.port}/api/session`, { timeout: 1000 }); }
  catch { if (cleanup) await fs.rm(SESSION_FILE, { force: true }); return null; }
}

async function metadataOrError() {
  let metadata;
  try { metadata = JSON.parse(await fs.readFile(SESSION_FILE, "utf8")); } catch { throw new Error("no active review session"); }
  const session = await discoverSession();
  if (!session?.active) throw new Error("no active review session");
  return { metadata, session };
}

function openBrowser(url) {
  const [command, args] = process.platform === "darwin" ? ["open", [url]] : process.platform === "win32" ? ["cmd.exe", ["/c", "start", "", url]] : ["xdg-open", [url]];
  try { const child = spawn(command, args, { detached: true, stdio: "ignore" }); child.once("error", () => {}); child.unref(); } catch { /* URL is still returned. */ }
}

function print(value) { process.stdout.write(`${JSON.stringify(value)}\n`); }
function help() { print({ help: "node <skill>/scripts/lavish-axi.mjs <command>", commands: ["open <artifact.html>", "wait", "feedback", "resolve <id...>", "resolve --all", "status", "end"] }); }

async function commandOpen(args) {
  const artifact = args[0];
  if (!artifact || artifact === "--help") return help();
  if ((await discoverSession())?.active) throw new Error("a review session is already active; run end before opening another");
  const artifactPath = path.resolve(artifact);
  const stat = await fs.stat(artifactPath).catch(() => null);
  if (!stat?.isFile() || ![".html", ".htm"].includes(path.extname(artifactPath).toLowerCase())) throw new Error("artifact must be an existing HTML file");
  const requestedPort = Number(process.env.REVIEW_PORT ?? DEFAULT_PORT);
  if (!Number.isInteger(requestedPort) || requestedPort < 0 || requestedPort > 65535) throw new Error("REVIEW_PORT must be a valid port");
  const state = await startReviewServer({ artifactPath, port: requestedPort, persist: true });
  process.once("SIGINT", () => closeReviewServer(state).finally(() => process.exit(0)));
  process.once("SIGTERM", () => closeReviewServer(state).finally(() => process.exit(0)));
  print({ active: true, artifact: state.artifactPath, url: state.url });
  openBrowser(state.url);
  await new Promise(() => {});
}

async function commandStatus() {
  print((await discoverSession()) ?? { active: false });
}

async function commandWait() {
  const { metadata } = await metadataOrError();
  print(await fetchJson(`http://${metadata.host}:${metadata.port}/api/agent/wait?timeout=${MAX_WAIT_MS}`, { timeout: MAX_WAIT_MS + 2000 }));
}

async function commandFeedback() {
  const { metadata } = await metadataOrError();
  print(await fetchJson(`http://${metadata.host}:${metadata.port}/api/feedback`));
}

async function commandResolve(args) {
  const { metadata } = await metadataOrError();
  const all = args.includes("--all");
  const ids = args.filter((arg) => arg !== "--all");
  if (!all && ids.length === 0) throw new Error("provide feedback IDs or --all");
  print(await fetchJson(`http://${metadata.host}:${metadata.port}/api/feedback/resolve`, { method: "POST", headers: { "Content-Type": "application/json", "X-Review-Token": metadata.sessionToken }, body: JSON.stringify(all ? { all: true } : { ids }) }));
}

async function commandEnd() {
  let metadata;
  try { metadata = JSON.parse(await fs.readFile(SESSION_FILE, "utf8")); } catch { return print({ active: false, ended: false }); }
  if (!(await discoverSession())?.active) return print({ active: false, ended: true });
  print(await fetchJson(`http://${metadata.host}:${metadata.port}/api/session/end`, { method: "POST", headers: { "X-Review-Token": metadata.sessionToken }, body: "{}" }));
}

export async function main(args = process.argv.slice(2)) {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") return help();
  const [command, ...rest] = args;
  if (command === "open" || command.endsWith(".html") || command.endsWith(".htm")) return commandOpen(command === "open" ? rest : args);
  if (command === "status") return commandStatus();
  if (command === "wait") return commandWait();
  if (command === "feedback") return commandFeedback();
  if (command === "resolve") return commandResolve(rest);
  if (command === "end") return commandEnd();
  throw new Error(`unknown command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { print({ error: error.message }); process.exitCode = 1; });
}
