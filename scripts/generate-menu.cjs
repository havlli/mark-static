const fs = require('fs');
const path = require('path');

const routePrefix = '/content';
const contentDir = path.join(process.cwd(), 'static/content');
const outputFile = path.join(process.cwd(), 'src/lib/data/sidebar.js');

const removeOrdering = (value) => {
	const parts = value.split('.');
	return parts.length > 1 ? parts.slice(1).join('.').trim() : value;
};

const getDirectories = (srcPath) => {
	return fs.readdirSync(srcPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
};

const generateRoute = (section, category, subcategory) => {
	const parts = [section, category, subcategory].filter(Boolean).map(removeOrdering);
	return `${routePrefix}/${parts.join('/')}`.toLowerCase();
};

const generateDataFromFolderStructure = (dirPath) => {
	return getDirectories(dirPath).map((section) => {
		const sectionPath = path.join(dirPath, section);
		const categories = getDirectories(sectionPath).map((category) => {
			const categoryPath = path.join(sectionPath, category);
			const subcategories = getDirectories(categoryPath).map((subcategory) => ({
				title: removeOrdering(subcategory),
				route: generateRoute(section, category, subcategory),
				contentPath: `${routePrefix}/${section}/${category}/${subcategory}`
			}));
			return { title: removeOrdering(category), subcategories };
		});
		return { section: removeOrdering(section), categories }
	});
};

const generateDataToJsFile = async (contentDir, outputFile) => {
	const generatedData = generateDataFromFolderStructure(contentDir);
	const formatedData = JSON.stringify(generatedData, null, 2);
	const jsContent = `export const sidebarData = ${formatedData};`;

	fs.writeFileSync(outputFile, jsContent);
};

console.log(`Generating sidebar data from ${contentDir}\n\tinto ${outputFile}`);
generateDataToJsFile(contentDir, outputFile).catch(() => {
	console.error(`Failed to generate menu data into ${outputFile}`, err);
	process.exit(1);
})
console.log('Sidebar data file generated successfully!\n');
