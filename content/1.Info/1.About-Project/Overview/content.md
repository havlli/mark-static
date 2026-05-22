# Overview

**mark-static** turns a folder of Markdown files into a static SvelteKit documentation site. Content lives in `static/content`, the navigation and search data are generated at build time, and the final site is prerendered with `@sveltejs/adapter-static`.

The content tree can be nested to any depth. Every page is represented by a directory that contains `content.md`, and nearby assets such as images can be referenced from that Markdown file.

## Features

- **Arbitrary Nested Routing**: Folder names under `static/content` become stable `/content/...` routes through a catch-all SvelteKit route.
- **Generated Navigation and Search**: The generator emits navigation, breadcrumbs, page metadata, and a search index into `src/lib/generated/content.js`.
- **Stable Slugs**: Numeric ordering prefixes are stripped, folder names are normalized, and duplicate sibling slugs fail generation.
- **Markdown Rendering**: Markdown is rendered with heading IDs, syntax highlighting, local asset URL rewriting, and sanitized HTML output.
- **Static Site Generation**: `@sveltejs/adapter-static` builds a static site suitable for GitHub Pages, Netlify, Vercel, and similar hosts.
- **Live Content Updates**: A Vite plugin watches `static/content` in development and regenerates content data when Markdown changes.

## Folder Structure

Every page is a directory with a `content.md` file:

```
static/content/
  01.Guides/
    02.API v2/
      003.Auth Flow/
        content.md
        diagram.png
```

This becomes:

```txt
/content/guides/api-v2/auth-flow
```

Numeric prefixes control sort order and are removed from URLs. Folder names can contain spaces, dots, mixed case, and other punctuation; the generator normalizes them into URL-safe slugs.

## Frontmatter

Frontmatter is optional. When present, it overrides folder-derived metadata:

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

## Scripts

- **`pnpm generate`**: Regenerates `src/lib/generated/content.js`.
- **`pnpm check:generated`**: Regenerates content and fails if the committed generated file is stale.
- **Vite Plugin**: Runs generation during builds and watches `static/content` during development.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/havlli/mark-static.git
   cd mark-static
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Run the development server**:

   ```bash
   pnpm dev
   ```

4. **Build for production**:

   ```bash
   pnpm build
   ```

5. **Preview the production build**:
   ```bash
   pnpm preview
   ```

## Development

The development workflow includes:

- **Linting, Tests, and Generated Content Checks**:

  ```bash
  pnpm lint
  pnpm test
  pnpm check:generated
  ```

## Dependencies

Key dependencies and devDependencies used in the project:

- **Svelte 5 and SvelteKit**: Core framework and routing layer.
- **Tailwind CSS 4**: Utility-first CSS framework, integrated through the Vite plugin.
- **Skeleton 4**: Svelte and Tailwind UI toolkit and theme styles.
- **Marked**: Markdown parser.
- **sanitize-html**: HTML sanitizer for rendered Markdown.
- **highlight.js**: Syntax highlighting for code blocks.
- **Vite**: Build tool and development server.
- **HtmlParser2 and DOMUtils**: HTML parsing and transformation utilities.

For the full list of dependencies, refer to `package.json` file.
