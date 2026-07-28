const config = window.__REVIEW__;
const frame = document.querySelector("#artifact-frame");
const targetSummary = document.querySelector("#target-summary");
const comment = document.querySelector("#comment");
const feedbackList = document.querySelector("#feedback-list");
const reloadState = document.querySelector("#reload-state");
const endedNotice = document.querySelector("#session-ended");
const controls = [...document.querySelectorAll("button, textarea")];
let mode = "explore";
let target = null;

async function api(endpoint, options = {}) {
  const headers = new Headers(options.headers ?? {});
  if (options.method && options.method !== "GET") headers.set("X-Review-Token", config.token);
  const response = await fetch(endpoint, { ...options, headers });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error ?? "Request failed");
  return value;
}

function postToArtifact(message) {
  frame.contentWindow?.postMessage(message, "*");
}

function setMode(nextMode) {
  mode = nextMode;
  document.querySelector("#explore-mode").classList.toggle("tab-active", mode === "explore");
  document.querySelector("#annotate-mode").classList.toggle("tab-active", mode === "annotate");
  postToArtifact({ type: "review:set-mode", mode });
}

function describeTarget(value) {
  if (!value) return "Nothing selected";
  if (value.kind === "text") return `Text: “${value.selectedText}”\n${value.selector ?? ""}`;
  if (value.kind === "general") return "General artifact feedback";
  return `${value.tagName ?? "Element"} ${value.selector ?? ""}\n${value.textPreview ?? ""}`.trim();
}

function renderTarget() {
  targetSummary.textContent = describeTarget(target);
}

function setEnded() {
  endedNotice.classList.remove("hidden");
  reloadState.textContent = "Ended";
  reloadState.className = "badge badge-success ml-3";
  for (const control of controls) control.disabled = true;
}

function renderFeedback(items) {
  feedbackList.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "text-sm text-base-content/60";
    empty.textContent = "No pending feedback.";
    feedbackList.append(empty);
    return;
  }
  for (const item of items) {
    const card = document.createElement("article");
    card.className = "card border border-base-300 bg-base-100 shadow-sm";
    const body = document.createElement("div");
    body.className = "card-body gap-2 p-3";
    const badge = document.createElement("span");
    badge.className = "badge badge-outline w-fit";
    badge.textContent = item.kind;
    const text = document.createElement("p");
    text.className = "whitespace-pre-wrap text-sm";
    text.textContent = item.comment;
    const meta = document.createElement("p");
    meta.className = "break-words text-xs text-base-content/60";
    meta.textContent = [item.id, item.selector, item.selectedText].filter(Boolean).join(" · ");
    const resolve = document.createElement("button");
    resolve.className = "btn btn-ghost btn-xs self-end";
    resolve.textContent = "Resolve";
    resolve.addEventListener("click", async () => {
      try { await api("/api/feedback/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [item.id] }) }); await refreshFeedback(); }
      catch (error) { reloadState.textContent = error.message; }
    });
    body.append(badge, text, meta, resolve);
    card.append(body);
    feedbackList.append(card);
  }
}

async function refreshFeedback() {
  const value = await api("/api/feedback");
  renderFeedback(value.items);
}

window.addEventListener("message", (event) => {
  if (event.source !== frame.contentWindow) return;
  if (!["review:target-selected", "review:text-selected", "review:target-cleared"].includes(event.data?.type)) return;
  target = event.data.type === "review:target-cleared" ? null : event.data.target;
  renderTarget();
});

document.querySelector("#explore-mode").addEventListener("click", () => setMode("explore"));
document.querySelector("#annotate-mode").addEventListener("click", () => setMode("annotate"));
frame.addEventListener("load", () => postToArtifact({ type: "review:set-mode", mode }));

document.querySelector("#feedback-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!comment.value.trim()) return;
  try {
    await api("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...(target ?? { kind: "general" }), comment: comment.value }) });
    comment.value = "";
    target = null;
    renderTarget();
    await refreshFeedback();
  } catch (error) { reloadState.textContent = error.message; }
});

document.querySelector("#end-session").addEventListener("click", async () => {
  try { await api("/api/session/end", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); setEnded(); }
  catch (error) { reloadState.textContent = error.message; }
});

const events = new EventSource("/events");
events.addEventListener("reload", (event) => {
  const version = JSON.parse(event.data).version;
  reloadState.textContent = "Reloading…";
  frame.src = `${config.artifactUrl}?v=${version}`;
});
events.addEventListener("feedback", () => refreshFeedback().catch(() => {}));
events.addEventListener("ended", setEnded);
events.onerror = () => { if (endedNotice.classList.contains("hidden")) reloadState.textContent = "Connection lost"; };

refreshFeedback().catch((error) => { reloadState.textContent = error.message; });
