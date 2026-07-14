---
name: mjml
description: >
  Creates, edits, compiles, and troubleshoots responsive HTML email templates written in MJML 4.x.
  Use for .mjml files, MJML-to-HTML compilation, newsletters, and transactional or promotional
  email templates. Do not use for plain-text email, non-email web pages, or hand-authored HTML
  when MJML is not involved.
license: MIT
compatibility: "Requires an MJML 4.x executable available on PATH."
---

<!-- Original author: Framix -->

# MJML — Responsive Email Developer

Generate valid, cross-client MJML 4.x templates and compile them to production-ready HTML. The primary goal is compatibility: Outlook (2013–365), Gmail (web/app), Apple Mail, and major mobile clients. Every output must pass strict validation and be checked against Gmail's clipping threshold.

---

## Workflow

1. **Gather requirements** — Infer email type, brand colors, and content from the user's message and conversation context. Ask only for what is genuinely missing and blocking progress (e.g., no colors provided and the layout has branded sections). Never front-load a questionnaire.
2. **Inspect the target** — Follow existing project conventions and check whether the requested source or output paths already exist.
3. **Plan layout** — Choose the smallest structure that fits the content (single column, grid, hero + content, etc.).
4. **Load component references** — Read only the relevant files from the Component Index below before writing MJML.
5. **Generate MJML** — Write complete MJML starting from `<mjml>` with a full `<mj-head>`.
6. **Compile and validate** — Follow `compilation.md`; compilation must use the available `mjml` executable and strict validation.
7. **Inspect output** — Confirm compilation succeeded, the HTML is non-empty, and its size does not exceed 102,400 bytes.
8. **Deliver artifacts** — Deliver `.mjml` source and compiled `.html` only after successful compilation. If MJML is unavailable and the user declines installation, deliver the source plus the exact blocked validation command; never fabricate compiled HTML.

## Guardrails

- Never overwrite an existing source or output file without user confirmation.
- Never install MJML, create a `package.json`, or access external systems without user confirmation.
- Never use an implicit package downloader; run the installed `mjml` executable directly.
- Treat recipient data and email content as sensitive: do not expose it in logs or unrelated output.
- Do not fetch remote images or fonts while authoring; reference supplied URLs only.

---

## 9 Engineering Rules

1. **Structural Integrity** — All visual content MUST be in `<mj-column>` inside `<mj-section>`. Sections cannot be nested.
2. **Responsive Defaults** — Assume 600px width. Use `<mj-group>` to prevent mobile stacking for side-by-side elements (social bars, logo rows).
3. **Outlook Compatibility** — Use `<mj-font>` for web fonts (prevents Times New Roman fallback). Always provide a fallback stack (Arial, sans-serif). For `<mj-section>` background images, always set both `background-size` and a fallback `background-color`.
4. **Gmail Optimization** — Use `inline="inline"` on `<mj-style>` for custom CSS. Prefer component attributes (`color`, `font-size`) over CSS classes for critical styles.
5. **Dark Mode** — Include dark mode support when explicitly requested or when the design requires controlled light/dark variants. See the Dark Mode Pattern below.
6. **Accessibility** — Every `<mj-image>` MUST have `alt`. Always set `<mj-title>` (populates `aria-label`). Maintain WCAG 2.1 AA 4.5:1 contrast. For heading roles, use `mj-html-attributes` — direct `role`/`aria-level` attributes on `mj-text` are illegal under strict validation (see Accessibility Checklist below).
7. **Styling Efficiency** — Use `<mj-attributes>` with `<mj-all>`, component defaults, and `<mj-class>` to eliminate repetitive inline styles.
8. **Hero Sections** — Use `<mj-hero>` for full-bleed hero banners; it falls back to a regular section in unsupported clients. Avoid `<mj-accordion>` and `<mj-carousel>` — client support is too poor to be useful.
9. **Templating Support** — Keep simple variable substitutions inside ending tags. Put template control-flow tags between MJML components in `<mj-raw>` so the parser preserves them.

---

## Critical Gotchas

