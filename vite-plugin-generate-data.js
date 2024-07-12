import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.resolve(dirname, 'content');

function runScriptWithNode() {
	const scriptPath = path.resolve(dirname, 'scripts/generate-menu.cjs');
	execSync(`node ${scriptPath}`, { stdio: 'inherit' });
}

function handleChanges(filePath) {
	if (filePath.startsWith(contentPath)) {
		runScriptWithNode();
	}
}

export default function generateDataPlugin() {
	return {
		name: 'vite-plugin-generate-data',
		buildStart() {
			runScriptWithNode();
		},
		configureServer(server) {
			server.watcher.add(contentPath);
			server.watcher.on('add', handleChanges);
			server.watcher.on('unlink', handleChanges);
			server.watcher.on('change', handleChanges);
		}
	};
}