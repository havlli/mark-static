import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dataGenerator from './vite-plugin-generate-data.js';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), dataGenerator()],
	server: { fs: { allow: ['..'] } }
});
