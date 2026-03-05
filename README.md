# Iterable Community Docs

Community-driven snippets, guides, and tips for [Iterable](https://iterable.com) email marketing.

**Live site:** [Colin Whelan.github.io/iterable-community-docs](https://Colin Whelan.github.io/iterable-community-docs/)

## What's Here

- **Snippets** — Handlebars code snippets for Iterable templates, organized by category with search and one-click copy
- **Guides** — Data practices, journey samples, and walkthroughs *(coming soon)*
- **Tips** — Quick tips, best practices, and workflow tricks *(coming soon)*
- **Bugs** — Known quirks with community-sourced workarounds *(coming soon)*

## Adding a Snippet

1. Create a `.md` file in the appropriate category folder under `snippets/`:

```
snippets/
├── personalization/
├── logic/
├── formatting/
└── data-feeds/
```

2. Use this frontmatter format:

```markdown
---
title: Your Snippet Title
description: A brief explanation of what this snippet does.
category: personalization
tags: [tag1, tag2, tag3]
context: email-template
author: your-handle
links:
  - label: Relevant Docs
    url: https://support.iterable.com/...
---
```

3. Add your code in a fenced block immediately after the frontmatter:

````markdown
```handlebars
{{#if yourVariable}}
  Your template code here
{{/if}}
```
````

4. Rebuild the index:

```bash
node build-index.js
```

That's it — `snippets/index.json` is auto-generated from the frontmatter. Don't edit it by hand.

A GitHub Action also runs this automatically on push whenever `.md` files in `snippets/` change, so if you forget the local step it'll self-correct on CI.

## Running Locally

No framework or build step required. Serve the root directory over HTTP:

```bash
npx serve .
```

Then open `http://localhost:3000`.

> **Note:** Opening `index.html` directly as a `file://` path won't work because the site fetches snippet files via `fetch()`, which browsers block for local files.

## Tech Stack

- Static HTML/JS/CSS — no framework, no build step
- [Prism.js](https://prismjs.com/) for syntax highlighting (Handlebars + JS, loaded via CDN)
- Dark/light theme with dark default
- GitHub Pages ready (no Jekyll)

## Project Structure

```
├── index.html              # App shell
├── build-index.js          # Generates index.json from .md frontmatter
├── css/style.css           # Theming and layout
├── js/
│   ├── app.js              # Router, nav, theme toggle
│   ├── snippets.js         # Snippet loader, search, categories
│   └── modal.js            # Modal viewer with copy + highlighting
├── snippets/
│   ├── index.json          # Auto-generated snippet manifest
│   ├── personalization/    # Category folders with .md files
│   ├── logic/
│   ├── formatting/
│   └── data-feeds/
├── .github/workflows/
│   └── build-index.yml     # Auto-rebuild index on push
└── .nojekyll               # Skip Jekyll on GitHub Pages
```

## License

MIT
