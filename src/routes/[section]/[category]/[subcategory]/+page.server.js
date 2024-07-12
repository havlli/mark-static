import { marked } from 'marked';

export async function load({ params, fetch }) {
	const { section, category, subcategory } = params;
	const response = await fetch(`/content/${section}/${category}/${subcategory}.md`);
	const markdown = await response.text();
	const html = marked(markdown);

	console.log(markdown);
	return {
			title: subcategory,
			content: html,
			test: "text"
	};
}