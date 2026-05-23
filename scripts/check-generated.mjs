import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeContentManifest } from './generate-content.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedFile = path.join(projectRoot, 'src/lib/generated/content.js');

let before = '';

try {
	before = await fs.readFile(generatedFile, 'utf8');
} catch (error) {
	if (error.code !== 'ENOENT') throw error;
}

await writeContentManifest({ rootDir: projectRoot, contentDir: 'static/content' });

const after = await fs.readFile(generatedFile, 'utf8');

if (before !== after) {
	console.error(
		'Generated content manifest is stale. Run pnpm generate and commit the updated file.'
	);
	process.exitCode = 1;
} else {
	console.log('Generated content manifest OK.');
}
