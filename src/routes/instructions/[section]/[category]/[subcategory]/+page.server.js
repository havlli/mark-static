import { marked } from 'marked';
import { sidebarData } from '$lib/data/sidebar.js';
import { parseDocument } from 'htmlparser2';
import { findAll } from 'domutils';
import { render } from 'dom-serializer';

const prependPathToImages = (html, path) => {
	const document = parseDocument(html);
	const images = findAll(el => el.name === 'img', document.children);

	images.forEach(image => {
		const src = image.attribs.src;
		if (src && !src.startsWith('http')) {
			image.attribs.src = `${path}/${src}`;
		}
	});

	return render(document);
};


export async function load({ params, fetch }) {
	const { section, category, subcategory } = params;
	let subcategoryPath = `/content/${section}/${category}/${subcategory}`;
	const response = await fetch(`${subcategoryPath}/content.md`);
	const markdown = await response.text();
	const html = await marked(markdown);
	const updatedHtml = prependPathToImages(html, subcategoryPath);

	return {
			content: updatedHtml
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