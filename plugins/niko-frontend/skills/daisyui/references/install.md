# Install daisyUI 5

Use this only when the user requested installation and the project does not already include daisyUI.

1. Confirm the project uses Tailwind CSS 4 and identify its package manager and CSS entrypoint.
2. Add daisyUI 5 with the existing package manager. For npm: `npm install -D daisyui@^5`.
3. Add `@plugin "daisyui";` after `@import "tailwindcss";` in the CSS entrypoint.
4. Run the project's existing build or CSS check.

Do not create `tailwind.config.js` for Tailwind CSS 4. Do not replace an existing configuration or change package managers.

For dependency-free prototypes only, and only when the user accepts CDN runtime dependencies:

```html
<link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

The CSS entrypoint should contain:

```css
@import "tailwindcss";
@plugin "daisyui";
```
