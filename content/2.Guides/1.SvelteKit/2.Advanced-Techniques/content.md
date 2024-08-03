# Advanced Techniques in SvelteKit

In this tutorial, we will explore some advanced techniques to enhance your SvelteKit applications.

## Server-Side Rendering (SSR)

SvelteKit supports server-side rendering out of the box. This allows you to pre-render pages on the server before sending them to the client.

### Enabling SSR

To enable SSR, configure your SvelteKit project to use a suitable adapter like `@sveltejs/adapter-node`:

```bash
npm install @sveltejs/adapter-node
```

Update your `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter(),
		target: '#svelte'
	}
};
```

## Fetching Data

You can fetch data from external APIs and use it in your components. Here's an example of fetching data in a `load` function:

```js
export async function load({ fetch }) {
	const response = await fetch('https://api.example.com/data');
	const data = await response.json();

	return {
		props: {
			data
		}
	};
}
```

Use the fetched data in your Svelte component:

```html
<script context="module">
	export async function load({ fetch }) {
		const response = await fetch('/api/data');
		return {
			props: {
				data: await response.json()
			}
		};
	}
</script>

<script>
	export let data;
</script>

<main>
	<h1>Data from API</h1>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</main>
```

## Using Stores

Svelte stores provide a reactive way to manage state across your application. Here's an example of creating and using a writable store:

```js
// src/stores.js
import { writable } from 'svelte/store';

export const count = writable(0);
```

Use the store in a Svelte component:

```html
<script>
	import { count } from '../stores';

	function increment() {
		count.update((n) => n + 1);
	}
</script>

<button on:click="{increment}">Clicked {$count} times</button>
```

These techniques will help you build more dynamic and efficient SvelteKit applications.
