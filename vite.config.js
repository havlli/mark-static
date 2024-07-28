import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dataGenerator from './vite-plugin-generate-data.js';

export default defineConfig({
	plugins: [sveltekit(), purgeCss(), dataGenerator()],
	server: { fs: { allow: ['..'] } }
});
