const fs = require('fs');
const path = require('path');

const removeOrdering = (value) => {
	const parts = value.split('.');
	if (parts.length > 1) {
		return parts.slice(1).join('.').trim();
	}
	return value;
};

const getDirectories = (srcPath) => {
	return fs
		.readdirSync(srcPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
};

const getSubcategories = (section, category, categoryPath) => {
	return getDirectories(categoryPath).map((subcategory) => {
		const subcategoryTitle = removeOrdering(subcategory);
		const route =
			`/content/${removeOrdering(section)}/${removeOrdering(category)}/${subcategoryTitle}`.toLowerCase();
		return {
			title: subcategoryTitle,
			route: route,
			contentPath: `/content/${section}/${category}/${subcategory}`
		};
	});
};

const getCategories = (section, sectionPath) => {
	return getDirectories(sectionPath).map((category) => {
		const categoryPath = path.join(sectionPath, category);
		const subcategories = getSubcategories(section, category, categoryPath);
		const categoryTitle = removeOrdering(category);
		return { title: categoryTitle, subcategories };
	});
};

const buildJsonFromFolderStructure = (dirPath) => {
	return getDirectories(dirPath).map((section) => {
		const sectionPath = path.join(dirPath, section);
		const categories = getCategories(section, sectionPath);
		const sectionTitle = removeOrdering(section);
		return { section: sectionTitle, categories };
	});
};

const generateDataToJsFile = (contentDir, outputFile) => {
	const generatedData = buildJsonFromFolderStructure(contentDir);
	const formatedData = JSON.stringify(generatedData, null, 2);
	const jsContent = `export const sidebarData = ${formatedData};`;

	fs.writeFileSync(outputFile, jsContent);
};

const contentDir = path.resolve('static/content');
const outputFile = path.resolve('src/lib/data/sidebar.js');

console.log(`Generating sidebar data from ${contentDir}\n\tinto ${outputFile}`);
generateDataToJsFile(contentDir, outputFile);
console.log('Sidebar data file generated successfully!\n');
