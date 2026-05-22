---
title: Configuration and Theming
description: Configure site identity, deployment base paths, theme presets, and CSS token overrides.
order: 4
---

# Configuration and Theming

Site-level settings live in `markstatic.config.js`. Scaffolded sites use this file for identity, content location, deployment base path, and high-level theme choices.

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
	},
	homepage: {
		title: 'Acme Docs Documentation',
		description: 'Acme product documentation.',
		primaryLabel: 'Open documentation',
		secondaryLabel: 'View on GitHub'
	}
};
```

## Deployment Base Path

Use `site.basePath` for GitHub Pages project sites:

```js
basePath: '/my-docs'
```

Keep it empty for root-hosted targets:

```js
basePath: ''
```

The scaffold sets this automatically from the selected deployment target.

## Theme Presets

The scaffold supports these high-level theme choices:

- `default`
- `forest`
- `mono`

Background choices:

- `aurora`
- `grid`
- `none`

These options are intentionally small. They make first setup fast while still leaving a stable CSS token layer for custom design work.

## Custom Theme Overrides

Default design tokens are defined in `src/theme.css`. Project-specific changes belong in `src/custom-theme.css` so users can override only what they need.

Common tokens:

- `--ms-page-bg`
- `--ms-text`
- `--ms-surface`
- `--ms-border`
- `--ms-accent`
- `--ms-focus-ring`
- `--ms-header-bg`
- `--ms-sidebar-bg`

Example override:

```css
body {
	--ms-accent: oklch(58% 0.18 250deg);
	--ms-page-bg: oklch(99% 0.01 250deg);
}
```

## Validation

Run this before publishing:

```bash
pnpm docs:check
```

The checker validates generated pages for missing titles, duplicate headings, missing image alt text, missing local assets, broken internal routes, and broken heading links.
