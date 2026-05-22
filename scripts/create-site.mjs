#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { writeContentManifest, slugify } from './generate-content.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const presetsRoot = path.join(projectRoot, 'presets/content');
const defaultContentDir = 'static/content';

const contentPresets = {
	minimal: 'One starter page with the basic authoring model.',
	basic: 'A small docs tree with guides and reference pages.',
	api: 'A starter API reference structure.'
};

const themePresets = {
	default: 'Default blue documentation theme.',
	forest: 'Green accent preset.',
	mono: 'Neutral monochrome preset.'
};

const backgroundPresets = {
	aurora: 'Soft radial background.',
	grid: 'Subtle documentation grid.',
	none: 'No decorative background.'
};

const deployTargets = {
	'github-pages': 'GitHub Pages project site.',
	netlify: 'Netlify or another root-hosted static site.',
	vercel: 'Vercel static deployment.',
	static: 'Plain static files from pnpm build.'
};

const includedDotfileEntries = new Set([
	'.github',
	'.gitignore',
	'.npmrc',
	'.prettierignore',
	'.prettierrc'
]);
const excludedRootEntries = new Set([
	'.git',
	'.svelte-kit',
	'build',
	'node_modules',
	'package',
	'presets'
]);

function parseArgs(argv) {
	const args = [...argv];
	if (args[0] === 'init' || args[0] === 'create') args.shift();

	const flags = {};
	const positional = [];

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (!arg.startsWith('--')) {
			positional.push(arg);
			continue;
		}

		const [rawName, inlineValue] = arg.slice(2).split('=');
		const name = rawName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

		if (inlineValue !== undefined) {
			flags[name] = inlineValue;
		} else if (args[index + 1] && !args[index + 1].startsWith('--')) {
			flags[name] = args[index + 1];
			index += 1;
		} else {
			flags[name] = true;
		}
	}

	return { flags, positional };
}

function normalizePackageName(value) {
	return slugify(value).replace(/^-+|-+$/g, '') || 'docs-site';
}

