#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { Lexer } from 'marked';
import siteConfig from '../markstatic.config.js';
import { createContentManifest } from './generate-content.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const contentDir = siteConfig.content?.dir ?? 'static/content';
const contentRoot = path.resolve(projectRoot, contentDir);
const staticRoot = path.resolve(projectRoot, 'static');

const hasUrlScheme = (value) => /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);
const isProtocolRelativeUrl = (value) => value.startsWith('//');
const isSkippableUrl = (value) =>
	!value ||
	hasUrlScheme(value) ||
	isProtocolRelativeUrl(value) ||
	value.startsWith('data:') ||
	value.startsWith('mailto:') ||
	value.startsWith('tel:');

function normalizeRoute(route) {
	if (!route || route === '/') return '/';
	return route.replace(/\/+$/, '');
}

function decodePathname(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function splitTarget(value) {
	const [withoutHash, hash = ''] = value.split('#');
	const [pathname] = withoutHash.split('?');

	return {
		pathname,
		hash: hash ? decodePathname(hash) : ''
	};
}

function pageContentPath(page) {
	const relativeContentPath = decodePathname(page.contentFile.replace(/^\/content\/?/, ''));
	return path.join(contentRoot, ...relativeContentPath.split('/').filter(Boolean));
}

function collectTokens(tokens, predicate, collected = []) {
	for (const token of tokens) {
		if (predicate(token)) collected.push(token);

		if (Array.isArray(token.tokens)) {
			collectTokens(token.tokens, predicate, collected);
		}

		if (Array.isArray(token.items)) {
			for (const item of token.items) {
				if (Array.isArray(item.tokens)) {
					collectTokens(item.tokens, predicate, collected);
				}
			}
		}

		if (Array.isArray(token.header)) {
			collectTokens(token.header, predicate, collected);
		}

		if (Array.isArray(token.rows)) {
			for (const row of token.rows) {
				collectTokens(row, predicate, collected);
			}
		}
	}

	return collected;
}

function collectHeadings(tokens) {
	const headings = collectTokens(tokens, (token) => token.type === 'heading');
	const slugger = new GithubSlugger();
	const ids = new Set();

	for (const heading of headings) {
		ids.add(slugger.slug(heading.text));
	}

	return { headings, ids };
}

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

function addIssue(issues, page, message) {
	issues.push(`${page.sourceLabel}: ${message}`);
}

async function validateAsset({ issues, page, sourcePath, assetPath, label }) {
	if (isSkippableUrl(assetPath) || assetPath.startsWith('#')) return;

	const { pathname } = splitTarget(assetPath);
	if (!pathname) return;

	const candidate = pathname.startsWith('/')
		? path.join(staticRoot, decodePathname(pathname))
		: path.resolve(path.dirname(sourcePath), decodePathname(pathname));

	if (!(await exists(candidate))) {
		addIssue(issues, page, `${label} target not found: ${assetPath}`);
	}
}

async function validateLink({
	issues,
	page,
	sourcePath,
	href,
	routes,
	routeHeadings,
	contentPathToRoute
}) {
	if (isSkippableUrl(href)) return;

	const { pathname, hash } = splitTarget(href);

	if (!pathname && hash) {
		if (!page.headingIds.has(hash)) {
			addIssue(issues, page, `heading link target not found: #${hash}`);
		}
		return;
	}

	if (pathname.startsWith('/')) {
		const normalizedPath = normalizeRoute(decodePathname(pathname));

		if (normalizedPath.startsWith('/content')) {
			if (!routes.has(normalizedPath)) {
				addIssue(issues, page, `content route not found: ${pathname}`);
				return;
			}

			if (hash && !routeHeadings.get(normalizedPath)?.has(hash)) {
				addIssue(issues, page, `heading link target not found: ${pathname}#${hash}`);
			}
			return;
		}

		await validateAsset({ issues, page, sourcePath, assetPath: pathname, label: 'Link' });
		return;
	}

	const localFilePath = path.resolve(path.dirname(sourcePath), decodePathname(pathname));
	if (await exists(localFilePath)) {
		const targetRoute = contentPathToRoute.get(localFilePath);

		if (hash && targetRoute && !routeHeadings.get(targetRoute)?.has(hash)) {
			addIssue(issues, page, `heading link target not found: ${href}`);
		}
		return;
	}

	const resolvedRoute = normalizeRoute(
		new URL(href, `https://mark-static.local${page.route}`).pathname
	);
	if (!routes.has(resolvedRoute)) {
		addIssue(issues, page, `link target not found: ${href}`);
		return;
	}

	if (hash && !routeHeadings.get(resolvedRoute)?.has(hash)) {
		addIssue(issues, page, `heading link target not found: ${href}`);
	}
}

async function main() {
	const manifest = await createContentManifest();
	const routes = new Set(manifest.pages.map((page) => normalizeRoute(page.route)));
	routes.add('/content');
	const routeHeadings = new Map();
	const contentPathToRoute = new Map();
	const pageContexts = [];
	const issues = [];

	for (const page of manifest.pages) {
		const sourcePath = pageContentPath(page);
		const markdown = await fs.readFile(sourcePath, 'utf8');
		const parsed = matter(markdown);
		const tokens = Lexer.lex(parsed.content);
		const { headings, ids } = collectHeadings(tokens);
		const sourceLabel = path.relative(projectRoot, sourcePath);
		const context = {
			...page,
			headingIds: ids,
			headings,
			parsed,
			sourceLabel,
			sourcePath,
			tokens
		};

		pageContexts.push(context);
		routeHeadings.set(normalizeRoute(page.route), ids);
		contentPathToRoute.set(sourcePath, normalizeRoute(page.route));
	}

	for (const page of pageContexts) {
		if (!page.parsed.data.title && !page.headings.some((heading) => heading.depth === 1)) {
			addIssue(issues, page, 'missing page title; add frontmatter title or an H1 heading');
		}

		const seenHeadings = new Set();
		for (const heading of page.headings) {
			const key = `${heading.depth}:${heading.text.trim().toLowerCase()}`;
			if (seenHeadings.has(key)) {
				addIssue(issues, page, `duplicate level ${heading.depth} heading: ${heading.text}`);
			}
			seenHeadings.add(key);
		}

		const images = collectTokens(page.tokens, (token) => token.type === 'image');
		for (const image of images) {
			if (!image.text?.trim()) {
				addIssue(issues, page, `image is missing alt text: ${image.href}`);
			}

			await validateAsset({
				issues,
				page,
				sourcePath: page.sourcePath,
				assetPath: image.href,
				label: 'Image'
			});
		}

		const links = collectTokens(page.tokens, (token) => token.type === 'link');
		for (const link of links) {
			await validateLink({
				issues,
				page,
				sourcePath: page.sourcePath,
				href: link.href,
				routes,
				routeHeadings,
				contentPathToRoute
			});
		}
	}

	if (issues.length > 0) {
		console.error(
			`Found ${issues.length} documentation ${issues.length === 1 ? 'issue' : 'issues'}:\n`
		);
		issues.forEach((issue) => console.error(`- ${issue}`));
		process.exitCode = 1;
		return;
	}

	console.log(`Checked ${pageContexts.length} documentation pages.`);
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
