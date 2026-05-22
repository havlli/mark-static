# Skeleton UI

Skeleton UI is a Svelte and Tailwind CSS toolkit used in this project for theme tokens, utility classes, and consistent interface styling.

## Why Skeleton UI?

- **Tailwind CSS 4 Support**: Skeleton 4 ships as CSS that plugs into the Tailwind 4 pipeline.
- **Theme Tokens**: Theme packages expose design tokens for colors, typography, spacing, and surfaces.
- **Utility Classes**: Common UI primitives such as buttons, cards, and form controls are available as utilities.

## Usage in This Project

In this project, Skeleton UI is used to:

- **Theme Styling**: The Wintry theme provides the base color palette and typography tokens.
- **UI Utilities**: Header controls, buttons, cards, and content surfaces use Skeleton-style utilities where useful.
- **Compatibility Layer**: A small local CSS layer keeps the original template’s header controls visually stable after the Skeleton 4 upgrade.

### Installation

To install Skeleton UI, use the following command:

```bash
pnpm add -D @skeletonlabs/skeleton
```

### Configuration

Skeleton 4 is imported directly from CSS. This project imports Skeleton after Tailwind, then adds the Wintry theme:

```css
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton/themes/wintry';
```

This replaces the older Skeleton v2 `@skeletonlabs/tw-plugin` setup and does not require a `tailwind.config.js` file for this project.

### Example Usage

Here is an example of using Skeleton utility classes:

```svelte
<button class="btn preset-filled-primary-500">Click Me</button>
```

### Additional Resources

- [Skeleton UI Documentation](https://v4.skeleton.dev/)
- [Skeleton UI GitHub Repository](https://github.com/skeletonlabs/skeleton)

Feel free to explore these resources to get a deeper understanding of how Skeleton UI works and how you can leverage it in your projects.