function titleFromPackageName(value) {
	return value
		.split('-')
		.filter(Boolean)
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

function assertChoice(value, choices, label) {
	if (!Object.hasOwn(choices, value)) {
		throw new Error(
			`Unknown ${label} "${value}". Choose one of: ${Object.keys(choices).join(', ')}`
		);
	}
}

async function askText(rl, question, fallback, interactive) {
	if (!interactive) return fallback;

	const answer = await rl.question(`${question} (${fallback}): `);
	return answer.trim() || fallback;
}

async function askChoice(rl, question, choices, fallback, interactive) {
	if (!interactive) return fallback;

	const entries = Object.entries(choices);
	console.log(`\n${question}`);
	entries.forEach(([key, description], index) => {
		console.log(`  ${index + 1}. ${key} - ${description}`);
	});

	const answer = await rl.question(`Choose ${fallback}: `);
	const trimmed = answer.trim();
	if (!trimmed) return fallback;

	const index = Number(trimmed);
	if (Number.isInteger(index) && index >= 1 && index <= entries.length) {
		return entries[index - 1][0];
	}

	assertChoice(trimmed, choices, question.toLowerCase());
	return trimmed;
}

async function ensureEmptyTarget(targetDir) {
	const resolvedTarget = path.resolve(targetDir);
	await fs.mkdir(path.dirname(resolvedTarget), { recursive: true });

	try {
		const entries = await fs.readdir(resolvedTarget);
		if (entries.length > 0) {
			throw new Error(`Target directory is not empty: ${resolvedTarget}`);
		}
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}

	return resolvedTarget;
}

async function copyProjectTemplate(targetDir) {
	const targetInsideSource = path.relative(projectRoot, targetDir);

	await fs.cp(projectRoot, targetDir, {
		recursive: true,
		filter(source) {
			const relativePath = path.relative(projectRoot, source);
			if (!relativePath) return true;

			if (
				targetInsideSource &&
				!targetInsideSource.startsWith('..') &&
				!path.isAbsolute(targetInsideSource) &&
				(relativePath === targetInsideSource ||
					relativePath.startsWith(`${targetInsideSource}${path.sep}`))
			) {
				return false;
			}

			const [rootEntry] = relativePath.split(path.sep);
			if (rootEntry.startsWith('.') && !includedDotfileEntries.has(rootEntry)) return false;

			return !excludedRootEntries.has(rootEntry);
		}
	});
}

async function copyContentPreset(targetDir, preset) {
	const presetDir = path.join(presetsRoot, preset);
	const contentDir = path.join(targetDir, defaultContentDir);

	await fs.rm(contentDir, { recursive: true, force: true });
	await fs.mkdir(path.dirname(contentDir), { recursive: true });
	await fs.cp(presetDir, contentDir, { recursive: true });
}

function createConfig({
	siteName,
	description,
	packageName,
	themePreset,
	backgroundPreset,
	deployTarget
}) {
	const basePath = deployTarget === 'github-pages' ? `/${packageName}` : '';

	return {
		site: {
			name: siteName,
			description,
			docsLabel: 'Documentation',
			repositoryUrl: '',
			basePath,
			language: 'en'
		},
		content: {
			dir: defaultContentDir
		},
		theme: {
			skeleton: 'wintry',
			preset: themePreset,
			background: backgroundPreset
		},
		homepage: {
			title: `${siteName} Documentation`,
			description,
			primaryLabel: 'Open documentation',
			secondaryLabel: 'View on GitHub'
		}
	};
}

function jsString(value) {
	return `'${value
		.replace(/\\/g, '\\\\')
		.replace(/'/g, "\\'")
		.replace(/\r/g, '\\r')
		.replace(/\n/g, '\\n')}'`;
}

async function writeSiteConfig(targetDir, config) {
	const contents = `export default {
\tsite: {
\t\tname: ${jsString(config.site.name)},
\t\tdescription: ${jsString(config.site.description)},
\t\tdocsLabel: ${jsString(config.site.docsLabel)},
\t\trepositoryUrl: ${jsString(config.site.repositoryUrl)},
\t\tbasePath: ${jsString(config.site.basePath)},
\t\tlanguage: ${jsString(config.site.language)}
\t},
\tcontent: {
\t\tdir: ${jsString(config.content.dir)}
\t},
\ttheme: {
\t\tskeleton: ${jsString(config.theme.skeleton)},
\t\tpreset: ${jsString(config.theme.preset)},
\t\tbackground: ${jsString(config.theme.background)}
\t},
\thomepage: {
\t\ttitle: ${jsString(config.homepage.title)},
\t\tdescription: ${jsString(config.homepage.description)},
\t\tprimaryLabel: ${jsString(config.homepage.primaryLabel)},
\t\tsecondaryLabel: ${jsString(config.homepage.secondaryLabel)}
\t}
};
`;
	await fs.writeFile(path.join(targetDir, 'markstatic.config.js'), contents);
}

async function updatePackageJson(targetDir, packageName) {
	const packageFile = path.join(targetDir, 'package.json');
	const packageJson = JSON.parse(await fs.readFile(packageFile, 'utf8'));

	packageJson.name = packageName;
	packageJson.private = true;
	delete packageJson.bin;
	delete packageJson.scripts?.['create-site'];

	await fs.writeFile(packageFile, `${JSON.stringify(packageJson, null, '\t')}\n`);
}

async function removeScaffoldOnlyFiles(targetDir) {
	await fs.rm(path.join(targetDir, 'scripts/create-site.mjs'), { force: true });
}

async function writeGeneratedReadme(targetDir, { siteName, deployTarget }) {
	const deployNote =
		deployTarget === 'github-pages'
			? 'This site is configured for GitHub Pages. The production base path is set in `markstatic.config.js`.'
			: 'This site is configured for root-hosted static deployment.';

	const contents = `# ${siteName}

Generated with mark-static.

## Start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Add Content

Drop Markdown files into \`static/content\`.

\`\`\`txt
static/content/01.Getting Started.md
static/content/02.Guides/index.md
static/content/02.Guides/01.Installation.md
\`\`\`

## Configure

- Site settings: \`markstatic.config.js\`
- Theme overrides: \`src/custom-theme.css\`
- Generated content data: \`pnpm generate\`

## Build

\`\`\`bash
pnpm build
\`\`\`

${deployNote}
`;

	await fs.writeFile(path.join(targetDir, 'README.md'), contents);
}

async function applyDeployTarget(targetDir, deployTarget) {
	if (deployTarget === 'github-pages') return;

	await fs.rm(path.join(targetDir, '.github/workflows/deploy.yml'), { force: true });
}

async function scaffold() {
	const { flags, positional } = parseArgs(process.argv.slice(2));
	const interactive = process.stdin.isTTY && process.stdout.isTTY && !flags.yes;
	const rl = interactive
		? readline.createInterface({ input: process.stdin, output: process.stdout })
		: null;

	try {
		const targetInput =
			flags.target ||
			positional[0] ||
			(await askText(rl, 'Project directory', 'my-docs', interactive));
		const packageName = normalizePackageName(flags.packageName || path.basename(targetInput));
		const siteName = await askText(
			rl,
			'Site name',
			flags.name || titleFromPackageName(packageName),
			interactive
		);
		const description = await askText(
			rl,
			'Site description',
			flags.description || `${siteName} documentation.`,
			interactive
		);
		const contentPreset = await askChoice(
			rl,
			'Content preset',
			contentPresets,
			flags.preset || 'basic',
			interactive
		);
		const themePreset = await askChoice(
			rl,
			'Theme preset',
			themePresets,
			flags.theme || 'default',
			interactive
		);
		const backgroundPreset = await askChoice(
			rl,
			'Background',
			backgroundPresets,
			flags.background || 'aurora',
			interactive
		);
		const deployTarget = await askChoice(
			rl,
			'Deployment target',
			deployTargets,
			flags.deploy || 'github-pages',
			interactive
		);

		assertChoice(contentPreset, contentPresets, 'content preset');
		assertChoice(themePreset, themePresets, 'theme preset');
		assertChoice(backgroundPreset, backgroundPresets, 'background');
		assertChoice(deployTarget, deployTargets, 'deployment target');

		const targetDir = await ensureEmptyTarget(targetInput);
		const config = createConfig({
			siteName,
			description,
			packageName,
			themePreset,
			backgroundPreset,
			deployTarget
		});

		await copyProjectTemplate(targetDir);
		await copyContentPreset(targetDir, contentPreset);
		await writeSiteConfig(targetDir, config);
		await updatePackageJson(targetDir, packageName);
		await removeScaffoldOnlyFiles(targetDir);
		await writeGeneratedReadme(targetDir, { siteName, deployTarget });
		await applyDeployTarget(targetDir, deployTarget);
		await writeContentManifest({ rootDir: targetDir, contentDir: defaultContentDir });

		console.log(`\nCreated ${siteName} in ${targetDir}`);
		console.log('\nNext steps:');
		console.log(`  cd ${path.relative(process.cwd(), targetDir) || '.'}`);
		console.log('  pnpm install');
		console.log('  pnpm dev');
	} finally {
		rl?.close();
	}
}

scaffold().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
