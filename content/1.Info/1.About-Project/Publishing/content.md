---
title: Publishing
description: Release checks and npm publishing workflow for mark-static.
order: 5
---

# Publishing

The package is prepared for npm publishing as `mark-static`. The expected public install path after release is:

```bash
pnpm dlx mark-static@latest init
```

The npm registry currently returns 404 for `mark-static`, so the name appears unpublished before the first release.

## Release Check

Run the full release gate before publishing:

```bash
pnpm release:check
```

This runs:

- `pnpm test`
- `pnpm lint`
- `pnpm docs:check`
- `pnpm check:generated`
- `pnpm build`
- `pnpm pack --dry-run`

The same gate runs automatically through `prepublishOnly`.

## Publish

Verify the npm account, then publish:

```bash
npm whoami
pnpm publish --access public
```

After publishing, verify the public package flow in an empty directory:

```bash
pnpm dlx mark-static@latest init
pnpm install
pnpm dev
```

## Release Contents

Version `0.1.0` is the first release candidate. It includes the scaffold CLI, app template, presets, static assets, generated content system, docs validation, theme token layer, and deployment targets.
