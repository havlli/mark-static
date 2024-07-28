@Sveltejs/adapter-static is a SvelteKit adapter that allows you to build static sites. This adapter converts your SvelteKit project into static files that can be served by any static hosting provider.

## Why @sveltejs/adapter-static?

- **Static Site Generation**: Generates static HTML files for your SvelteKit project.
- **SEO Friendly**: Pre-renders pages, making them SEO-friendly.
- **Hosting Flexibility**: Can be hosted on any static site hosting platform, such as GitHub Pages, Netlify, or Vercel.

## Usage in This Project

In this project, @sveltejs/adapter-static is used to:

- **Generate Static Files**: Convert dynamic SvelteKit components into static HTML files for deployment.
- **Pre-render Pages**: Ensure all pages are pre-rendered to HTML for better performance and SEO.

### Installation

To install @sveltejs/adapter-static, use the following command:

```bash
npm install @sveltejs/adapter-static
```

### Configuration

The configuration for @sveltejs/adapter-static is defined in `svelte.config.js`:

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

### Example Usage

Here is an example of a SvelteKit project configuration using @sveltejs/adapter-static:

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

### Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [SvelteKit GitHub Repository](https://github.com/sveltejs/kit)
- [Static Adapter Documentation](https://github.com/sveltejs/kit/tree/master/packages/adapter-static)

Feel free to explore these resources to get a deeper understanding of how @sveltejs/adapter-static works and how you can leverage it in your projects.
