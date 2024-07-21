import { marked } from 'marked';
import { sidebarData } from '$lib/data/sidebar.js';

export async function load({ params, fetch }) {
	const { section, category, subcategory } = params;
	const response = await fetch(`/content/${section}/${category}/${subcategory}/content.md`);
	const markdown = await response.text();
	const html = marked(markdown);

	return {
			content: html
	};
}

export function entries() {

	const entries = [];

	sidebarData.forEach(route => {
		route.categories.forEach(category => {
			category.subcategories.forEach(subcategory => {
				entries.push({
					section: route.section,
					category: category.title,
					subcategory: subcategory.title
				});
			});
		});
	});

	return entries;
}