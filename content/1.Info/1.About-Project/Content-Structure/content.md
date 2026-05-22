---
title: Content Structure
description: Supported Markdown file patterns, ordering, slugs, frontmatter, and assets.
order: 3
---

# Content Structure

Content lives in `static/content`. The generator scans that tree and turns Markdown files into `/content/...` routes.

## Direct Markdown Pages

For simple pages, drop `.md` files directly into the content tree:

```txt
static/content/
  01.Getting Started.md
  02.Guides/
    01.Installation.md
    02.Configuration.md
```

This produces routes like:

```txt
/content/getting-started
/content/guides/installation
/content/guides/configuration
```

## Folder Landing Pages

Use `index.md` when a folder should also be a page:

```txt
static/content/
  02.Guides/
    index.md
    01.Installation.md
```

The folder route becomes `/content/guides`, and child pages stay below it.

## Page Folders With Assets

Use `content.md` when a page needs local assets grouped beside the Markdown:

```txt
static/content/
  03.Reference/
    API/
      content.md
      diagram.png
```

Inside `content.md`, local image references resolve relative to that folder:

```md
![API request flow](diagram.png)
```

## Ordering and Slugs

Numeric prefixes control sort order and are removed from URLs:

```txt
01.Getting Started.md -> /content/getting-started
02.Guides/index.md -> /content/guides
```

Folder and file names can contain spaces, punctuation, dots, and mixed case. The generator normalizes names into URL-safe slugs and fails if two sibling entries resolve to the same route.

## Frontmatter

Frontmatter is optional. Use it when derived names are not enough:

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
```

Supported fields:

- `title`: navigation and page title.
- `description`: metadata and search text.
- `order`: explicit sibling sort order.
- `slug`: route segment override.
- `tags`: search metadata.
- `draft`: exclude the page unless `INCLUDE_DRAFTS=true`.
