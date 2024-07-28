import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = 'static/content';
const contentPath = path.resolve(dirname, contentDir);

function runScriptsWithNode() {
	const generateMenuPath = path.resolve(dirname, 'scripts/generate-menu.cjs');
	const generateSearchIndexPath = path.resolve(dirname, 'scripts/generate-search-index.cjs');
	execSync(`node ${generateMenuPath}`, { stdio: 'inherit' });
	execSync(`node ${generateSearchIndexPath}`, { stdio: 'inherit' });
}

function handleChanges(filePath) {
	if (filePath.startsWith(contentPath)) {
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
