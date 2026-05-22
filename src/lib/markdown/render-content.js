import { Marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { parseDocument } from 'htmlparser2';
import { findAll } from 'domutils';
import { render } from 'dom-serializer';
import sanitizeHtml from 'sanitize-html';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';

const hasUrlScheme = (value) => /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);
const isHashUrl = (value) => value.startsWith('#');
const isProtocolRelativeUrl = (value) => value.startsWith('//');
const isRootRelativeUrl = (value) => value.startsWith('/');
const isRelativeUrl = (value) =>
	value && !hasUrlScheme(value) && !isHashUrl(value) && !isProtocolRelativeUrl(value);

const prefixBase = (basePath, value) => `${basePath}${value}`;

const rewriteStaticResourceUrls = (html, page, basePath) => {
	const document = parseDocument(html);
	const resources = findAll(
		(element) => element.attribs && (element.attribs.src || element.attribs.href),
		document.children
	);

	resources.forEach((resource) => {
		if (resource.attribs.src && isRelativeUrl(resource.attribs.src)) {
			resource.attribs.src = isRootRelativeUrl(resource.attribs.src)
				? prefixBase(basePath, resource.attribs.src)
				: `${basePath}${page.assetsBase}/${resource.attribs.src}`;
			resource.attribs.loading = resource.attribs.loading || 'lazy';
		}

		if (resource.attribs.href && isRootRelativeUrl(resource.attribs.href)) {
			resource.attribs.href = prefixBase(basePath, resource.attribs.href);
		}
	});

	return render(document);
};

const sanitizeRenderedMarkdown = (html) =>
	sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([
			'img',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'pre',
			'code',
			'span',
			'table',
			'thead',
			'tbody',
			'tr',
			'th',
			'td',
			'kbd',
			'details',
			'summary'
		]),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			a: ['href', 'name', 'target', 'rel', 'title'],
			code: ['class'],
			h1: ['id'],
			h2: ['id'],
			h3: ['id'],
			h4: ['id'],
			h5: ['id'],
			h6: ['id'],
			img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
			pre: ['class'],
			span: ['class'],
			td: ['align'],
			th: ['align']
		},
		allowedSchemes: ['http', 'https', 'mailto', 'tel'],
		allowProtocolRelative: false,
		transformTags: {
			a(tagName, attribs) {
				if (attribs.href && /^https?:\/\//.test(attribs.href)) {
					return {
						tagName,
						attribs: {
							...attribs,
							target: '_blank',
							rel: 'noopener noreferrer'
						}
					};
				}

				return { tagName, attribs };
			}
		}
	});

const createRenderer = () => {
	const renderer = new Renderer();
	const slugger = new GithubSlugger();

	renderer.heading = function ({ tokens, depth }) {
		const title = tokens.map((token) => token.text || token.raw || '').join(' ');
		const id = slugger.slug(title);
		return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
	};

	return renderer;
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

export async function renderMarkdownContent(markdown, page, basePath = '') {
	const { content: markdownBody } = matter(markdown);
	const html = await marked.parse(markdownBody, { renderer: createRenderer() });
	const sanitizedHtml = sanitizeRenderedMarkdown(html);

	return rewriteStaticResourceUrls(sanitizedHtml, page, basePath);
}
