# ESLint

ESLint is a static code analysis tool for identifying and fixing problems in JavaScript code. It is used in this project to maintain code quality and consistency by enforcing coding standards and best practices.

## Why ESLint?

- **Code Quality**: Helps maintain high code quality by identifying potential errors and enforcing coding standards.
- **Consistency**: Ensures code consistency across the project by enforcing a common set of rules.
- **Customization**: Highly customizable, allowing you to define your own linting rules or use predefined ones.

## Usage in This Project

In this project, ESLint is used to:

- **Lint JavaScript Code**: Identify and fix problems in JavaScript and Svelte code.
- **Enforce Coding Standards**: Ensure that the code adheres to predefined coding standards and best practices.

### Installation

To install ESLint, use the following command:

```bash
pnpm add -D eslint @eslint/js
```

Additionally, install the necessary plugins for Svelte and Prettier integration:

```bash
pnpm add -D eslint-plugin-svelte eslint-config-prettier @types/eslint
```

### Configuration

The ESLint configuration is defined in `eslint.config.js` using ESLint’s flat config format:

```js
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				console: 'readonly',
				document: 'readonly',
				localStorage: 'readonly',
				process: 'readonly',
				window: 'readonly'
			}
		}
	}
];
```

### Example Usage

The project runs Prettier first, then ESLint:

```json
{
	"scripts": {
		"lint": "prettier --check . && eslint ."
	}
}
```

Run the linting process with:

```bash
pnpm lint
```

### Integration with SvelteKit

In SvelteKit, ESLint is configured to work with both JavaScript and Svelte files:

```js
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module'
		}
	}
];
```

### Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/use/getting-started)
- [ESLint GitHub Repository](https://github.com/eslint/eslint)
- [ESLint Plugin for Svelte](https://github.com/sveltejs/eslint-plugin-svelte)
- [Prettier Integration](https://prettier.io/docs/en/integrating-with-linters.html)

Feel free to explore these resources to get a deeper understanding of how ESLint works and how you can leverage it in your projects.