**Outlook:**
- Background images: VML only generated for `<mj-section>` and `<mj-hero>` — nowhere else
- Background positioning: keyword values only (`top`, `center`, `bottom`) — pixel values ignored
- Always pair `background-repeat="no-repeat"` with explicit `background-size`
- Font fallback: `<mj-font>` hides `@font-face` from Outlook via MSO conditional comments

**Gmail:**
- Use component attributes for critical layout — CSS classes may be stripped
- 102KB clip: always compile with `--config.minify=true`

**iOS / Android stacking:**
- Always compile with `--config.minify=true` — removes whitespace between `inline-block` columns
- Whitespace between tags causes stacking even inside `<mj-group>`

**Vertical-align bug:**
- If any column in a section sets `vertical-align`, ALL columns in that section must explicitly set it

**JavaScript:**
- JS is completely blocked in all email clients (Gmail, Outlook, Apple Mail, iOS Mail). No `onclick`, no clipboard API, no interactivity of any kind. Interactive-looking elements (copy buttons, toggles) are purely decorative.

---

## Dark Mode Pattern

```xml
<mj-head>
  <mj-raw>
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
  </mj-raw>

  <!-- Light logo visible by default; dark logo hidden -->
  <mj-style inline="inline">
    .dark-logo { display: none !important; }
  </mj-style>

  <!-- Dark mode overrides -->
  <mj-style>
    @media (prefers-color-scheme: dark) {
      .light-logo { display: none !important; }
      .dark-logo  { display: block !important; }
    }
  </mj-style>
</mj-head>
```

Safe neutrals: `#121212` (not `#000000`) and `#F1F1F1` (not `#FFFFFF`) — prevents jarring forced inversions.

---

## Accessibility Checklist

- `<mj-title>` is set (screen reader email label + `aria-label`)
- `lang` attribute on root `<mjml>` tag
- `alt` on every `<mj-image>` and `<mj-social-element>`
- Heading role set via `mj-html-attributes` (NOT as a direct attribute on `mj-text`):
  ```xml
  <!-- In mj-head -->
  <mj-html-attributes>
    <mj-selector path=".email-heading div">
      <mj-html-attribute name="role">heading</mj-html-attribute>
      <mj-html-attribute name="aria-level">1</mj-html-attribute>
    </mj-selector>
  </mj-html-attributes>
  <!-- On the component -->
  <mj-text css-class="email-heading" ...>Heading text</mj-text>
  ```
- 4.5:1 contrast ratio on all text/background pairs
- No text baked into images — always use live `<mj-text>` blocks

---

## Component Index

Before writing any MJML, read the component file(s) for the components you'll use.

| Group | Components | Load when | File |
|-------|-----------|-----------|------|
| Head | mj-attributes, mj-font, mj-style, mj-preview, mj-breakpoint, mj-html-attributes | Setting up head, global styles | `components/head.md` |
| Layout | mj-body, mj-section, mj-column, mj-group, mj-wrapper | Building structure / grid | `components/layout.md` |
| Content | mj-text, mj-image, mj-button, mj-divider, mj-spacer, mj-table | Adding content blocks | `components/content.md` |
| Interactive | mj-accordion, mj-carousel, mj-social, mj-navbar | Interactive or social elements | `components/interactive.md` |
| Advanced | mj-hero, mj-raw, mj-include | Hero banners, template tags, partials | `components/advanced.md` |

General reference (hierarchy, ending tags, validation, width math, Gmail clip): `mjml-reference.md`

---

## Compilation

Read `compilation.md` for the full workflow. Key command:

```bash
mjml template.mjml -o dist/template.html --config.minify=true --config.validationLevel=strict
```

Hard rules:
- Run `mjml` directly; do not let a package runner download it implicitly.
- If `mjml` is unavailable, stop and ask how the user wants it installed.

---

## Output

After successful compilation, deliver:

1. **`<name>.mjml`** — complete MJML source (editable, version-controllable)
2. **`<name>.html`** — compiled output (production-ready, send via ESP)

If compilation is blocked, deliver only the `.mjml` source and the blocking diagnostic.

Name files after the email type: `welcome.mjml`, `promo-sale.mjml`, `order-confirmation.mjml`
