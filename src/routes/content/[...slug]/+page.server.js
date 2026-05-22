import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { pages, pagesBySlugPath } from '$lib/generated/content.js';
import { renderMarkdownContent } from '$lib/markdown/render-content.js';

const prefixBase = (value) => `${base}${value}`;

export async function load({ params, fetch }) {
	const page = pagesBySlugPath[params.slug];

	if (!page) {
		throw error(404, 'Not Found');
	}

	const response = await fetch(prefixBase(page.contentFile));

	if (!response.ok) {
		throw error(404, 'Not Found');
	}

	const markdown = await response.text();
	const content = await renderMarkdownContent(markdown, page, base);

	return {
		content,
		page
	};
}

export function entries() {
	return pages.map((page) => ({
		slug: page.slugPath
	}));
}
