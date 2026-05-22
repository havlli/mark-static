import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createContentManifest } from '../scripts/generate-content.mjs';

async function createFixture() {
	return fs.mkdtemp(path.join(os.tmpdir(), 'mark-static-'));
}

async function writeMarkdown(contentDir, segments, markdown) {
	const directory = path.join(contentDir, ...segments);
	await fs.mkdir(directory, { recursive: true });
	await fs.writeFile(path.join(directory, 'content.md'), markdown);
}

async function writeMarkdownFile(contentDir, segments, markdown) {
	const filePath = path.join(contentDir, ...segments);
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, markdown);
}

test('generates stable routes for arbitrary nested content folders', async () => {
	const contentDir = await createFixture();

	await writeMarkdown(
		contentDir,
		['01.Guides', '02.API v2', '003.Auth Flow'],
		`---
title: OAuth Flow
description: Configure API authentication.
tags:
  - auth
  - api
---

# Auth Flow

Body content for search.`
	);

	const manifest = await createContentManifest({ contentDir });
	const [page] = manifest.pages;

	assert.equal(manifest.pages.length, 1);
	assert.equal(page.title, 'OAuth Flow');
	assert.equal(page.route, '/content/guides/api-v2/auth-flow');
	assert.equal(page.assetsBase, '/content/01.Guides/02.API%20v2/003.Auth%20Flow');
	assert.deepEqual(page.tags, ['auth', 'api']);
	assert.equal(page.headings[0].id, 'auth-flow');
	assert.equal(manifest.firstPageRoute, page.route);
	assert.equal(manifest.navigation[0].children[0].children[0].route, page.route);
});

test('generates pages from markdown files dropped into folders', async () => {
	const contentDir = await createFixture();

	await writeMarkdownFile(
		contentDir,
		['01.Guides', '02.Installation.md'],
		`---
title: Installation
description: Install the project.
---

# Install

Drop a Markdown file into the docs tree.`
	);

	const manifest = await createContentManifest({ contentDir });
	const [page] = manifest.pages;

	assert.equal(manifest.pages.length, 1);
	assert.equal(page.title, 'Installation');
	assert.equal(page.route, '/content/guides/installation');
	assert.equal(page.assetsBase, '/content/01.Guides');
	assert.equal(page.contentFile, '/content/01.Guides/02.Installation.md');
	assert.equal(manifest.navigation[0].children[0].route, page.route);
});

test('uses index markdown files as folder landing pages', async () => {
	const contentDir = await createFixture();

	await writeMarkdownFile(contentDir, ['Guides', 'index.md'], '# Guides');
	await writeMarkdownFile(contentDir, ['Guides', '01.Quick Start.md'], '# Quick Start');

	const manifest = await createContentManifest({ contentDir });
	const [landing, child] = manifest.pages;

	assert.equal(manifest.pages.length, 2);
	assert.equal(landing.route, '/content/guides');
	assert.equal(landing.contentFile, '/content/Guides/index.md');
	assert.equal(child.route, '/content/guides/quick-start');
	assert.equal(manifest.navigation[0].route, landing.route);
	assert.equal(manifest.navigation[0].children[0].route, child.route);
});

test('fails when sibling folders resolve to the same slug', async () => {
	const contentDir = await createFixture();

	await writeMarkdown(contentDir, ['Guides', '01.API'], '# Numbered API');
	await writeMarkdown(contentDir, ['Guides', 'API'], '# Plain API');

	await assert.rejects(
		() => createContentManifest({ contentDir }),
		/Duplicate slug "api" below Guides/
	);
});

test('fails when sibling files and folders resolve to the same slug', async () => {
	const contentDir = await createFixture();

	await writeMarkdown(contentDir, ['Guides', 'API'], '# Directory API');
	await writeMarkdownFile(contentDir, ['Guides', '01.API.md'], '# File API');

	await assert.rejects(
		() => createContentManifest({ contentDir }),
		/Duplicate slug "api" below Guides/
	);
});
