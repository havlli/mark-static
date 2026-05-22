import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import siteConfig from '../markstatic.config.js';

const CONTENT_FILE = 'content.md';
const INDEX_FILE = 'index.md';
const PAGE_CONTENT_FILES = new Set([CONTENT_FILE, INDEX_FILE]);
const DEFAULT_CONTENT_DIR = siteConfig.content?.dir ?? 'static/content';
const DEFAULT_OUTPUT_FILE = 'src/lib/generated/content.js';

const scriptPath = fileURLToPath(import.meta.url);
const defaultProjectRoot = path.resolve(path.dirname(scriptPath), '..');
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export function stripOrderPrefix(value) {
	const stripped = value.replace(/^\d+[\s._-]+/, '').trim();
	return stripped || value.trim();
}

export function titleFromSegment(segment) {
	return stripOrderPrefix(segment).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function slugify(value) {
	const slug = stripOrderPrefix(value)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’]/g, '')
		.replace(/&/g, ' and ')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return slug || 'untitled';
}

function orderFromSegment(segment, fallback) {
	const match = segment.match(/^(\d+)(?=[\s._-]+)/);
	return match ? Number(match[1]) : fallback;
}

function toPosixPath(value) {
	return value.split(path.sep).join('/');
}

function encodePathSegment(segment) {
	return encodeURIComponent(segment).replace(/%20/g, '%20');
}

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function findDirectoryContentPath(absolutePath) {
	const contentPath = path.join(absolutePath, CONTENT_FILE);
	if (await exists(contentPath)) return contentPath;

	const indexPath = path.join(absolutePath, INDEX_FILE);
	if (await exists(indexPath)) return indexPath;

	return null;
}

function isMarkdownPageFile(entry) {
	return (
		entry.isFile() &&
		entry.name.toLowerCase().endsWith('.md') &&
		!PAGE_CONTENT_FILES.has(entry.name.toLowerCase())
	);
}

function normalizeFrontmatter(data, sourcePath) {
	const frontmatter = {};

	if (data.title !== undefined) {
		if (typeof data.title !== 'string') {
			throw new Error(`${sourcePath}: frontmatter "title" must be a string`);
		}
		frontmatter.title = data.title.trim();
	}

	if (data.description !== undefined) {
		if (typeof data.description !== 'string') {
			throw new Error(`${sourcePath}: frontmatter "description" must be a string`);
		}
		frontmatter.description = data.description.trim();
	}

	if (data.slug !== undefined) {
		if (typeof data.slug !== 'string') {
			throw new Error(`${sourcePath}: frontmatter "slug" must be a string`);
		}
		frontmatter.slug = data.slug.trim();
	}

	if (data.order !== undefined) {
		const order = Number(data.order);
		if (!Number.isFinite(order)) {
			throw new Error(`${sourcePath}: frontmatter "order" must be a number`);
		}
		frontmatter.order = order;
	}

	if (data.draft !== undefined) {
		if (typeof data.draft !== 'boolean') {
			throw new Error(`${sourcePath}: frontmatter "draft" must be true or false`);
		}
		frontmatter.draft = data.draft;
	}

	if (data.tags !== undefined) {
		if (typeof data.tags === 'string') {
			frontmatter.tags = data.tags
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean);
		} else if (Array.isArray(data.tags) && data.tags.every((tag) => typeof tag === 'string')) {
			frontmatter.tags = data.tags.map((tag) => tag.trim()).filter(Boolean);
		} else {
			throw new Error(`${sourcePath}: frontmatter "tags" must be a string or string array`);
		}
	}

	return frontmatter;
}

function removeCodeBlocks(markdown) {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/~~~[\s\S]*?~~~/g, ' ')
		.replace(/`[^`]*`/g, ' ');
}

function plainTextFromMarkdown(markdown) {
	return removeCodeBlocks(markdown)
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/[>*_~`#[\]()-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractHeadings(markdown) {
	const headings = [];
	const slugger = new GithubSlugger();
	const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
	const searchableMarkdown = removeCodeBlocks(markdown);
	let match;

	while ((match = headingPattern.exec(searchableMarkdown)) !== null) {
		const title = match[2].replace(/\s+#*$/, '').trim();

		headings.push({
			depth: match[1].length,
			id: slugger.slug(title),
			title
		});
	}

	return headings;
}

function firstHeading(markdown) {
	return extractHeadings(markdown).find((heading) => heading.depth === 1)?.title;
}

