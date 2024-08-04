import chokidar from 'chokidar';
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
			const watcher = chokidar.watch(contentPath, {
				ignoreInitial: true,
				persistent: true,
				awaitWriteFinish: {
					stabilityThreshold: 200,
					pollInterval: 100,
				},
			});

			watcher.on('add', handleChanges);
			watcher.on('unlink', handleChanges);
			watcher.on('change', handleChanges);
			watcher.on('rename', handleChanges);
			watcher.on('ready', () => {
				console.log('Watcher is ready and watching static/content folder for changes!');
			});
			watcher.on('close', () => {
				console.log('Watcher has closed and released all file handles');
			});

			server.watcher.close = () => watcher.close();
		}
	};
}
