import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const basePath = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'ignore',
			handleHttpError: ({ status, path, referrer, referenceType }) => {
				throw new Error(`${status} ${path} ${referenceType} from ${referrer}`);
			}
		},
		trailingSlash: 'always',
		paths: {
			base: basePath,
			relative: false
		}
	}
};
export default config;
