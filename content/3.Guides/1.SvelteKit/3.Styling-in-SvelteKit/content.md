# Styling in SvelteKit

Styling is an important aspect of web development. In this guide, we will explore different ways to style your SvelteKit applications.

## CSS in Svelte

You can write CSS directly in your Svelte components. Here’s an example:

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

To define global styles, use a `<style global>` tag:

```html
<style global>
	body {
		margin: 0;
		font-family: Arial, sans-serif;
	}
</style>
```

## CSS Frameworks

SvelteKit supports popular CSS frameworks like TailwindCSS and Bootstrap. Here’s how to set up TailwindCSS:

1. **Install TailwindCSS**:

   ```bash
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure TailwindCSS** in `tailwind.config.js`:

   ```js
   module.exports = {
   	content: ['./src/**/*.{html,js,svelte,ts}'],
   	theme: {
   		extend: {}
   	},
   	plugins: []
   };
   ```

3. **Import TailwindCSS** in your `src/app.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Include the CSS file** in your project:

   ```js
   import './app.css';
   ```

Now you can use TailwindCSS classes in your Svelte components:

```html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
	<h1 class="text-xl font-bold">Hello, TailwindCSS!</h1>
	<p class="text-gray-500">This is styled with TailwindCSS.</p>
</div>
```

## CSS Preprocessors

SvelteKit supports CSS preprocessors like SCSS. Here’s how to set up SCSS:

1. **Install SCSS**:

   ```bash
   npm install -D svelte-preprocess sass
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

   ```html
   <style lang="scss">
   	$primary-color: blue;

   	h1 {
   		color: $primary-color;
   	}
   </style>

   <h1>Hello, SCSS!</h1>
   ```

These styling methods provide flexibility and power to style your SvelteKit applications effectively.
