import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const createSiteScript = path.join(projectRoot, 'scripts/create-site.mjs');

async function createFixture() {
	return fs.mkdtemp(path.join(os.tmpdir(), 'mark-static-cli-'));
}

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function runCli(args, options = {}) {
	return execFileAsync(process.execPath, [createSiteScript, ...args], {
		cwd: options.cwd || projectRoot,
		env: {
			...process.env,
			NO_COLOR: '1',
			...options.env
		},
		maxBuffer: 1024 * 1024
	});
}

async function runPnpm(args, options = {}) {
	const pnpm = resolvePnpm();

	return execFileAsync(pnpm.command, [...pnpm.args, ...args], {
		cwd: options.cwd || projectRoot,
		env: {
			...process.env,
			CI: '1',
			NO_COLOR: '1',
			PATH: [
				process.env.PNPM_HOME,
				process.env.npm_execpath ? path.dirname(process.env.npm_execpath) : '',
				path.join(os.homedir(), 'Library/pnpm'),
				path.join(os.homedir(), '.local/share/pnpm'),
				process.env.PATH
			]
				.filter(Boolean)
				.join(path.delimiter)
		},
		maxBuffer: 1024 * 1024 * 4
	});
}

function resolvePnpm() {
	const pnpmHome = process.env.PNPM_HOME;
	if (!pnpmHome) return { command: 'pnpm', args: [] };

	const shim = path.join(pnpmHome, process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm');
	if (process.platform === 'win32' || !fsSync.existsSync(shim)) {
		return { command: shim, args: [] };
	}

	const source = fsSync.readFileSync(shim, 'utf8');
	const match = source.match(/\$basedir\/([^"]+pnpm\.cjs)/);
	if (!match) return { command: shim, args: [] };

	return { command: 'node', args: [path.join(pnpmHome, match[1])] };
}

function parsePackJson(stdout) {
	const marker = '{\n  "name":';
	const start = stdout.lastIndexOf(marker);
	assert.notEqual(start, -1, `Could not find pack JSON in output:\n${stdout}`);
	return JSON.parse(stdout.slice(start));
}

test('prints help without scaffolding a project', async () => {
	const { stdout } = await runCli(['--help']);

	assert.match(stdout, /Usage:/);
	assert.match(stdout, /mark-static init/);
	assert.match(stdout, /--install, --no-install/);
	assert.match(stdout, /--git, --no-git/);
	assert.match(stdout, /--git-commit, --no-git-commit/);
	assert.match(stdout, /--list-presets/);
});

test('prints available scaffold presets', async () => {
	const { stdout } = await runCli(['--list-presets']);

	assert.match(stdout, /Content presets:/);
	assert.match(stdout, /minimal/);
	assert.match(stdout, /Theme presets:/);
	assert.match(stdout, /Deployment targets:/);
});

test('published package contains the scaffold CLI template payload', async () => {
	const { stdout } = await runPnpm(['pack', '--dry-run', '--json']);
	const pack = parsePackJson(stdout);
	const files = new Set(pack.files.map((file) => file.path));

	assert.equal(files.has('.github/workflows/deploy.yml'), true);
	assert.equal(files.has('.github/workflows/ci.yml'), false);
	assert.equal(files.has('scripts/create-site.mjs'), true);
	assert.equal(files.has('scripts/check-generated.mjs'), true);
	assert.equal(files.has('scripts/generate-content.mjs'), true);
	assert.equal(files.has('scripts/check-package.mjs'), true);
	assert.equal(files.has('CHANGELOG.md'), true);
	assert.equal(files.has('LICENSE'), true);
	assert.equal(files.has('README.md'), true);
	assert.equal(files.has('presets/content/minimal/01.Getting Started.md'), true);
	assert.equal(files.has('pnpm-lock.yaml'), true);
	assert.equal(files.has('static/css/github.min.css'), true);
	assert.equal(
		[...files].some((file) => file.startsWith('tests/')),
		false
	);
	assert.equal(
		[...files].some((file) => file.startsWith('static/content/')),
		false
	);
});

test('scaffolds a clean generated site with provider config', async () => {
	const fixture = await createFixture();
	const targetDir = path.join(fixture, 'acme-docs');

	const { stdout } = await runCli([
		targetDir,
		'--yes',
		'--name',
		'Acme Docs',
		'--description',
		'Acme documentation.',
		'--preset',
		'minimal',
		'--theme',
		'mono',
		'--background',
		'none',
		'--deploy',
		'netlify'
	]);

	const packageJson = JSON.parse(await fs.readFile(path.join(targetDir, 'package.json'), 'utf8'));
	const config = await fs.readFile(path.join(targetDir, 'markstatic.config.js'), 'utf8');
	const readme = await fs.readFile(path.join(targetDir, 'README.md'), 'utf8');
	const generatedContent = await fs.readFile(
		path.join(targetDir, 'src/lib/generated/content.js'),
		'utf8'
	);

	assert.match(stdout, /Created Acme Docs/);
	assert.match(stdout, /Project summary/);
	assert.match(stdout, /OK Project files written/);
	assert.equal(packageJson.name, 'acme-docs');
	assert.equal(packageJson.description, 'Acme documentation.');
	assert.equal(packageJson.private, true);
	assert.equal(packageJson.packageManager, 'pnpm@10.28.0');
	assert.deepEqual(packageJson.pnpm, { overrides: { cookie: '0.7.2' } });
	assert.equal(packageJson.license, undefined);
	assert.equal(packageJson.homepage, undefined);
	assert.equal(packageJson.repository, undefined);
	assert.equal(packageJson.bugs, undefined);
	assert.equal(packageJson.keywords, undefined);
	assert.equal(packageJson.files, undefined);
	assert.equal(packageJson.bin, undefined);
	assert.equal(packageJson.publishConfig, undefined);
	assert.equal(packageJson.scripts['create-site'], undefined);
	assert.equal(packageJson.scripts['package:check'], undefined);
	assert.equal(packageJson.scripts['pack:check'], undefined);
	assert.equal(packageJson.scripts['release:check'], undefined);
	assert.equal(packageJson.scripts['release:dry-run'], undefined);
	assert.equal(packageJson.scripts.prepack, undefined);
	assert.equal(packageJson.scripts.prepublishOnly, undefined);
	assert.equal(packageJson.scripts.test, undefined);
	assert.equal(packageJson.scripts['test:smoke'], undefined);
	assert.match(config, /name: 'Acme Docs'/);
	assert.match(config, /preset: 'mono'/);
	assert.match(readme, /pnpm docs:check/);
	assert.match(generatedContent, /Getting Started/);
	assert.equal(await exists(path.join(targetDir, 'scripts/create-site.mjs')), false);
	assert.equal(await exists(path.join(targetDir, 'scripts/check-package.mjs')), false);
	assert.equal(await exists(path.join(targetDir, 'scripts/check-generated.mjs')), true);
	assert.equal(await exists(path.join(targetDir, 'tests')), false);
	assert.equal(await exists(path.join(targetDir, '.gitignore')), true);
	assert.equal(await exists(path.join(targetDir, '.npmrc')), true);
	assert.equal(await exists(path.join(targetDir, 'netlify.toml')), true);
	assert.equal(await exists(path.join(targetDir, '.github')), false);
});

test('init scaffolds into the current empty directory by default', async () => {
	const targetDir = await createFixture();

	await runCli(['init', '--yes', '--name', 'Local Docs', '--deploy', 'static'], { cwd: targetDir });

	const packageJson = JSON.parse(await fs.readFile(path.join(targetDir, 'package.json'), 'utf8'));
	const config = await fs.readFile(path.join(targetDir, 'markstatic.config.js'), 'utf8');

	assert.equal(packageJson.name, path.basename(targetDir).toLowerCase());
	assert.match(config, /name: 'Local Docs'/);
	assert.equal(await exists(path.join(targetDir, '.github')), false);
	assert.equal(await exists(path.join(targetDir, 'netlify.toml')), false);
	assert.equal(await exists(path.join(targetDir, 'vercel.json')), false);
});

test('github pages scaffold uses first-party pages deployment', async () => {
	const fixture = await createFixture();
	const targetDir = path.join(fixture, 'pages-docs');

	await runCli([
		targetDir,
		'--yes',
		'--name',
		'Pages Docs',
		'--preset',
		'minimal',
		'--deploy',
		'github-pages'
	]);

	const workflow = await fs.readFile(path.join(targetDir, '.github/workflows/deploy.yml'), 'utf8');

	assert.match(workflow, /actions\/upload-pages-artifact@v5/);
	assert.match(workflow, /actions\/deploy-pages@v5/);
	assert.doesNotMatch(workflow, /peaceiris/);
	assert.doesNotMatch(workflow, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24/);
});

test('can initialize git, install dependencies, and create an initial commit when requested', async () => {
	const fixture = await createFixture();
	const targetDir = path.join(fixture, 'ready-docs');
	const binDir = path.join(fixture, 'bin');
	const installLog = path.join(fixture, 'install.log');
	await fs.mkdir(binDir);
	const fakePnpm = path.join(binDir, 'pnpm');
	const fakePnpmSource = [
		'#!/usr/bin/env node',
		"const fs = require('node:fs');",
		`fs.writeFileSync(${JSON.stringify(installLog)}, process.cwd() + '\\n' + process.argv.slice(2).join(' '));`,
		''
	].join('\n');
	await fs.writeFile(fakePnpm, fakePnpmSource);
	await fs.chmod(fakePnpm, 0o755);

	const { stdout } = await runCli(
		[
			targetDir,
			'--yes',
			'--name',
			'Ready Docs',
			'--deploy',
			'static',
			'--install',
			'--git',
			'--git-commit'
		],
		{
			env: {
				PATH: `${binDir}${path.delimiter}${process.env.PATH}`,
				GIT_AUTHOR_NAME: 'Mark Static Test',
				GIT_AUTHOR_EMAIL: 'mark-static@example.invalid',
				GIT_COMMITTER_NAME: 'Mark Static Test',
				GIT_COMMITTER_EMAIL: 'mark-static@example.invalid'
			}
		}
	);
	const installLogContents = await fs.readFile(installLog, 'utf8');
	const realTargetDir = await fs.realpath(targetDir);
	const { stdout: commitSubject } = await execFileAsync('git', ['log', '--format=%s', '-1'], {
		cwd: targetDir
	});
	const { stdout: gitStatus } = await execFileAsync('git', ['status', '--short'], {
		cwd: targetDir
	});

	assert.match(stdout, /Git repository initialized/);
	assert.match(stdout, /Dependencies installed/);
	assert.match(stdout, /Initial commit created/);
	assert.doesNotMatch(stdout, /\n {2}pnpm install/);
	assert.equal(await exists(path.join(targetDir, '.git')), true);
	assert.equal(installLogContents, `${realTargetDir}\ninstall`);
	assert.equal(commitSubject.trim(), 'Initial documentation site');
	assert.equal(gitStatus, '');
});

test('rejects conflicting post-scaffold flags', async () => {
	const fixture = await createFixture();

	await assert.rejects(
		runCli([path.join(fixture, 'install-conflict'), '--yes', '--install', '--no-install']),
		/Cannot use --install and --no-install together/
	);
	await assert.rejects(
		runCli([path.join(fixture, 'git-conflict'), '--yes', '--git', '--no-git']),
		/Cannot use --git and --no-git together/
	);
	await assert.rejects(
		runCli([path.join(fixture, 'commit-conflict'), '--yes', '--git-commit', '--no-git-commit']),
		/Cannot use --git-commit and --no-git-commit together/
	);
	await assert.rejects(
		runCli([path.join(fixture, 'no-git-commit'), '--yes', '--no-git', '--git-commit']),
		/Cannot use --no-git and --git-commit together/
	);
});
