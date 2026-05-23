#!/usr/bin/env node
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { writeContentManifest, slugify } from './generate-content.mjs';

const execFileAsync = promisify(execFile);
const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const presetsRoot = path.join(projectRoot, 'presets/content');
const defaultContentDir = 'static/content';
const defaultPackageManager = 'pnpm@10.28.0';
const defaultPnpmConfig = {
	overrides: {
		cookie: '0.7.2'
	}
};

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
	'presets',
	'tests'
]);

const knownFlags = new Set([
	'background',
	'deploy',
	'description',
	'git',
	'gitCommit',
	'help',
	'install',
	'listPresets',
	'name',
	'noGit',
	'noGitCommit',
	'noInstall',
	'packageName',
	'preset',
	'target',
	'theme',
	'version',
	'yes'
]);

function colorEnabled() {
	if (process.env.NO_COLOR || process.env.TERM === 'dumb') return false;
	if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
	return Boolean(process.stdout.isTTY);
}

const useColor = colorEnabled();

function ansi(code, text) {
	return useColor ? `\u001b[${code}m${text}\u001b[0m` : text;
}

const ui = {
	bold: (text) => ansi(1, text),
	dim: (text) => ansi(2, text),
	cyan: (text) => ansi(36, text),
	green: (text) => ansi(32, text),
	yellow: (text) => ansi(33, text)
};

function printIntro(version) {
	console.log(`\n${ui.cyan(ui.bold('mark-static'))} ${ui.dim(`v${version}`)}`);
	console.log(ui.dim('Create a static documentation site from your Markdown folders.'));
}

function promptLabel(question) {
	return `${ui.cyan('?')} ${ui.bold(question)}`;
}

function logStep(message) {
	console.log(`${ui.cyan('>')} ${message}`);
}

function logSuccess(message) {
	console.log(`${ui.green('OK')} ${message}`);
}

function formatValue(value) {
	return ui.cyan(String(value));
}

function yesNo(value) {
	return value ? 'yes' : 'no';
}

function printSummary(rows) {
	const labelWidth = Math.max(...rows.map(([label]) => label.length));
	console.log(`\n${ui.bold('Project summary')}`);
	for (const [label, value] of rows) {
		console.log(`  ${ui.dim(label.padEnd(labelWidth))}  ${formatValue(value)}`);
	}
}

function parseArgs(argv) {
	const args = [...argv];
	const command = args[0] === 'init' || args[0] === 'create' ? args.shift() : 'create';

	const flags = {};
	const positional = [];

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (arg === '-h') {
			flags.help = true;
			continue;
		}

		if (arg === '-v') {
			flags.version = true;
			continue;
		}

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

	return { command, flags, positional };
}

