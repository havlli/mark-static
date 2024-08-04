const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const sidebarDataURL = pathToFileURL(path.join(process.cwd(), 'src/lib/data/sidebar.js'));
const outputFile = path.join(process.cwd(), 'src/lib/data/search-index.js');

const generateSearchIndex = async () => {
	const { sidebarData } = await import(sidebarDataURL);
	if (!sidebarData) {
		throw new Error('imported data from generated sidebar data file is undefined');
	}

	const searchIndex = [];

	sidebarData.forEach((section) => {
		section.categories.forEach((category) => {
			category.subcategories.forEach((subcategory) => {
				searchIndex.push({
					section: section.section,
					category: category.title,
					subcategory: subcategory.title,
					route: subcategory.route
				});
			});
		});
	});

	const formatedData = JSON.stringify(searchIndex, null, 2);
	const jsContent = `export const searchIndex = ${formatedData};`;

	console.log(`Generating search index into ${outputFile}`);
	fs.writeFileSync(outputFile, jsContent);
	console.log('Search index generated successfully!');
};

generateSearchIndex().catch((err) => {
	console.error(`Failed to generate search index into ${outputFile}`, err);
	process.exit(1);
});
