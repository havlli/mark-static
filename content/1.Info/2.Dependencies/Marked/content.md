# Marked

Marked is a low-level markdown parser that allows for fast and efficient conversion of markdown content to HTML. It is used in this project to handle the parsing of markdown files.

## Why Marked?

- **Performance**: Marked is designed to be fast and efficient, making it suitable for parsing large markdown files.
- **Extensibility**: It provides hooks to customize the parsing process, allowing for tailored functionality.
- **Simplicity**: Marked is easy to use and integrate into projects, with a simple API.

## Usage in This Project

In this project, Marked is used to:

- **Parse Markdown Content**: Convert markdown files in the subcategory directories into HTML.
- **Generate Static Content**: Work with SvelteKit to generate static HTML content from markdown during the build process.

### Installation

To install Marked, use the following command:

```bash
npm install marked
```

### Example Usage

Here is an example of how Marked is used to parse markdown content:

```js
import { marked } from 'marked';

// Sample markdown content
const markdownContent = \`
# Sample Title

This is a sample markdown content.

- Item 1
- Item 2
- Item 3
\`;

// Convert markdown to HTML
const htmlContent = marked(markdownContent);

console.log(htmlContent);
```

### Integration with SvelteKit

In SvelteKit, Marked is used within the `+page.server.js` file to parse markdown content dynamically:

```js
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

export async function load({ params }) {
	const filePath = path.resolve(
		'static/content',
		params.section,
		params.category,
		params.subcategory,
		'content.md'
	);
	const markdownContent = fs.readFileSync(filePath, 'utf-8');
	const htmlContent = marked(markdownContent);

	return {
		htmlContent
	};
}
```

### Additional Resources

- [Marked Documentation](https://marked.js.org/)
- [Marked GitHub Repository](https://github.com/markedjs/marked)

Feel free to explore these resources to get a deeper understanding of how Marked works and how you can leverage it in your projects.
