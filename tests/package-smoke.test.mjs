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
const projectPackage = JSON.parse(
	await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8')
);

async function createFixture() {
	const tmpRoot = process.platform === 'darwin' ? '/private/tmp' : os.tmpdir();
	return fs.mkdtemp(path.join(tmpRoot, 'mark-static-package-smoke-'));
}

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function runPnpm(args, options = {}) {
	const pnpm = resolvePnpm();
	const commandArgs = [...pnpm.args, ...args];

	try {
		return await execFileAsync(pnpm.command, commandArgs, {
			cwd: options.cwd || projectRoot,
			env: {
				...process.env,
				CI: '1',
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
			maxBuffer: 1024 * 1024 * 8
		});
	} catch (error) {
		error.message = `${pnpm.command} ${commandArgs.join(' ')}\n${error.message}`;
		throw error;
	}
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

async function runNode(args, options = {}) {
	try {
		return await execFileAsync('node', args, {
			cwd: options.cwd || projectRoot,
			env: {
				...process.env,
				CI: '1'
			},
			maxBuffer: 1024 * 1024 * 8
		});
	} catch (error) {
		error.message = `node ${args.join(' ')}\n${error.message}`;
		throw error;
	}
}

test('packed package scaffolds a lockfile-valid buildable site', async () => {
	const fixture = await createFixture();
	const packDir = path.join(fixture, 'package');
	const unpackDir = path.join(fixture, 'unpacked');
	const targetDir = path.join(fixture, 'smoke-docs');
	const nodeModulesLinkType = process.platform === 'win32' ? 'junction' : 'dir';
	await fs.mkdir(packDir);
	await fs.mkdir(unpackDir);

	await runPnpm(['pack', '--pack-destination', packDir, '--json']);
	const tarballs = (await fs.readdir(packDir)).filter((file) => file.endsWith('.tgz'));
	assert.deepEqual(tarballs, [`${projectPackage.name}-${projectPackage.version}.tgz`]);
	const tarballPath = path.join(packDir, tarballs[0]);

	await execFileAsync('tar', ['-xzf', tarballPath, '-C', unpackDir], {
		maxBuffer: 1024 * 1024
	});
	const packageDir = path.join(unpackDir, 'package');
	await fs.symlink(
		path.join(projectRoot, 'node_modules'),
		path.join(packageDir, 'node_modules'),
		nodeModulesLinkType
	);
	await runNode([
		path.join(packageDir, 'scripts/create-site.mjs'),
		targetDir,
		'--yes',
		'--name',
		'Smoke Docs',
		'--preset',
		'minimal',
		'--theme',
		'mono',
		'--background',
		'none',
		'--deploy',
		'static',
		'--no-install',
		'--no-git'
	]);

	await runPnpm(['install', '--frozen-lockfile', '--lockfile-only'], { cwd: targetDir });
	await fs.symlink(
		path.join(projectRoot, 'node_modules'),
		path.join(targetDir, 'node_modules'),
		nodeModulesLinkType
	);
	await runPnpm(['build'], { cwd: targetDir });

	const generatedPackage = JSON.parse(
		await fs.readFile(path.join(targetDir, 'package.json'), 'utf8')
	);

	assert.equal(generatedPackage.name, 'smoke-docs');
	assert.equal(generatedPackage.private, true);
	assert.equal(generatedPackage.packageManager, projectPackage.packageManager);
	assert.deepEqual(generatedPackage.pnpm, projectPackage.pnpm);
	assert.equal(generatedPackage.publishConfig, undefined);
	assert.equal(generatedPackage.scripts['package:check'], undefined);
	assert.equal(generatedPackage.scripts['pack:check'], undefined);
	assert.equal(generatedPackage.scripts['release:dry-run'], undefined);
	assert.equal(generatedPackage.scripts.prepack, undefined);
	assert.equal(generatedPackage.scripts['test:smoke'], undefined);
	assert.equal(await exists(path.join(targetDir, 'scripts/check-package.mjs')), false);
	assert.equal(await exists(path.join(targetDir, 'scripts/check-generated.mjs')), true);
	assert.equal(await exists(path.join(targetDir, 'build/index.html')), true);
});
