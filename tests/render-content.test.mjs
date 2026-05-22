import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderMarkdownContent } from '../src/lib/markdown/render-content.js';

const testPage = {
	assetsBase: '/content/Guides/Intro'
};

test('renders markdown without exposing frontmatter', async () => {
	const html = await renderMarkdownContent(
		`---
title: Getting Started
description: Internal metadata.
---

# Getting Started

Body content.`,
		testPage
	);

	assert.match(html, /<h1 id="getting-started">Getting Started<\/h1>/);
	assert.match(html, /Body content/);
	assert.doesNotMatch(html, /title: Getting Started/);
	assert.doesNotMatch(html, /description: Internal metadata/);
});

test('rewrites local resource URLs and strips unsafe HTML attributes', async () => {
	const html = await renderMarkdownContent(
		`# Assets

![Architecture diagram](diagram.png)

[Home](/content)

<img src="raw.png" alt="Raw image" onerror="alert(1)">`,
		testPage,
		'/docs'
	);

	assert.match(html, /src="\/docs\/content\/Guides\/Intro\/diagram.png"/);
	assert.match(html, /href="\/docs\/content"/);
	assert.match(html, /src="\/docs\/content\/Guides\/Intro\/raw.png"/);
	assert.doesNotMatch(html, /onerror/);
	assert.match(html, /loading="lazy"/);
});
