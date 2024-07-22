const fs = require('fs');
const path = require('path');

const getDirectories = (srcPath) => {
	return fs.readdirSync(srcPath, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
};

const getSubcategories = (section, category, categoryPath) => {
	return getDirectories(categoryPath).map(subcategory => ({
		title: subcategory,
		path: `/content/${section}/${category}/${subcategory}`
	}));
};

const getCategories = (section, sectionPath) => {
	return getDirectories(sectionPath).map(category => {
		const categoryPath = path.join(sectionPath, category);
		const subcategories = getSubcategories(section, category, categoryPath);
		return { title: category, subcategories };
	});
};

const buildJsonFromFolderStructure = (dirPath) => {
	return getDirectories(dirPath).map(section => {
		const sectionPath = path.join(dirPath, section);
		const categories = getCategories(section, sectionPath);
		return { section, categories };
	});
};

const generateDataToJsFile = (contentDir, outputFile) => {
	const generatedData = buildJsonFromFolderStructure(contentDir);
	const formatedData = JSON.stringify(generatedData, null, 2);
	const jsContent = `export const sidebarData = ${formatedData};`;

	fs.writeFileSync(outputFile, jsContent);
}

const contentDir = path.resolve('static/content');
const outputFile = path.resolve('src/lib/data/sidebar.js');

console.log(`Generating sidebar data from ${contentDir}\n\tinto ${outputFile}`);
generateDataToJsFile(contentDir, outputFile);
console.log('Sidebar data file generated successfully!\n');