async function readNodeDescriptor(contentRoot, absolutePath, segment, fallbackOrder) {
	const stats = await fs.stat(absolutePath);
	const isFile = stats.isFile();
	const contentPath = isFile ? absolutePath : await findDirectoryContentPath(absolutePath);
	const hasContent = Boolean(contentPath);
	const sourceSegment = isFile ? segment.replace(/\.md$/i, '') : segment;
	let body = '';
	let frontmatter = {};

	if (hasContent) {
		const fileContent = await fs.readFile(contentPath, 'utf8');
		const parsed = matter(fileContent);
		body = parsed.content;
		frontmatter = normalizeFrontmatter(
			parsed.data,
			toPosixPath(path.relative(contentRoot, contentPath))
		);
	}

	const title = frontmatter.title || firstHeading(body) || titleFromSegment(sourceSegment);
	const order = frontmatter.order ?? orderFromSegment(sourceSegment, fallbackOrder);
	const slug = slugify(frontmatter.slug || sourceSegment);

	return {
		absolutePath,
		assetPath: isFile ? path.dirname(absolutePath) : absolutePath,
		body,
		contentPath,
		frontmatter,
		hasContent,
		isFile,
		order,
		segment,
		sourceSegment,
		slug,
		title
	};
}

async function readChildDescriptors(contentRoot, absolutePath) {
	const entries = await fs.readdir(absolutePath, { withFileTypes: true });
	const pageEntries = entries.filter((entry) => entry.isDirectory() || isMarkdownPageFile(entry));
	const descriptors = await Promise.all(
		pageEntries.map((entry, index) =>
			readNodeDescriptor(contentRoot, path.join(absolutePath, entry.name), entry.name, index + 1)
		)
	);

	return descriptors.sort((a, b) => a.order - b.order || collator.compare(a.title, b.title));
}

function assertUniqueSiblingSlugs(descriptors, parentPath) {
	const seen = new Map();

	for (const descriptor of descriptors) {
		if (seen.has(descriptor.slug)) {
			throw new Error(
				`Duplicate slug "${descriptor.slug}" below ${parentPath}: "${seen.get(
					descriptor.slug
				)}" and "${descriptor.segment}"`
			);
		}
		seen.set(descriptor.slug, descriptor.segment);
	}
}

function createSearchEntry(page) {
	const breadcrumb = page.breadcrumb.map((item) => item.title);

	return {
		id: page.id,
		title: page.title,
		section: breadcrumb[0] || page.title,
		category: breadcrumb.length > 1 ? breadcrumb[breadcrumb.length - 2] : '',
		subcategory: page.title,
		breadcrumb,
		description: page.description,
		tags: page.tags,
		route: page.route,
		headings: page.headings,
		searchText: [breadcrumb.join(' '), page.description, page.tags.join(' '), page.searchText]
			.filter(Boolean)
			.join(' ')
	};
}

function findFirstPageRoute(node) {
	if (node.route) return node.route;

	for (const child of node.children) {
		const route = findFirstPageRoute(child);
		if (route) return route;
	}

	return null;
}

