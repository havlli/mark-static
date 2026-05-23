# Changelog

All notable changes to this project will be documented in this file.

## 0.1.1 - 2026-05-23

### Added

- More polished scaffold CLI output with a branded intro, clearer prompts, setup summary, and step-by-step status messages.
- Optional `--git-commit` and `--no-git-commit` scaffold flags for creating an initial documentation-site commit.

### Changed

- Publishing documentation now reflects that `mark-static` is available on npm.

## 0.1.0 - 2026-05-23

### Added

- Svelte 5, SvelteKit 2, Tailwind CSS 4, and Skeleton 4 based documentation template.
- `mark-static` scaffold CLI for `pnpm dlx mark-static@latest init` and directory creation.
- Content presets: `minimal`, `basic`, and `api`.
- Theme presets: `default`, `forest`, and `mono`.
- Background presets: `aurora`, `grid`, and `none`.
- Deployment targets for GitHub Pages, Netlify, Vercel, and plain static hosting.
- Optional post-scaffold `--install` and `--git` setup actions.
- Package metadata validation, pack checks, and a local release dry-run script.
- Flexible Markdown content model supporting direct `.md` pages, `index.md` folder landing pages, and `content.md` page folders.
- Generated navigation, breadcrumbs, search index, prerender entries, and stable route slugs.
- Markdown frontmatter for title, description, order, slug, tags, and draft status.
- Sanitized Markdown HTML rendering with heading IDs, syntax highlighting, static asset URL rewriting, and image preview behavior.
- Documentation validation command for titles, duplicate headings, image alt text, local assets, internal links, and heading anchors.
- Package publish safety checks through `pnpm release:check` and `prepublishOnly`.

### Fixed

- Markdown frontmatter is now stripped before page rendering.
- Generated projects no longer inherit scaffold-only files, demo content, tests, or package publishing metadata.
