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
			handleHttpError: ({ status, path, referrer, referenceType }) => {
				console.log(`HTTP Error: ${status} on path: ${path}, referrer: ${referrer}, type: ${referenceType}`);
				if (status === 404) {
					return; // Ignore 404 errors during prerendering
				}
				throw new Error(`${status} ${path} ${referenceType} from ${referrer}`);
			}
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
			relative: false
		}
	}
};
export default config;
