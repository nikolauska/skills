(() => {
  let mode = "explore";
  let overlay;

  const ignored = (element) => !element || element === document.documentElement || element === document.body || ["SCRIPT", "STYLE"].includes(element.tagName) || element.hasAttribute("data-review-ignore") || element.closest("[data-review-ignore]");
  const cssEscape = (value) => window.CSS?.escape ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
  const unique = (selector) => { try { return document.querySelectorAll(selector).length === 1; } catch { return false; } };

  function selectorFor(element) {
    if (element.id && unique(`#${cssEscape(element.id)}`)) return `#${cssEscape(element.id)}`;
    for (const name of ["data-testid", "data-test", "data-cy"]) {
      const value = element.getAttribute(name);
      const selector = value && `[${name}="${cssEscape(value)}"]`;
      if (selector && unique(selector)) return selector;
    }
    if (element.classList.length) {
      const selector = `${element.tagName.toLowerCase()}${[...element.classList].slice(0, 3).map((name) => `.${cssEscape(name)}`).join("")}`;
      if (unique(selector)) return selector;
    }
    const parts = [];
    let current = element;
    while (current && current !== document.body && current !== document.documentElement) {
      let part = current.tagName.toLowerCase();
      const siblings = current.parentElement ? [...current.parentElement.children].filter((child) => child.tagName === current.tagName) : [];
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      parts.unshift(part);
      const candidate = parts.join(" > ");
      if (unique(candidate)) return candidate;
      current = current.parentElement;
    }
    return parts.join(" > ");
  }

  function preview(element) { return (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160); }
  function send(type, target = null) { parent.postMessage({ type, target }, "*"); }
  function targetFor(element) { return { kind: "element", selector: selectorFor(element), tagName: element.tagName.toLowerCase(), textPreview: preview(element), selectedText: null, range: null }; }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.setAttribute("data-review-ignore", "");
    Object.assign(overlay.style, { position: "fixed", pointerEvents: "none", zIndex: "2147483647", border: "2px solid #2563eb", background: "rgba(37,99,235,.08)", display: "none" });
    document.documentElement.append(overlay);
    return overlay;
  }

  function highlight(element) {
    if (ignored(element)) { ensureOverlay().style.display = "none"; return; }
    const rect = element.getBoundingClientRect();
    const box = ensureOverlay();
    Object.assign(box.style, { display: "block", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
  }

  function clear() { ensureOverlay().style.display = "none"; send("review:target-cleared"); }

  document.addEventListener("mouseover", (event) => { if (mode === "annotate") highlight(event.target.closest?.("*") ?? event.target); }, true);
  document.addEventListener("mouseout", () => { if (mode === "annotate") ensureOverlay().style.display = "none"; }, true);
  document.addEventListener("click", (event) => {
    if (mode !== "annotate") return;
    const element = event.target.closest?.("*");
    if (ignored(element)) return;
    event.preventDefault();
    event.stopPropagation();
    send("review:target-selected", targetFor(element));
  }, true);
  document.addEventListener("mouseup", () => {
    if (mode !== "annotate") return;
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (!selectedText || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    const element = node?.closest?.("*");
    if (ignored(element)) return;
    send("review:text-selected", { kind: "text", selector: selectorFor(element), tagName: element.tagName.toLowerCase(), textPreview: preview(element), selectedText: selectedText.slice(0, 2000), range: { startOffset: range.startOffset, endOffset: range.endOffset } });
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") clear(); }, true);
  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.data?.type !== "review:set-mode") return;
    mode = event.data.mode === "annotate" ? "annotate" : "explore";
    if (mode === "explore") ensureOverlay().style.display = "none";
  });
})();
