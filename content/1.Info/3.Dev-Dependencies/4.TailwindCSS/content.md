# Tailwind CSS

Tailwind CSS is the utility-first CSS framework used to style this project. The current setup uses Tailwind CSS 4 with the official Vite plugin.

## Why Tailwind CSS?

- **Utility-First Approach**: Tailwind CSS provides low-level utility classes that let you build completely custom designs without having to write any custom CSS.
- **CSS-First Configuration**: Tailwind 4 supports theme tokens and custom variants directly in CSS.
- **Efficiency**: Tailwind CSS helps in writing less code and achieving responsive design faster compared to traditional CSS.

## Usage in This Project

In this project, Tailwind CSS is used to:

- **Style Components**: Tailwind utility classes are used throughout the Svelte components.
- **Theme Integration**: Skeleton 4 theme styles are imported alongside Tailwind CSS.
- **Responsive Design**: Breakpoint utilities drive the layout across mobile, tablet, and desktop views.

### Installation

To install Tailwind CSS, use the following commands:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

### Configuration

Tailwind CSS is registered in `vite.config.js`:

```js
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
```

Tailwind is imported in `src/app.css`:

```css
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton/themes/wintry';

@custom-variant dark (&:where(.dark, .dark *));

@theme {
	--font-heading-token: ui-sans-serif, system-ui, sans-serif;
}
```

This setup replaces the older PostCSS plus `tailwind.config.js` workflow for this project.

### Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS GitHub Repository](https://github.com/tailwindlabs/tailwindcss)
- [Skeleton Labs Documentation](https://v4.skeleton.dev/)

Feel free to explore these resources to get a deeper understanding of how Tailwind CSS works and how you can leverage it in your projects.
