---
title: Publishing
description: Release checks and npm publishing workflow for mark-static.
order: 5
---

# Publishing

The package is published on npm as `mark-static`. The public install path is:

```bash
pnpm dlx mark-static@latest init
```

## Release Check

Before publishing a new version, update `package.json` and `CHANGELOG.md`, then run the full release gate:

```bash
pnpm release:check
```

This runs:

- `pnpm package:check`
- `pnpm test`
- `pnpm test:smoke`
- `pnpm lint`
- `pnpm docs:check`
- `pnpm check:generated`
- `pnpm build`
- `pnpm pack:check`

The same gate runs automatically through `prepublishOnly`.

`pnpm package:check` validates the npm metadata, public publish config, CLI bin, package file allowlist, and release scripts. `pnpm pack:check` runs the package dry run, which also triggers `prepack`. The `prepack` lifecycle repeats the package metadata check, documentation check, and generated-manifest drift check whenever the package is packed or published.

To create an inspectable local tarball without publishing:

```bash
pnpm release:dry-run
```

The tarball is written to the ignored `package` directory after the full release gate passes.

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

Version `0.1.0` was the first public release. It includes the scaffold CLI, app template, presets, static assets, generated content system, docs validation, theme token layer, and deployment targets.
