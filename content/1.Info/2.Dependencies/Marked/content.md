# Marked

Marked is a low-level Markdown parser that allows for fast and efficient conversion of Markdown content to HTML. It is used in this project to handle the parsing of Markdown files.

## Why Marked?

- **Performance**: Marked is designed to be fast and efficient, making it suitable for parsing large Markdown files.
- **Extensibility**: It provides hooks to customize the parsing process, allowing for tailored functionality.
- **Simplicity**: Marked is easy to use and integrate into projects, with a simple API.

## Usage in This Project

In this project, Marked is used to:

- **Parse Markdown Content**: Convert content page Markdown files into HTML.
- **Generate Static Content**: Work with SvelteKit to generate static HTML content from Markdown during the build process.
- **Highlight Code Blocks**: Integrate with `marked-highlight` and `highlight.js`.
- **Render Safely**: Pass rendered HTML through `sanitize-html` before using Svelte’s `{@html}` directive.

### Installation

To install Marked, use the following command:

```bash
pnpm add marked marked-highlight highlight.js sanitize-html
```

### Example Usage

Here is an example of how Marked is used to parse Markdown content:

```js
import { Marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

// Sample Markdown content
const markdownContent = \`
# Sample Title

This is sample Markdown content.

- Item 1
- Item 2
- Item 3
\`;

const marked = new Marked();
const htmlContent = sanitizeHtml(await marked.parse(markdownContent));

console.log(htmlContent);
```

### Integration with SvelteKit

In SvelteKit, Marked is used within the `+page.server.js` file to parse Markdown content dynamically:

```js
import { Marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { pagesBySlugPath } from '$lib/generated/content.js';

const marked = new Marked();

export async function load({ params, fetch }) {
	const page = pagesBySlugPath[params.slug];
	const response = await fetch(page.contentFile);
	const markdownContent = await response.text();
	const htmlContent = sanitizeHtml(await marked.parse(markdownContent));

	return {
		content: htmlContent,
		page
	};
}
```

### Additional Resources

- [Marked Documentation](https://marked.js.org/)
- [Marked GitHub Repository](https://github.com/markedjs/marked)

Feel free to explore these resources to get a deeper understanding of how Marked works and how you can leverage it in your projects.
