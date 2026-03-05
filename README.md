# Iterable Community Docs

Community-driven snippets, guides, and tips for [Iterable](https://iterable.com) email marketing.

**Live site:** [aericode.github.io/iterable-community-docs](https://aericode.github.io/iterable-community-docs/)

## What's Here

- **Snippets** — Handlebars code snippets for Iterable templates
- **Guides** — Data practices, journey samples, and walkthroughs
- **Tips** — Quick tips, best practices, and workflow tricks
- **Bugs** — Known quirks with community-sourced workarounds

## Adding Content

All four sections work the same way. Create a `.md` file in the appropriate section and category folder:

```
snippets/logic/my-snippet.md
guides/data-practices/segment-setup.md
tips/general/quick-preview-trick.md
bugs/deliverability/outlook-image-sizing.md
```

### Frontmatter Format

Every `.md` file uses the same frontmatter schema:

```markdown
---
title: Your Title Here
description: A brief explanation of what this content covers.
category: logic
tags: [tag1, tag2, tag3]
context: email-template
author: your-handle
links:
  - label: Relevant Docs
    url: https://support.iterable.com/...
---

Your full markdown content goes here. Use standard markdown:
prose, multiple code blocks, images, tables, etc.
```

### Rebuild the Index

After adding or editing content, run:

```bash
node build-index.js
```

This regenerates `index.json` for each section from the frontmatter. Don't edit index files by hand.

A GitHub Action also runs this automatically on push whenever `.md` files change, so if you forget the local step it'll self-correct on CI.

## Running Locally

No framework required. Serve the root directory over HTTP:

```bash
npx serve .
```

Then open `http://localhost:3000`.

> **Note:** Opening `index.html` directly as a `file://` path won't work because the site uses `fetch()` to load content, which browsers block for local files.

## Tech Stack

- Static HTML/JS/CSS — no framework, no build step
- [marked.js](https://marked.js.org/) for markdown rendering (CDN)
- [Prism.js](https://prismjs.com/) for syntax highlighting — Handlebars, JS, CSS, JSON (CDN)
- Dark/light theme with dark default
- GitHub Pages ready (no Jekyll)

## Project Structure

```
├── index.html              # App shell
├── build-index.js          # Generates index.json for all sections
├── css/style.css           # Theming, layout, markdown body styles
├── js/
│   ├── app.js              # Router, nav, theme toggle
│   └── content.js          # Content loader, search, card grid, detail pages
├── snippets/               # Snippet .md files in category folders
│   └── index.json          # Auto-generated
├── guides/                 # Guide .md files in category folders
│   └── index.json
├── tips/                   # Tip .md files in category folders
│   └── index.json
├── bugs/                   # Bug .md files in category folders
│   └── index.json
├── .github/workflows/
│   └── build-index.yml     # Auto-rebuild indexes on push
└── .nojekyll               # Skip Jekyll on GitHub Pages
```

## License

MIT
