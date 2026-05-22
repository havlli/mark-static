import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
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
		maxBuffer: 1024 * 1024
	});
}

test('prints help without scaffolding a project', async () => {
	const { stdout } = await runCli(['--help']);

	assert.match(stdout, /Usage:/);
	assert.match(stdout, /mark-static init/);
	assert.match(stdout, /--list-presets/);
});

test('prints available scaffold presets', async () => {
	const { stdout } = await runCli(['--list-presets']);

	assert.match(stdout, /Content presets:/);
	assert.match(stdout, /minimal/);
	assert.match(stdout, /Theme presets:/);
	assert.match(stdout, /Deployment targets:/);
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
	assert.equal(packageJson.name, 'acme-docs');
	assert.equal(packageJson.private, true);
	assert.equal(packageJson.bin, undefined);
	assert.equal(packageJson.scripts['create-site'], undefined);
	assert.equal(packageJson.scripts.test, undefined);
	assert.match(config, /name: 'Acme Docs'/);
	assert.match(config, /preset: 'mono'/);
	assert.match(readme, /pnpm docs:check/);
	assert.match(generatedContent, /Getting Started/);
	assert.equal(await exists(path.join(targetDir, 'scripts/create-site.mjs')), false);
	assert.equal(await exists(path.join(targetDir, 'tests')), false);
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
