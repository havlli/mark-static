import { marked } from 'marked';
import { sidebarData } from '$lib/data/sidebar.js';
import { parseDocument } from 'htmlparser2';
import { findAll } from 'domutils';
import { render } from 'dom-serializer';

const prependPathToStaticImages = (html, path) => {
	const document = parseDocument(html);
	const images = findAll((el) => el.name === 'img', document.children);

	images.forEach((image) => {
		const src = image.attribs.src;
		if (src && !src.startsWith('http')) {
			image.attribs.src = `${path}/${src}`;
		}
	});

	return render(document);
};

const findContentInfo = (route) => {
	const section = sidebarData.find(section =>
		section.categories.some(category =>
			category.subcategories.some(subcategory => subcategory.route === route)
		)
	);

	if (!section) return null;

	const category = section.categories.find(category =>
		category.subcategories.some(subcategory => subcategory.route === route)
	);

	if (!category) return null;

	const subcategory = category.subcategories.find(subcategory => subcategory.route === route);

	return subcategory ? { categoryTitle: category.title, contentPath: subcategory.contentPath } : null;
}

export async function load({ params, fetch }) {
	const { section, category, subcategory } = params;

	let paramRoute = `/content/${section}/${category}/${subcategory}`.toLowerCase();
	let contentInfo = findContentInfo(paramRoute);

	const { categoryTitle, contentPath } = contentInfo;
	const response = await fetch(`${contentPath}/content.md`);
	const markdown = await response.text();
	const html = await marked(markdown);
	const updatedHtml = prependPathToStaticImages(html, contentPath);

	return {
		content: updatedHtml,
		categoryTitle
	};
}

export function entries() {
	const entries = [];

	sidebarData.forEach((route) => {
		route.categories.forEach((category) => {
			category.subcategories.forEach((subcategory) => {
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
