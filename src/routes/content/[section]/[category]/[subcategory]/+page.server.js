import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { sidebarData } from '$lib/data/sidebar.js';
import { parseDocument } from 'htmlparser2';
import { findAll } from 'domutils';
import { render } from 'dom-serializer';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';

const prependPathToStaticResources = (html, path) => {
	const document = parseDocument(html);

	const isStaticResource = (element) => {
		const isImage = (element) => element.attribs.src && !element.attribs.src.startsWith('http');
		const isAnchor = (element) => element.attribs.href && !element.attribs.href.startsWith('http');
		return element.attribs && (isImage(element) || isAnchor(element));
	}

	const staticResources = findAll(isStaticResource, document.children);

	staticResources.forEach((resource) => {
		if (resource.attribs.src) {
			resource.attribs.src = `${base}${path}/${resource.attribs.src}`;
		}
		if (resource.attribs.href) {
			resource.attribs.href = `${base}${path}/${resource.attribs.href}`;
		}
	});

	return render(document);
};

const findContentInfo = (route) => {
	const section = sidebarData.find((section) =>
		section.categories.some((category) =>
			category.subcategories.some((subcategory) => subcategory.route === route)
		)
	);

	if (!section) return null;

	const category = section.categories.find((category) =>
		category.subcategories.some((subcategory) => subcategory.route === route)
	);

	if (!category) return null;

	const subcategory = category.subcategories.find((subcategory) => subcategory.route === route);

	return subcategory
		? { categoryTitle: category.title, contentPath: subcategory.contentPath }
		: null;
};

const marked = new Marked(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

export async function load({ params, fetch }) {
	const { section, category, subcategory } = params;

	let paramRoute = `/content/${section}/${category}/${subcategory}`.toLowerCase();
	let contentInfo = findContentInfo(paramRoute);

	if (!contentInfo) {
		throw error(404, 'Not Found');
	}

	const { categoryTitle, contentPath } = contentInfo;
	console.log(`${contentPath}/content.md`);
	const response = await fetch(`${contentPath}/content.md`);

	if (!response.ok) {
		throw error(404, 'Not Found');
	}

	const markdown = await response.text();
	const html = await marked.parse(markdown);
	const updatedHtml = prependPathToStaticResources(html, contentPath);

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
					section: route.section.toLowerCase(),
					category: category.title.toLowerCase(),
					subcategory: subcategory.title.toLowerCase()
				});
			});
		});
	});

	return entries;
}
