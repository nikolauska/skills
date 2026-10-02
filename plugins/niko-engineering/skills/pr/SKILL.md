---
name: pr
description: Writes a GitHub pull request or GitLab merge request title and body from the branch's actual changes and verification, and opens or updates it with attachments when asked. Use when asked to write, draft, open, or update a PR or MR description; not for reviewing PRs.
---

# Pull Request

Write a PR body a reviewer can judge from the top three sections alone, with the change list and proof one click away. "PR" here also covers GitLab merge requests.

## Gather

Compare the branch with its base using the merge base, and read the commits, linked issue or ticket, and relevant code. Use verification already observed in this session; if none exists and a small local check covers the change, run it. Follow the repository's title convention, such as Conventional Commits when its history uses them.

Never invent evidence, reviewers, issue links, or risk claims. Never include secrets, credentials, environment values, or private customer data. Present the title and body in chat; create or edit the PR, and upload attachments, only when the user explicitly asks.

## Only what reviewers can see

Reviewers see the PR, the pushed code, and linked issues, nothing else. Do not reference local plans, session notes, handoffs, chat history, unpushed commits, or local file paths. When context from a plan matters to the review, such as a rejected alternative or a constraint the code alone does not explain, write it into the PR itself. Keep it in the visible sections if it is one sentence; otherwise put it in a collapsed `Background` block.

Never commit screenshots, recordings, or other evidence files to the repository just for the PR; keep them outside the working tree, such as in a temporary directory. Upload them as attachments when creating or editing the PR:

- **GitHub:** `gh pr create` or `gh pr edit` with `--attach '<path>#<alt text>'`, repeated per file (gh 2.99 or later; not GitHub Enterprise Server). Where each file belongs in the body, add a Markdown image whose target is the same path passed to `--attach`; gh replaces that reference with the uploaded URL, so no local path is published.
- **GitLab:** `glab mr create` or `glab mr update` with `--attach <path>`, repeated per file. The flag is experimental and appends the references to the end of the description, so say in Evidence that the screenshots follow below.

Check the command's exit status: when some uploads fail, gh still creates or updates the PR with the rest, so report which files are missing. When the CLI cannot attach, because it is too old, the host is unsupported, or uploads fail, tell the user which local file belongs where so they can paste it into the description in the browser.

## Write

Write in plain language, as if explaining the change to a smart colleague. Explain any necessary jargon, skip preambles and hedging, and keep paths, commands, symbols, and numbers exact. Omit nothing a reviewer needs, but keep each section short.

```markdown
### Summary

<what changed and why, in two to four sentences>

### Risk

**<Low|Medium|High>:** <what could break, and for whom>
**Rollback:** <easy: revert the PR | hard: why, such as a data migration or published API>

### For reviewers

- <where to look first, a decision that needs a second opinion, setup to try it, or a deliberate non-goal>

<details>
<summary>Changes</summary>

- <one change per line>

</details>

<details>
<summary>Evidence</summary>

- **Before:** <failing test, output, or screenshot>
- **After:** <passing test, output, or screenshot>
- **Not verified:** <gaps, or omit>

</details>

<details>
<summary>Background</summary>

<plan context a reviewer needs; omit this block when there is none>

</details>
```

GitHub only renders Markdown inside `<details>` when blank lines surround it, so keep them.

- **Summary:** Lead with the reason for the change. When structure or flow is the point, add the smallest visual that makes it clear: a call tree, file tree, diff sketch, or Mermaid diagram.
- **Risk:** Judge by what users, consumers, or data could experience, not by diff size. Name concrete effects such as changed public behavior, migrations, config changes, or layout shifts. A change that is hard to undo raises the level.
- **For reviewers:** Point at what deserves attention rather than restating the diff. Use one line pointing at the key file when nothing else needs attention.
- **Changes:** Describe each meaningful change in one line, grouped by behavior rather than by file.
- **Evidence:** Show the exact commands or tests run and their results; prefer screenshots for visual changes when available, attached as described above. State what was not verified rather than implying coverage.
