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
