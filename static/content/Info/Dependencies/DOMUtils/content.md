DOMUtils is a utility library for working with the DOM in Node.js. It provides a set of methods to manipulate and traverse DOM trees, making it easier to work with HTML content in server-side environments.

## Why DOMUtils?

- **Ease of Use**: DOMUtils simplifies common DOM manipulation tasks with a straightforward API.
- **Integration**: Works seamlessly with HTMLParser2 to manipulate parsed HTML content.
- **Flexibility**: Offers a wide range of methods for DOM traversal, manipulation, and querying.

## Usage in This Project

In this project, DOMUtils is used to:

- **Traverse DOM Trees**: Navigate through the DOM tree to locate specific elements.
- **Manipulate DOM**: Modify HTML content dynamically based on the project’s needs.
- **Extract Data**: Extract text and attribute values from specific HTML elements.

### Installation

To install DOMUtils, use the following command:

```bash
npm install domutils
```

### Example Usage

Here is an example of how DOMUtils is used to traverse and manipulate DOM trees:

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

// Modify the paragraph text
const paragraphElement = DomUtils.findOne((elem) => elem.name === 'p', document.children);
paragraphElement.children[0].data = 'This is the modified paragraph content.';

console.log('Title:', title);
console.log('Paragraph:', DomUtils.getText(paragraphElement));
```

### Integration with SvelteKit

In SvelteKit, DOMUtils is used within server-side scripts to manipulate HTML content dynamically:

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
	const paragraph = DomUtils.getText(
		DomUtils.findOne((elem) => elem.name === 'p', document.children)
	);

	return {
		title,
		paragraph
	};
}
```

### Additional Resources

- [DOMUtils Documentation](https://github.com/fb55/domutils)
- [DOMUtils GitHub Repository](https://github.com/fb55/domutils)

Feel free to explore these resources to get a deeper understanding of how DOMUtils works and how you can leverage it in your projects.
