const fs = require('fs');
const path = require("path");

const contentDir = path.resolve('content');
const outputFile = path.resolve('static/menu.json');

function buildJsonFromFileStructure(dirPath) {
	const sections = fs.readdirSync(dirPath, { withFileTypes: true })
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

	return sections;
}

function writeDirectory(contentDir, outputFile) {
	const data = buildJsonFromFileStructure(contentDir);
	const formatedData = JSON.stringify(data, null, 2);
	fs.writeFileSync(outputFile, formatedData);
}

console.log(contentDir);
console.log(JSON.stringify(buildJsonFromFileStructure(contentDir)));
writeDirectory(contentDir, outputFile);
