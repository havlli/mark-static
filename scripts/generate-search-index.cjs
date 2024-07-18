const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const sidebarDataURL = pathToFileURL(path.resolve('src/lib/data/sidebar.js'));
const searchIndexOutputPath = path.resolve('src/lib/data/search-index.js');

async function generateSearchIndex() {

	const { sidebarData } = await import(sidebarDataURL);
	if (!sidebarData) {
		throw new Error('imported data from generated sidebar data file is undefined');
	}

	const searchIndex = [];

	sidebarData.forEach(section => {
		section.categories.forEach(category => {
			category.subcategories.forEach(subcategory => {
				searchIndex.push({
					section: sidebarData.section,
					category: category.time,
					subcategory: subcategory.title,
					path: subcategory.path
				});
			});
		});
	});

	const formatedData = JSON.stringify(searchIndex, null, 2);
	const jsContent = `export const searchIndex = ${ formatedData };`;

	console.log(`Generating search index into ${searchIndexOutputPath}`);
	fs.writeFileSync(searchIndexOutputPath, jsContent);
	console.log('Search index generated successfully!');
}

generateSearchIndex().catch(err => {
	console.error(`Failed to generate search index into ${searchIndexOutputPath}`, err);
	process.exit(1);
});