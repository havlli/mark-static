import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import siteConfig from './markstatic.config.js';

const configuredBasePath = siteConfig.site?.basePath ?? '';
const basePath = process.argv.includes('dev') ? '' : (process.env.BASE_PATH ?? configuredBasePath);

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
			base: basePath,
			relative: false
		}
	}
};
export default config;
