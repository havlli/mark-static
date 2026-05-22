# SvelteKit

SvelteKit is the framework used to build this project. It provides file-based routing, server-side data loading, prerendering, and adapter-based deployment while keeping the authoring model close to standard Svelte components.

## Why SvelteKit?

- **Routing**: Routes are defined by files, and this project uses a catch-all route for arbitrary content depth.
- **Performance**: Svelte components compile to efficient JavaScript and SvelteKit prerenders static pages when possible.
- **Flexibility**: SvelteKit supports server rendering, static generation, and adapter-based deployment targets.

## Usage in This Project

In this project, SvelteKit is used to handle:

- **Routing**: The `/content/[...slug]` route serves every generated content page.
- **Data Loading**: `+page.server.js` resolves generated page metadata, fetches Markdown, renders it to HTML, sanitizes it, and rewrites local asset URLs.
- **Static Site Generation**: `@sveltejs/adapter-static` prerenders the project into the `build` directory for static hosting.

### Installation

To install SvelteKit, use the following command:

```bash
pnpm add -D @sveltejs/kit @sveltejs/vite-plugin-svelte svelte vite
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
			handleMissingId: 'ignore',
			handleHttpError: 'fail'
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
			relative: false
		}
	}
};
export default config;
```

This configuration sets up SvelteKit with the static adapter, strict prerender error handling, and a configurable `BASE_PATH` for hosts such as GitHub Pages.

### Additional Resources

- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [SvelteKit GitHub Repository](https://github.com/sveltejs/kit)
