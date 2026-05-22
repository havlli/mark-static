# Styling in SvelteKit

Styling is an important aspect of web development. In this guide, we will explore different ways to style your SvelteKit applications.

## CSS in Svelte

You can write scoped CSS directly in Svelte components. Here’s an example:

```html
<script>
	let color = 'blue';
</script>

<style>
	h1 {
		color: var(--color);
	}
</style>

<h1 style="--color: {color}">Hello, styled world!</h1>
```

## Scoped Styles

CSS written in a Svelte component is scoped to that component by default. This means the styles won’t affect other components.

## Global Styles

To define global styles, import a stylesheet from your root layout:

```svelte
<script>
	import '../app.css';
</script>
```

Global CSS can then live in `src/app.css`.

## CSS Frameworks

SvelteKit supports popular CSS frameworks like Tailwind CSS and Bootstrap. Here’s how to set up Tailwind CSS 4 with Vite:

1. **Install Tailwind CSS**:

   ```bash
   pnpm add -D tailwindcss @tailwindcss/vite
   ```

2. **Configure Tailwind CSS** in `vite.config.js`:

   ```js
   import tailwindcss from '@tailwindcss/vite';
   import { sveltekit } from '@sveltejs/kit/vite';
   import { defineConfig } from 'vite';

   export default defineConfig({
    plugins: [tailwindcss(), sveltekit()]
   });
   ```

3. **Import Tailwind CSS** in your `src/app.css`:

   ```css
   @import 'tailwindcss';
   ```

4. **Include the CSS file** in your project:

   ```svelte
   <script>
    import '../app.css';
   </script>
   ```

Now you can use Tailwind CSS classes in your Svelte components:

```svelte
<div class="mx-auto max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-md">
	<h1 class="text-xl font-bold">Hello, Tailwind CSS!</h1>
	<p class="text-gray-500">This is styled with Tailwind CSS.</p>
</div>
```

## CSS Preprocessors

SvelteKit supports CSS preprocessors like SCSS. Here’s how to set up SCSS:

1. **Install SCSS**:

   ```bash
   pnpm add -D svelte-preprocess sass
   ```

2. **Configure SCSS** in `svelte.config.js`:

   ```js
   import sveltePreprocess from 'svelte-preprocess';

   export default {
   	preprocess: sveltePreprocess({
   		scss: {
   			includePaths: ['src']
   		}
   	})
   };
   ```

3. **Use SCSS** in your components:

   ```svelte
   <style lang="scss">
   	$primary-color: blue;

   	h1 {
   		color: $primary-color;
   	}
   </style>

   <h1>Hello, SCSS!</h1>
   ```

These styling methods provide flexibility and power to style your SvelteKit applications effectively.
