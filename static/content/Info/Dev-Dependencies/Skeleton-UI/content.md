Skeleton UI is a set of highly customizable UI components for TailwindCSS, used in this project to provide a cohesive and visually appealing design.

## Why Skeleton UI?

- **Pre-built Components**: Provides a variety of pre-built UI components that can be easily integrated into the project.
- **Customization**: Allows extensive customization to match the design requirements of the project.
- **Compatibility**: Works seamlessly with TailwindCSS, leveraging its utility-first approach.

## Usage in This Project

In this project, Skeleton UI is used to:

- **Enhance UI**: Provides a set of components like buttons, modals, and form elements that enhance the overall user interface.
- **Theming**: Allows the creation of custom themes to maintain a consistent look and feel across the application.

### Installation

To install Skeleton UI, use the following command:

```bash
npm install @skeletonlabs/skeleton @skeletonlabs/tw-plugin
```

### Configuration

The TailwindCSS configuration to include Skeleton UI is defined in `tailwind.config.js`:

```js
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'selector',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: {
				preset: [
					{
						name: 'wintry',
						enhancements: true
					}
				]
			}
		})
	]
};
```

This configuration sets up TailwindCSS with the Skeleton UI plugin, enabling the use of Skeleton UI components and theming capabilities.

### Example Usage

Here is an example of using a Skeleton UI button component:

```svelte
<script>
	import { Button } from '@skeletonlabs/skeleton';
</script>

<Button color="primary">Click Me</Button>
```

### Additional Resources

- [Skeleton UI Documentation](https://www.skeletonlabs.dev/docs)
- [Skeleton UI GitHub Repository](https://github.com/skeletonlabs/skeleton)

Feel free to explore these resources to get a deeper understanding of how Skeleton UI works and how you can leverage it in your projects.
