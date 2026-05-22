# mark-static

**mark-static** turns a folder of Markdown files into a static SvelteKit documentation site.

It is built for file-structure CMS style authoring: scaffold a site, choose a starter content preset, then add or move Markdown files in `static/content`.

[Demo site](https://havlli.github.io/mark-static/)

## Create a Site

Once the package is published, scaffold directly from the package:

```bash
pnpm dlx mark-static@latest init
```

Or create a new directory in one command:

```bash
pnpm dlx mark-static@latest my-docs
```

For a non-interactive run:

```bash
pnpm dlx mark-static@latest my-docs --yes --name "Acme Docs" --preset basic --theme forest --background aurora --deploy github-pages
```

Then start the generated project:

```bash
cd my-docs
pnpm install
pnpm dev
```

From this repository checkout, use the local scaffold command:

```bash
pnpm install
pnpm create-site ../my-docs
```

The scaffold asks for:

- site name and description
- content preset: `minimal`, `basic`, or `api`
- theme preset: `default`, `forest`, or `mono`
- background: `aurora`, `grid`, or `none`
- deployment target: `github-pages`, `netlify`, `vercel`, or `static`

Local non-interactive run:

```bash
pnpm create-site ../acme-docs --yes --name "Acme Docs" --preset basic --theme forest --background aurora --deploy github-pages
```

To scaffold into the current empty directory:

```bash
pnpm create-site init --name "Acme Docs"
```

Useful CLI helpers:

```bash
pnpm create-site --help
pnpm create-site --list-presets
```

## Add Content

Content lives in `static/content`.

Use plain Markdown files for simple pages:

```txt
static/content/
  01.Getting Started.md
  02.Guides/
    01.Installation.md
    02.Configuration.md
```

Use `index.md` for folder landing pages:

```txt
static/content/
  02.Guides/
    index.md
    01.Installation.md
```

The older folder page model is still supported when a page needs local assets grouped beside it:

```txt
static/content/
  03.Reference/
    API/
      content.md
      diagram.png
```

Numeric prefixes are used for sorting and removed from URLs. Folder and file names can contain spaces, dots, mixed case, and punctuation; the generator normalizes them into URL-safe slugs and fails if sibling routes collide.

## Frontmatter

Frontmatter is optional. When present, it overrides file or folder derived metadata:

```md
---
title: OAuth Flow
description: Configure API authentication.
order: 30
slug: auth-flow
tags: [auth, api]
draft: false
---

# Auth Flow

Markdown content goes here.
```

Supported fields:

- `title`: navigation and page title.
- `description`: page metadata and search text.
- `order`: sort order within sibling files and folders.
- `slug`: URL segment override.
- `tags`: search metadata.
- `draft`: exclude from generated pages unless `INCLUDE_DRAFTS=true`.

## Configure

Site-level settings live in `markstatic.config.js`:

```js
export default {
	site: {
		name: 'Acme Docs',
		description: 'Acme product documentation.',
		docsLabel: 'Documentation',
		repositoryUrl: '',
		basePath: '/acme-docs',
		language: 'en'
	},
	content: {
		dir: 'static/content'
	},
	theme: {
		skeleton: 'wintry',
		preset: 'default',
		background: 'aurora'
	}
};
```

Use `basePath` for GitHub Pages project sites. Keep it empty for root-hosted targets like Netlify, Vercel, or a custom domain.

## Theme Overrides

The default design tokens are defined in `src/theme.css`. Project-level overrides belong in `src/custom-theme.css` so users can change only what they need.

Common tokens:

- `--ms-page-bg`
- `--ms-text`
- `--ms-surface`
- `--ms-border`
- `--ms-accent`
- `--ms-focus-ring`
- `--ms-header-bg`
- `--ms-sidebar-bg`

Example:

```css
body {
	--ms-accent: oklch(58% 0.18 250deg);
	--ms-page-bg: oklch(99% 0.01 250deg);
}
```

## Scripts

```bash
pnpm dev
pnpm generate
pnpm docs:check
pnpm build
pnpm preview
pnpm lint
pnpm test
pnpm check:generated
```

`pnpm generate` writes `src/lib/generated/content.js` from the Markdown tree.

`pnpm docs:check` validates documentation pages for missing titles, duplicate headings, missing image alt text, broken local assets, and broken internal links.

`pnpm check:generated` regenerates content data and fails if the committed generated manifest is stale.

## Deployment

The included GitHub Pages workflow installs with pnpm, builds the static site, and publishes the `build` directory.

For GitHub Pages project sites, set `site.basePath` in `markstatic.config.js` to the repository path, for example `/my-docs`.

For Netlify, Vercel, or other root-hosted static targets, keep `site.basePath` empty.

## Maintainer Development

This repository also serves as the demo site. Install dependencies and run:

```bash
pnpm dev
```

Before committing changes:

```bash
pnpm lint
pnpm test
pnpm build
```
