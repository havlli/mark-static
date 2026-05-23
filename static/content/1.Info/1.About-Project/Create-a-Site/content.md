---
title: Create a Site
description: Scaffold a new documentation site from the package or from a local checkout.
order: 2
---

# Create a Site

The easiest flow is to run the published package CLI with pnpm:

```bash
pnpm dlx mark-static@latest init
```

`init` scaffolds into the current empty directory. To create a new directory instead, pass the directory name:

```bash
pnpm dlx mark-static@latest my-docs
```

The CLI asks for the site name, description, content preset, theme preset, background style, deployment target, and optional setup actions. It then shows a project summary before writing files. For repeatable setup, pass the choices as flags:

```bash
pnpm dlx mark-static@latest my-docs --yes --name "Acme Docs" --description "Acme product documentation." --preset basic --theme forest --background grid --deploy github-pages
```

Add `--install --git --git-commit` when you want the CLI to install dependencies, initialize a local Git repository, and create the first commit before it exits:

```bash
pnpm dlx mark-static@latest my-docs --yes --install --git --git-commit
```

## Start the Generated Site

After scaffolding:

```bash
cd my-docs
pnpm install
pnpm dev
```

The generated project is a normal private SvelteKit project. It includes `pnpm-lock.yaml`, `.npmrc`, docs validation, static build scripts, and only the content preset you selected.

## CLI Choices

Content presets:

- `minimal`: one starter page.
- `basic`: a small guide and reference tree.
- `api`: a compact API reference starter.

Theme presets:

- `default`: default documentation theme.
- `forest`: green accent preset.
- `mono`: neutral monochrome preset.

Background options:

- `aurora`: soft radial background.
- `grid`: subtle documentation grid.
- `none`: no decorative background.

Deployment targets:

- `github-pages`: writes a first-party GitHub Pages artifact workflow and sets the base path to the package name.
- `netlify`: writes `netlify.toml`.
- `vercel`: writes `vercel.json`.
- `static`: writes plain static hosting defaults.

Post-scaffold actions:

- `--install`: runs `pnpm install` in the generated project.
- `--no-install`: skips dependency installation.
- `--git`: runs `git init` in the generated project.
- `--no-git`: skips Git initialization.
- `--git-commit`: creates an initial `Initial documentation site` commit after Git initialization.
- `--no-git-commit`: skips initial commit creation.

## Local Repository Development

When working from this repository instead of a published package:

```bash
pnpm install
pnpm create-site ../my-docs
```

The local helper uses the same scaffold code as the package CLI.
