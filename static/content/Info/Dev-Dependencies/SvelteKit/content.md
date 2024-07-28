SvelteKit is the framework used to build this project. It offers a rich set of features that make building modern web applications efficient and enjoyable.

## Why SvelteKit?

- **Ease of Use**: SvelteKit simplifies the development process with a straightforward and intuitive API.
- **Performance**: By compiling components to highly optimized JavaScript, SvelteKit ensures fast loading times and responsive interactions.
- **Flexibility**: SvelteKit supports server-side rendering, static site generation, and single-page applications, allowing you to choose the best approach for your project.

## Usage in This Project

In this project, SvelteKit is used to handle:

- **Routing**: Dynamic routes are generated based on the folder structure in the `static/content` directory.
- **Markdown Parsing**: Markdown files in the subcategory directories are parsed into HTML.
- **Static Site Generation**: The `@sveltejs/adapter-static` is used to build the project into static files for hosting on static web hosting platforms.

### Installation

To install SvelteKit, use the following command:

```bash
npm install @sveltejs/kit
```

### Configuration

The SvelteKit configuration is defined in `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'ignore'
		}
	}
};
export default config;
```

This configuration sets up SvelteKit with the static adapter, allowing the project to be built into static files.

### Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [SvelteKit GitHub Repository](https://github.com/sveltejs/kit)

Feel free to explore these resources to get a deeper understanding of how SvelteKit works and how you can leverage it in your projects.
