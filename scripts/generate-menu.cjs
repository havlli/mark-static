const fs = require('fs');
const path = require("path");

const contentDir = path.resolve('static/content');
const outputFile = path.resolve('src/lib/data/sidebar.js');

function buildJsonFromFileStructure(dirPath) {
	return fs.readdirSync(dirPath, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => {
			const section = dirent.name;
			const sectionPath = path.join(dirPath, section);

			const categories = fs.readdirSync(sectionPath, { withFileTypes: true })
				.filter(dirent => dirent.isDirectory())
				.map(dirent => {
					const category = dirent.name;
					const categoryPath = path.join(sectionPath, category);

					const subcategories = fs.readdirSync(categoryPath, { withFileTypes: true })
						.filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
						.map(file => ({
							title: path.basename(file.name, '.md'),
							path: `/${section}/${category}/${path.basename(file.name, '.md')}`
						}));

					return { title: category, subcategories };
				});

			return { section, categories };
		});
}

function generateJsFile(contentDir, outputFile) {
	const menuStructure = buildJsonFromFileStructure(contentDir);
	const formatedData = JSON.stringify(menuStructure, null, 2);
	const jsContent = `export const sidebarData = ${ formatedData }`;
	fs.writeFileSync(outputFile, jsContent);
}

console.log(contentDir);
console.log(JSON.stringify(buildJsonFromFileStructure(contentDir)));
generateJsFile(contentDir, outputFile);