async function readNavigationNode(descriptor, context, parent) {
	const nextSlugSegments = [...parent.slugSegments, descriptor.slug];
	const slugPath = nextSlugSegments.join('/');
	const sourcePath = toPosixPath(path.relative(context.contentRoot, descriptor.absolutePath));
	const sourceContentPath = descriptor.contentPath
		? toPosixPath(path.relative(context.contentRoot, descriptor.contentPath))
		: null;
	const sourceAssetPath = toPosixPath(path.relative(context.contentRoot, descriptor.assetPath));
	const encodedContentPath = sourceContentPath
		? sourceContentPath.split('/').map(encodePathSegment).join('/')
		: null;
	const encodedAssetPath = sourceAssetPath
		.split('/')
		.filter(Boolean)
		.map(encodePathSegment)
		.join('/');
	const assetsBase = encodedAssetPath ? `/content/${encodedAssetPath}` : '/content';
	const route = `/content/${slugPath}`;
	const isPageIncluded =
		descriptor.hasContent && !(descriptor.frontmatter.draft && !context.includeDrafts);
	const breadcrumb = [
		...parent.breadcrumb,
		{ title: descriptor.title, slug: descriptor.slug, route: isPageIncluded ? route : null }
	];

	const children = [];
	const node = {
		id: slugPath,
		title: descriptor.title,
		slug: descriptor.slug,
		slugPath,
		sourcePath,
		order: descriptor.order,
		route: isPageIncluded ? route : null,
		firstPageRoute: null,
		children
	};

	if (isPageIncluded) {
		const headings = extractHeadings(descriptor.body);
		const page = {
			id: slugPath,
			title: descriptor.title,
			description: descriptor.frontmatter.description || '',
			tags: descriptor.frontmatter.tags || [],
			draft: descriptor.frontmatter.draft || false,
			route,
			slugPath,
			sourcePath,
			assetsBase,
			contentFile: `/content/${encodedContentPath}`,
			order: descriptor.order,
			breadcrumb,
			headings,
			searchText: plainTextFromMarkdown(descriptor.body),
			frontmatter: descriptor.frontmatter
		};

		context.pages.push(page);
	} else {
		node.route = null;
	}

	const childDescriptors = descriptor.isFile
		? []
		: await readChildDescriptors(context.contentRoot, descriptor.absolutePath);
	assertUniqueSiblingSlugs(childDescriptors, sourcePath || context.contentRoot);

	for (const childDescriptor of childDescriptors) {
		const child = await readNavigationNode(childDescriptor, context, {
			breadcrumb,
			slugSegments: nextSlugSegments
		});
		if (child) children.push(child);
	}

	node.firstPageRoute = findFirstPageRoute(node);

	return node.route || node.children.length > 0 ? node : null;
}

export async function createContentManifest(options = {}) {
	const projectRoot = path.resolve(options.rootDir || defaultProjectRoot);
	const contentRoot = path.resolve(projectRoot, options.contentDir || DEFAULT_CONTENT_DIR);
	const includeDrafts = options.includeDrafts ?? process.env.INCLUDE_DRAFTS === 'true';

	if (!(await exists(contentRoot))) {
		throw new Error(`Content directory does not exist: ${contentRoot}`);
	}

	const context = {
		contentRoot,
		includeDrafts,
		pages: []
	};

	const rootDescriptors = await readChildDescriptors(contentRoot, contentRoot);
	assertUniqueSiblingSlugs(rootDescriptors, contentRoot);

	const navigation = [];
	for (const descriptor of rootDescriptors) {
		const node = await readNavigationNode(descriptor, context, {
			breadcrumb: [],
			slugSegments: []
		});
		if (node) navigation.push(node);
	}

	if (context.pages.length === 0) {
		throw new Error(`No Markdown content pages were found in ${contentRoot}`);
	}

	const seenSlugPaths = new Set();
	const seenRoutes = new Set();
	for (const page of context.pages) {
		if (seenSlugPaths.has(page.slugPath)) {
			throw new Error(`Duplicate page slug path: ${page.slugPath}`);
		}
		if (seenRoutes.has(page.route)) {
			throw new Error(`Duplicate page route: ${page.route}`);
		}
		seenSlugPaths.add(page.slugPath);
		seenRoutes.add(page.route);
	}

	return {
		generatedAt: new Date(0).toISOString(),
		contentDir: toPosixPath(path.relative(projectRoot, contentRoot)),
		firstPageRoute: context.pages[0].route,
		navigation,
		pages: context.pages,
		searchIndex: context.pages.map(createSearchEntry)
	};
}

export async function writeContentManifest(options = {}) {
	const projectRoot = path.resolve(options.rootDir || defaultProjectRoot);
	const outputFile = path.resolve(projectRoot, options.outputFile || DEFAULT_OUTPUT_FILE);
	const manifest = await createContentManifest(options);
	const contents = `export const contentManifest = ${JSON.stringify(manifest, null, 2)};\n\nexport const navigation = contentManifest.navigation;\nexport const pages = contentManifest.pages;\nexport const pagesBySlugPath = Object.fromEntries(pages.map((page) => [page.slugPath, page]));\nexport const pagesByRoute = Object.fromEntries(pages.map((page) => [page.route, page]));\nexport const searchIndex = contentManifest.searchIndex;\nexport const firstPageRoute = contentManifest.firstPageRoute;\n`;

	await fs.mkdir(path.dirname(outputFile), { recursive: true });
	await fs.writeFile(outputFile, contents);

	return { manifest, outputFile };
}

if (scriptPath === path.resolve(process.argv[1] || '')) {
	const { manifest, outputFile } = await writeContentManifest();
	console.log(`Generated ${manifest.pages.length} content pages into ${outputFile}`);
}
