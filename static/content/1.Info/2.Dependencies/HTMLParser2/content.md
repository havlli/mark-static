# HTMLParser2

HTMLParser2 is a fast and forgiving HTML/XML parser. It is used in this project to parse and manipulate HTML content effectively.

## Why HTMLParser2?

- **Performance**: HTMLParser2 is designed to be fast, making it suitable for parsing large HTML documents.
- **Flexibility**: It can handle various types of documents, including HTML and XML.
- **Error Handling**: HTMLParser2 is forgiving, meaning it can handle malformed HTML gracefully.

## Usage in This Project

In this project, HTMLParser2 is used to:

- **Parse HTML Content**: Extract and manipulate data from HTML content.
- **Transform HTML**: Modify HTML structures dynamically based on specific needs.

### Installation

To install HTMLParser2, use the following command:

```bash
npm install htmlparser2
```

### Example Usage

Here is an example of how HTMLParser2 is used to parse and manipulate HTML content:

```js
import { parseDocument } from 'htmlparser2';
import { DomUtils } from 'domutils';

// Sample HTML content
const htmlContent = `
  <html>
    <body>
      <h1>Title</h1>
      <p>This is a sample paragraph.</p>
    </body>
  </html>
`;

// Parse the HTML content
const document = parseDocument(htmlContent);

// Extract the title
const title = DomUtils.getText(DomUtils.findOne((elem) => elem.name === 'h1', document.children));

// Extract the paragraph text
const paragraph = DomUtils.getText(
	DomUtils.findOne((elem) => elem.name === 'p', document.children)
);

console.log('Title:', title);
console.log('Paragraph:', paragraph);
```

### Integration with SvelteKit

In SvelteKit, HTMLParser2 is used within server-side scripts to parse and manipulate HTML content dynamically:

```js
import { parseDocument } from 'htmlparser2';
import { DomUtils } from 'domutils';
import fs from 'fs';
import path from 'path';

export async function load({ params }) {
	const filePath = path.resolve(
		'static/content',
		params.section,
		params.category,
		params.subcategory,
		'content.html'
	);
	const htmlContent = fs.readFileSync(filePath, 'utf-8');
	const document = parseDocument(htmlContent);

	const title = DomUtils.getText(DomUtils.findOne((elem) => elem.name === 'h1', document.children));
	const paragraph = DomUtils.getText(DomUtils.findOne(elem.name === 'p', document.children));

	return {
		title,
		paragraph
	};
}
```

### Additional Resources

- [HTMLParser2 Documentation](https://github.com/fb55/htmlparser2)
- [HTMLParser2 GitHub Repository](https://github.com/fb55/htmlparser2)

Feel free to explore these resources to get a deeper understanding of how HTMLParser2 works and how you can leverage it in your projects.
