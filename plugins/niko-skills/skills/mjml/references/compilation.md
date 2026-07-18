# MJML Compilation Reference

---

## Hard Rules

1. **No implicit install** — Never use a package runner that can download MJML implicitly.
2. **Use the available executable** — Run `mjml` directly from `PATH`.
3. **Verify source first** — Check that the `.mjml` file exists and contains valid XML before compiling.
4. **Protect existing output** — If the output path exists, ask before overwriting it.
5. **Inspect executable config** — Read any `.mjmlconfig.js` or configured preprocessors before compilation; do not execute untrusted project code.

---

## Environment Check

```bash
node -v          # Must succeed
command -v mjml  # Must find the executable
```

If `mjml` is unavailable, stop and ask how the user wants it installed. Do not run a package manager or create `package.json` without confirmation.

---

## Standard Compilation Command

```bash
mjml <source.mjml> -o <output.html> --config.minify=true --config.validationLevel=strict
```

- `--config.minify=true` — required to reduce payload size and remove whitespace between generated inline-block columns
- `--config.validationLevel=strict` — fail fast on syntax errors during development

After compilation, run `wc -c < <output.html>`. Compare it with the project's email-size budget, defaulting to 102400 bytes when none is defined; reduce generated markup or content and compile again if over budget.

---

## Output Pathing

Mirror source structure into `/dist`, or output alongside source:

- `src/emails/welcome.mjml` → `dist/emails/welcome.html`
- `emails/welcome.mjml` → `emails/welcome.html`

Ensure the output directory exists before compiling — MJML will not create it.

---

## Error Recovery

1. Parse error output for line/column number
2. Read the source file at that line
3. Fix the syntax issue
4. Re-attempt compilation once
5. If a newly created output `.html` is 0 bytes, treat compilation as failed and remove that partial file; never remove a file that existed before the run

---

## Implementation Standards

| Standard | Rule |
|----------|------|
| Idempotency | Running twice produces identical output, no duplicate files |
| Clean Up | Remove newly created partial `.html` if compilation fails |
| Logging | Always log the exact CLI command used (user can audit) |
| Version Pinning | Preserve the project's existing MJML version policy; do not change versions unless asked |
