---
name: daisyui
description: Guides implementation and review of daisyUI 5 interfaces, including installation, components, themes, and Tailwind CSS integration. Use when a project already uses daisyUI, the user asks for it, or code contains daisyUI classes or the daisyUI Tailwind plugin. Do not use for generic HTML, JSX, CSS, or Tailwind work without daisyUI.
---

# daisyUI 5
daisyUI 5 is a component library for Tailwind CSS 4. It provides component classes, semantic colors, and themes.

## Guardrails

- Do not introduce daisyUI into a project unless the user asks for it.
- Do not install or update packages unless installation is part of the request.
- Preserve the project's package manager, daisyUI version, prefix, theme, and component conventions.
- Never read `.env` files, credentials, keys, or tokens.
- Prefer local references and project files. Browse daisyUI documentation only when the user requests it or local references are insufficient and browsing is allowed.
- Preserve semantic HTML, keyboard access, labels, focus behavior, and required ARIA attributes.

## References

| Task | Guide | Note |
|------|-------|------|
| Installing daisyUI | [references/install.md](references/install.md) | Read only when installation is requested and daisyUI is absent. |
| Using daisyUI classes | [references/usage.md](references/usage.md) | Read before adding or changing daisyUI classes. |
| Configuring daisyUI | [references/config.md](references/config.md) | Read when changing themes, prefix, logs, or plugin options. |
| Colors and themes | [references/colors.md](references/colors.md) | Read when changing colors or themes. |

## List of components

- [accordion](./components/accordion.md)
- [aura](./components/aura.md)
- [alert](./components/alert.md)
- [avatar](./components/avatar.md)
- [badge](./components/badge.md)
- [breadcrumbs](./components/breadcrumbs.md)
- [button](./components/button.md)
- [calendar](./components/calendar.md)
- [card](./components/card.md)
- [carousel](./components/carousel.md)
- [chat](./components/chat.md)
- [checkbox](./components/checkbox.md)
- [collapse](./components/collapse.md)
- [countdown](./components/countdown.md)
- [diff](./components/diff.md)
- [divider](./components/divider.md)
- [dock (app bar)](./components/dock.md)
- [drawer (sidebar)](./components/drawer.md)
- [dropdown](./components/dropdown.md)
- [FAB](./components/fab.md)
- [fieldset](./components/fieldset.md)
- [file-input](./components/file-input.md)
- [filter](./components/filter.md)
- [footer](./components/footer.md)
- [hero](./components/hero.md)
- [hover-3d](./components/hover-3d.md)
- [hover-gallery](./components/hover-gallery.md)
- [indicator](./components/indicator.md)
- [input](./components/input.md)
- [join (group)](./components/join.md)
- [kbd](./components/kbd.md)
- [label](./components/label.md)
- [link](./components/link.md)
- [list](./components/list.md)
- [loading](./components/loading.md)
- [mask](./components/mask.md)
- [megamenu](./components/megamenu.md)
- [menu](./components/menu.md)
- [mockup-browser](./components/mockup-browser.md)
- [mockup-code](./components/mockup-code.md)
- [mockup-phone](./components/mockup-phone.md)
- [mockup-window](./components/mockup-window.md)
- [modal](./components/modal.md)
- [navbar](./components/navbar.md)
- [otp](./components/otp.md)
- [pagination](./components/pagination.md)
- [progress](./components/progress.md)
- [radial-progress](./components/radial-progress.md)
- [radio](./components/radio.md)
- [range](./components/range.md)
- [rating](./components/rating.md)
- [select](./components/select.md)
- [skeleton](./components/skeleton.md)
- [stack](./components/stack.md)
- [stat](./components/stat.md)
- [status](./components/status.md)
- [steps](./components/steps.md)
- [swap](./components/swap.md)
- [tab](./components/tab.md)
- [table](./components/table.md)
- [text-rotate](./components/text-rotate.md)
- [textarea](./components/textarea.md)
- [theme-controller](./components/theme-controller.md)
- [timeline](./components/timeline.md)
- [toast](./components/toast.md)
- [toggle (switch)](./components/toggle.md)
- [tooltip](./components/tooltip.md)
- [validator](./components/validator.md)

## Workflow

1. Inspect package metadata, CSS entrypoints, and nearby UI code to confirm daisyUI is requested or already used. If neither is true, stop using this skill.
2. Read [references/usage.md](references/usage.md), plus only the configuration, color, and component references needed for the request.
3. If the user names a component, read that component file first. Otherwise, shortlist by behavior and read only plausible candidates.
4. Reuse the project's existing component, class, theme, prefix, responsive, and accessibility patterns.
5. Make the smallest change that satisfies the request. Use Tailwind utilities only when daisyUI modifiers do not cover the requirement.
6. Run the project's existing checks. If no check exists, inspect the rendered class structure, responsive states, theme contrast, keyboard behavior, labels, and ARIA use.

## Edge cases

- If the installed major version is not 5, do not use the bundled v5 references. Follow existing project patterns; when they are insufficient, use version-matched documentation if browsing is allowed, otherwise ask the user for direction.
- If a referenced component does not fit, compose semantic HTML and Tailwind utilities; do not invent daisyUI classes.
- If validation needs a missing dependency, report the skipped check rather than installing it implicitly.
