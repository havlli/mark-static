import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import siteConfig from './markstatic.config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = siteConfig.content?.dir ?? 'static/content';
const contentPath = path.resolve(dirname, contentDir);

function runScriptsWithNode() {
	const generateContentPath = path.resolve(dirname, 'scripts/generate-content.mjs');
	const result = spawnSync(process.execPath, [generateContentPath], {
		cwd: dirname,
		stdio: 'inherit'
	});

	if (result.status !== 0) {
		throw new Error(`Content generation failed with exit code ${result.status}`);
	}
}

function handleChanges(filePath) {
	const relativePath = path.relative(contentPath, filePath);
	if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
		runScriptsWithNode();
	}
}

export default function generateDataPlugin() {
	return {
		name: 'vite-plugin-generate-data',
		buildStart() {
			runScriptsWithNode();
		},
		configureServer(server) {
			server.watcher.add(contentPath);
			server.watcher.on('add', handleChanges);
			server.watcher.on('unlink', handleChanges);
			server.watcher.on('change', handleChanges);
		}
	};
}
