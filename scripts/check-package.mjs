import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageFile = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(await fs.readFile(packageFile, 'utf8'));
const errors = [];

function addError(message) {
	errors.push(message);
}

function assert(condition, message) {
	if (!condition) addError(message);
}

function hasKeyword(keyword) {
	return packageJson.keywords?.includes(keyword);
}

async function assertFile(relativePath) {
	try {
		await fs.access(path.join(projectRoot, relativePath));
	} catch {
		addError(`Missing package file: ${relativePath}`);
	}
}

async function assertExecutableBin(relativePath) {
	const binPath = path.join(projectRoot, relativePath);

	try {
		const [source, stat] = await Promise.all([fs.readFile(binPath, 'utf8'), fs.stat(binPath)]);
		assert(
			source.startsWith('#!/usr/bin/env node'),
			`${relativePath} must start with a Node shebang.`
		);
		if (process.platform !== 'win32') {
			assert((stat.mode & 0o111) !== 0, `${relativePath} must be executable.`);
		}
	} catch (error) {
		if (error.code === 'ENOENT') addError(`Missing CLI bin: ${relativePath}`);
		else throw error;
	}
}

const requiredPackageFiles = [
	'.github/workflows/deploy.yml',
	'CHANGELOG.md',
	'LICENSE',
	'README.md',
	'markstatic.config.js',
	'pnpm-lock.yaml',
	'presets/content',
	'scripts/check-docs.mjs',
	'scripts/check-generated.mjs',
	'scripts/check-package.mjs',
	'scripts/create-site.mjs',
	'scripts/generate-content.mjs',
	'src',
	'static/.nojekyll',
	'static/css',
	'static/favicon.png',
	'svelte.config.js',
	'vite-plugin-generate-data.js',
	'vite.config.js'
];

const forbiddenPackageFiles = ['build', 'node_modules', 'package', 'static/content', 'tests'];

assert(packageJson.name === 'mark-static', 'Package name must stay mark-static.');
assert(packageJson.private === false, 'Package must be public, not private.');
assert(Boolean(packageJson.description), 'Package description is required.');
assert(packageJson.license === 'MIT', 'Package license must be MIT.');
assert(packageJson.publishConfig?.access === 'public', 'publishConfig.access must be public.');
assert(
	/^pnpm@\d+\.\d+\.\d+/.test(packageJson.packageManager || ''),
	'packageManager must pin pnpm.'
);
assert(packageJson.engines?.node, 'Node engine requirement is required.');
assert(
	packageJson.repository?.url?.includes('github.com/havlli/mark-static'),
	'Repository URL is required.'
);
assert(packageJson.bugs?.url?.endsWith('/issues'), 'Bug tracker URL is required.');
assert(
	packageJson.homepage === 'https://havlli.github.io/mark-static/',
	'Homepage must point to the demo site.'
);
assert(
	packageJson.bin?.['mark-static'] === 'scripts/create-site.mjs',
	'mark-static bin must point to the scaffold CLI.'
);
assert(hasKeyword('documentation'), 'Missing documentation keyword.');
assert(hasKeyword('markdown'), 'Missing markdown keyword.');
assert(hasKeyword('sveltekit'), 'Missing sveltekit keyword.');
assert(hasKeyword('static-site-generator'), 'Missing static-site-generator keyword.');
assert(Array.isArray(packageJson.files), 'Package files allowlist is required.');

for (const filePath of requiredPackageFiles) {
	assert(packageJson.files?.includes(filePath), `Package files must include ${filePath}.`);
	await assertFile(filePath);
}

for (const filePath of forbiddenPackageFiles) {
	assert(!packageJson.files?.includes(filePath), `Package files must not include ${filePath}.`);
}

assert(
	packageJson.scripts?.['package:check'] === 'node scripts/check-package.mjs',
	'package:check script is required.'
);
assert(Boolean(packageJson.scripts?.['pack:check']), 'pack:check script is required.');
assert(Boolean(packageJson.scripts?.['release:check']), 'release:check script is required.');
assert(Boolean(packageJson.scripts?.['release:dry-run']), 'release:dry-run script is required.');
assert(Boolean(packageJson.scripts?.prepack), 'prepack script is required.');
assert(
	packageJson.scripts?.prepublishOnly === 'pnpm release:check',
	'prepublishOnly must run release:check.'
);
await assertExecutableBin(packageJson.bin?.['mark-static'] || '');

if (errors.length > 0) {
	console.error(
		`Package metadata check failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`
	);
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exitCode = 1;
} else {
	console.log('Package metadata OK.');
}
