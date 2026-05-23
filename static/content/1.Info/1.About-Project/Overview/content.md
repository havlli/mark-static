---
title: Overview
description: What mark-static generates and how the documentation workflow is structured.
order: 1
---

# Overview

**mark-static** turns a folder of Markdown files into a static SvelteKit documentation site. It is built around a file-structure CMS workflow: create a site, drop Markdown into `static/content`, and let the generator build navigation, routes, breadcrumbs, and search data.

The intended published-package flow is scaffold-first:

```bash
pnpm dlx mark-static@latest init
```

The CLI writes a complete documentation project with pnpm, Svelte 5, SvelteKit, Tailwind CSS 4, Skeleton 4, Markdown rendering, search, theme variables, static deployment settings, and documentation validation. It can also install dependencies and initialize Git when requested.

## What Gets Generated

A scaffolded site includes the application template, starter content, project config, lockfile, and deployment files for the selected target. Generator-only files are removed from the new project, so users do not inherit the scaffold CLI, demo content, test suite, or package publishing metadata.

Common generated files:

- `markstatic.config.js` for site name, description, base path, content directory, and theme options.
- `static/content` for Markdown files, folder landing pages, and page assets.
- `src/custom-theme.css` for project-specific design token overrides.
- `pnpm-lock.yaml` and `.npmrc` for reproducible pnpm installs.
- `.github/workflows/deploy.yml`, `netlify.toml`, or `vercel.json` depending on the selected deployment target.

## Core Features

- **One-command scaffold**: Run `pnpm dlx mark-static@latest init` or create a new directory with `pnpm dlx mark-static@latest my-docs`, with optional `--install --git` setup.
- **Flexible Markdown structure**: Use direct `.md` pages, folder `index.md` files, or legacy `content.md` page folders.
- **Generated navigation and search**: Content structure produces the sidebar, breadcrumbs, page metadata, and search index.
- **Stable slugs**: Numeric ordering prefixes are stripped, names are normalized, and sibling route collisions fail generation.
- **Safe Markdown rendering**: Markdown is rendered with heading IDs, syntax highlighting, asset URL rewriting, and sanitized HTML.
- **Accessible UI**: Search, mobile navigation, active page state, and image previews are keyboard and screen-reader aware.
- **Static deployment**: Builds to plain static files for GitHub Pages, Netlify, Vercel, or any static host.

## Where to Go Next

- [Create a Site](/content/info/about-project/create-a-site)
- [Content Structure](/content/info/about-project/content-structure)
- [Configuration and Theming](/content/info/about-project/configuration-and-theming)