function assertKnownFlags(flags) {
	const unknownFlags = Object.keys(flags).filter((flag) => !knownFlags.has(flag));

	if (unknownFlags.length > 0) {
		throw new Error(
			`Unknown option: --${unknownFlags[0].replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
		);
	}
}

function formatChoices(choices) {
	return Object.entries(choices)
		.map(([key, description]) => `  ${ui.cyan(key.padEnd(14))} ${description}`)
		.join('\n');
}

function helpText() {
	return `Usage:
  mark-static <directory> [options]
  mark-static create <directory> [options]
  mark-static init [directory] [options]

Commands:
  create             Scaffold a new site in a target directory.
  init               Scaffold into the current empty directory by default.

Options:
  --name <name>              Site name.
  --description <text>       Site description.
  --package-name <name>      Package name. Defaults to the target directory name.
  --preset <name>            Content preset: ${Object.keys(contentPresets).join(', ')}.
  --theme <name>             Theme preset: ${Object.keys(themePresets).join(', ')}.
  --background <name>        Background preset: ${Object.keys(backgroundPresets).join(', ')}.
  --deploy <target>          Deployment target: ${Object.keys(deployTargets).join(', ')}.
  --install, --no-install    Install dependencies after scaffolding. Defaults to no install.
  --git, --no-git            Initialize a Git repository after scaffolding. Defaults to no Git init.
  --git-commit, --no-git-commit
                              Create an initial commit after Git init. Defaults to no commit.
  --target <directory>       Target directory.
  --yes                      Use defaults for omitted options.
  --list-presets             Print available presets and exit.
  --version, -v              Print the package version and exit.
  --help, -h                 Print this help and exit.

Examples:
  mark-static my-docs
  mark-static init --name "Acme Docs"
  mark-static my-docs --yes --preset api --theme forest --deploy github-pages --install --git --git-commit`;
}

function listPresetsText() {
	return `Content presets:
${formatChoices(contentPresets)}

Theme presets:
${formatChoices(themePresets)}

Background presets:
${formatChoices(backgroundPresets)}

Deployment targets:
${formatChoices(deployTargets)}`;
}

async function packageVersion() {
	const packageJson = JSON.parse(await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8'));
	return packageJson.version;
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

	const answer = await rl.question(`${promptLabel(question)} ${ui.dim(`(${fallback})`)}: `);
	return answer.trim() || fallback;
}

async function askChoice(rl, question, choices, fallback, interactive) {
	if (!interactive) return fallback;

	const entries = Object.entries(choices);
	console.log(`\n${ui.bold(question)}`);
	entries.forEach(([key, description], index) => {
		const marker = key === fallback ? ui.green('*') : ' ';
		console.log(
			` ${marker} ${ui.cyan(String(index + 1).padStart(2))}. ${key} ${ui.dim(description)}`
		);
	});

	const answer = await rl.question(`${promptLabel('Choose')} ${ui.dim(`(${fallback})`)}: `);
	const trimmed = answer.trim();
	if (!trimmed) return fallback;

	const index = Number(trimmed);
	if (Number.isInteger(index) && index >= 1 && index <= entries.length) {
		return entries[index - 1][0];
	}

	assertChoice(trimmed, choices, question.toLowerCase());
	return trimmed;
}

async function askBoolean(rl, question, fallback, interactive) {
	if (!interactive) return fallback;

	const suffix = fallback ? 'Y/n' : 'y/N';
	const answer = await rl.question(`${promptLabel(question)} ${ui.dim(`(${suffix})`)}: `);
	const trimmed = answer.trim().toLowerCase();
	if (!trimmed) return fallback;

	if (trimmed === 'y' || trimmed === 'yes') return true;
	if (trimmed === 'n' || trimmed === 'no') return false;

	throw new Error(`Expected yes or no for "${question}".`);
}

function readBooleanFlag(value, flagName) {
	if (value === true) return true;
	if (value === false) return false;
	if (value === 'true') return true;
	if (value === 'false') return false;
	throw new Error(`Invalid value for ${formatFlagName(flagName)}: ${value}`);
}

function formatFlagName(flagName) {
	return `--${flagName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

function booleanFlagPair(flags, positiveFlag, negativeFlag) {
	const positive = flags[positiveFlag];
	const negative = flags[negativeFlag];

	if (positive !== undefined && negative !== undefined) {
		throw new Error(
			`Cannot use ${formatFlagName(positiveFlag)} and ${formatFlagName(negativeFlag)} together.`
		);
	}

	if (positive !== undefined) return readBooleanFlag(positive, positiveFlag);
	if (negative !== undefined) return !readBooleanFlag(negative, negativeFlag);
	return undefined;
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

async function updatePackageJson(targetDir, { packageName, description }) {
	const packageFile = path.join(targetDir, 'package.json');
	const packageJson = JSON.parse(await fs.readFile(packageFile, 'utf8'));

	packageJson.name = packageName;
	packageJson.description = description;
	packageJson.private = true;
	packageJson.packageManager ||= defaultPackageManager;
	packageJson.pnpm ||= defaultPnpmConfig;
	delete packageJson.license;
	delete packageJson.homepage;
	delete packageJson.repository;
	delete packageJson.bugs;
	delete packageJson.keywords;
	delete packageJson.files;
	delete packageJson.bin;
	delete packageJson.publishConfig;
	delete packageJson.scripts?.['create-site'];
	delete packageJson.scripts?.['package:check'];
	delete packageJson.scripts?.['pack:check'];
	delete packageJson.scripts?.['release:check'];
	delete packageJson.scripts?.['release:dry-run'];
	delete packageJson.scripts?.prepack;
	delete packageJson.scripts?.prepublishOnly;
	delete packageJson.scripts?.test;
	delete packageJson.scripts?.['test:smoke'];

	await fs.writeFile(packageFile, `${JSON.stringify(packageJson, null, '\t')}\n`);
}

async function removeScaffoldOnlyFiles(targetDir) {
	await fs.rm(path.join(targetDir, 'scripts/create-site.mjs'), { force: true });
	await fs.rm(path.join(targetDir, 'scripts/check-package.mjs'), { force: true });
	await fs.rm(path.join(targetDir, 'tests'), { recursive: true, force: true });
}

async function writeProjectDotfiles(targetDir) {
	await fs.writeFile(
		path.join(targetDir, '.gitignore'),
		`.DS_Store
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

/.idea
/.vscode
`
	);

	await fs.writeFile(path.join(targetDir, '.npmrc'), 'engine-strict=true\n');
}

async function writeGeneratedReadme(targetDir, { siteName, deployTarget }) {
	const deployNotes = {
		'github-pages':
			'This site is configured for GitHub Pages. The production base path is set in `markstatic.config.js`, and `.github/workflows/deploy.yml` publishes the `build` directory.',
		netlify:
			'This site includes `netlify.toml` with `pnpm build` and `build` as the publish directory.',
		vercel:
			'This site includes `vercel.json` with `pnpm build` and `build` as the output directory.',
		static:
			'This site builds plain static files into `build`. Upload that directory to any static host.'
	};

	const contents = `# ${siteName}

## Start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Add Content

Drop Markdown files into \`static/content\`.

\`\`\`txt
static/content/
  01.Getting Started.md
  02.Guides/
    index.md
    01.Installation.md
\`\`\`

Use numeric prefixes for ordering. They are removed from URLs.

Use frontmatter when a page needs custom metadata:

\`\`\`md
---
title: Installation
description: Install and configure the project.
slug: install
---

# Installation
\`\`\`

## Configure

- Site settings: \`markstatic.config.js\`
- Theme overrides: \`src/custom-theme.css\`
- Regenerate content data: \`pnpm generate\`
- Check docs before publishing: \`pnpm docs:check\`

## Commands

\`\`\`bash
pnpm dev
pnpm docs:check
pnpm build
pnpm preview
\`\`\`

## Deployment

${deployNotes[deployTarget]}
`;

	await fs.writeFile(path.join(targetDir, 'README.md'), contents);
}

async function applyDeployTarget(targetDir, deployTarget) {
	if (deployTarget === 'github-pages') return;

	await fs.rm(path.join(targetDir, '.github'), { recursive: true, force: true });

	if (deployTarget === 'netlify') {
		await fs.writeFile(
			path.join(targetDir, 'netlify.toml'),
			`[build]
command = "pnpm build"
publish = "build"
`
		);
	}

	if (deployTarget === 'vercel') {
		await fs.writeFile(
			path.join(targetDir, 'vercel.json'),
			`${JSON.stringify(
				{
					buildCommand: 'pnpm build',
					outputDirectory: 'build',
					framework: null
				},
				null,
				'\t'
			)}\n`
		);
	}
}

async function runProjectCommand(command, args, targetDir, label) {
	try {
		await execFileAsync(command, args, {
			cwd: targetDir,
			env: process.env,
			maxBuffer: 1024 * 1024 * 8
		});
	} catch (error) {
		if (error.code === 'ENOENT') {
			throw new Error(`Could not run ${label}. Is "${command}" installed and on PATH?`, {
				cause: error
			});
		}

		const detail = [error.stderr, error.stdout].filter(Boolean).join('\n').trim();
		throw new Error(`Failed to run ${label}.${detail ? `\n${detail}` : ''}`, { cause: error });
	}
}

async function initializeGitRepository(targetDir) {
	await runProjectCommand('git', ['init'], targetDir, 'git init');
}

async function createInitialCommit(targetDir) {
	await runProjectCommand('git', ['add', '.'], targetDir, 'git add .');
	await runProjectCommand(
		'git',
		['commit', '-m', 'Initial documentation site'],
		targetDir,
		'git commit'
	);
}

async function installDependencies(targetDir) {
	await runProjectCommand('pnpm', ['install'], targetDir, 'pnpm install');
}

export async function scaffold(argv = process.argv.slice(2)) {
	const { command, flags, positional } = parseArgs(argv);
	assertKnownFlags(flags);

	if (flags.help) {
		console.log(helpText());
		return;
	}

	if (flags.version) {
		console.log(await packageVersion());
		return;
	}

	if (flags.listPresets) {
		console.log(listPresetsText());
		return;
	}

	printIntro(await packageVersion());

	const interactive = process.stdin.isTTY && process.stdout.isTTY && !flags.yes;
	const rl = interactive
		? readline.createInterface({ input: process.stdin, output: process.stdout })
		: null;
	const defaultTarget = command === 'init' ? '.' : 'my-docs';

	try {
		const targetInput =
			flags.target ||
			positional[0] ||
			(await askText(rl, 'Project directory', defaultTarget, interactive));
		const packageName = normalizePackageName(
			flags.packageName || path.basename(path.resolve(targetInput))
		);
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
		const installChoice = booleanFlagPair(flags, 'install', 'noInstall');
		const gitChoice = booleanFlagPair(flags, 'git', 'noGit');
		const gitCommitChoice = booleanFlagPair(flags, 'gitCommit', 'noGitCommit');
		if (gitChoice === false && gitCommitChoice === true) {
			throw new Error('Cannot use --no-git and --git-commit together.');
		}
		const shouldInstall = await askBoolean(
			rl,
			'Install dependencies after scaffolding',
			installChoice ?? false,
			interactive && installChoice === undefined
		);
		const shouldInitializeGit = await askBoolean(
			rl,
			'Initialize a Git repository',
			gitChoice ?? gitCommitChoice === true,
			interactive && gitChoice === undefined && gitCommitChoice !== true
		);
		const shouldCreateInitialCommit = shouldInitializeGit
			? await askBoolean(
					rl,
					'Create an initial commit',
					gitCommitChoice ?? false,
					interactive && gitCommitChoice === undefined
				)
			: false;
		if (!shouldInitializeGit && gitCommitChoice === true) {
			throw new Error('Cannot create an initial commit without initializing Git.');
		}

		assertChoice(contentPreset, contentPresets, 'content preset');
		assertChoice(themePreset, themePresets, 'theme preset');
		assertChoice(backgroundPreset, backgroundPresets, 'background');
		assertChoice(deployTarget, deployTargets, 'deployment target');

		printSummary([
			['Site', siteName],
			['Preset', contentPreset],
			['Theme', themePreset],
			['Background', backgroundPreset],
			['Deploy', deployTarget],
			['Install', yesNo(shouldInstall)],
			['Git', yesNo(shouldInitializeGit)],
			['Commit', yesNo(shouldCreateInitialCommit)]
		]);

		const targetDir = await ensureEmptyTarget(targetInput);

		logStep('Writing project files');
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
		await updatePackageJson(targetDir, { packageName, description });
		await removeScaffoldOnlyFiles(targetDir);
		await writeProjectDotfiles(targetDir);
		await writeGeneratedReadme(targetDir, { siteName, deployTarget });
		await applyDeployTarget(targetDir, deployTarget);
		await writeContentManifest({ rootDir: targetDir, contentDir: defaultContentDir });
		logSuccess('Project files written.');

		if (shouldInitializeGit) {
			logStep('Initializing Git repository');
			await initializeGitRepository(targetDir);
			logSuccess('Git repository initialized.');
		}
		if (shouldInstall) {
			logStep('Installing dependencies');
			await installDependencies(targetDir);
			logSuccess('Dependencies installed.');
		}
		if (shouldCreateInitialCommit) {
			logStep('Creating initial commit');
			await createInitialCommit(targetDir);
			logSuccess('Initial commit created.');
		}

		console.log(`\nCreated ${ui.bold(siteName)} in ${formatValue(targetDir)}`);
		console.log(`\n${ui.bold('Next steps')}`);
		console.log(`  cd ${path.relative(process.cwd(), targetDir) || '.'}`);
		if (!shouldInstall) console.log('  pnpm install');
		console.log('  pnpm dev');
		if (shouldInitializeGit && !shouldCreateInitialCommit) {
			console.log(
				`\n${ui.yellow('Tip')} Run git add . && git commit -m "Initial documentation site" when ready.`
			);
		}
	} finally {
		rl?.close();
	}
}

const entryUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';

if (import.meta.url === entryUrl) {
	scaffold().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
