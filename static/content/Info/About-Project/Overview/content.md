
**mark-static** is a dynamic content-driven web application built using SvelteKit. This project dynamically generates routes, menus, categories, and subcategories from the folder structure and its content within the static directory. The folder structure follows this pattern: `section/category/subcategory/content.md`. Multiple sections, categories, and subcategories are supported, with routes dynamically built based on this structure. Content and images are also dynamically handled.

## Features

- **Dynamic Routing**: Routes are generated dynamically from the folder structure within the static directory.
- **Dynamic Menu and Categories**: Menu data and categories are generated from the folder structure at build time.
- **Markdown Parsing**: Content in markdown files is parsed into HTML.
- **Static Site Generation**: The application uses the `@sveltejs/adapter-static` to rebuild server-side components and logic to static files, making it suitable for hosting on static web hosting platforms.
- **Real-time Content Update**: Custom Vite plugin (`vite-plugin-generate-data.js`) watches for changes in the content folder and regenerates JSON files to reflect the latest data.

## Folder Structure

The folder structure within the static directory that is used to generate content pages is as follows:

```
static/
└── content/
    ├── section/
    │   ├── category/
    │   │   ├── subcategory/
    │   │   │   ├── content.md
    │   │   │   └── image.jpg
    │   │   └── subcategory/
    │   │       └── content.md
    │   └── category/
    │       └── subcategory/
    │           └── content.md
    └── section/
        ├── category/
        │   └── subcategory/
        │       └── content.md
        └── category/
            └── subcategory/
                └── content.md
```

## Scripts

- **Generate Menu**: Generates the menu JSON data from the folder structure.
- **Generate Search Index**: Builds the search index JSON data from the generated menu JSON.
- **Vite Plugin**: Custom Vite plugin integrates these scripts into the build and dev environment.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/tango-procedures.git
    cd tango-procedures
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the development server**:
    ```bash
    npm run dev
    ```

4. **Build for production**:
    ```bash
    npm run build
    ```

5. **Preview the production build**:
    ```bash
    npm run preview
    ```

## Development

The development workflow includes:

- **Linting and Formatting**:
    ```bash
    npm run lint
    npm run format
    ```

- **Custom Vite Plugin**:
  The `vite-plugin-generate-data.js` plugin handles content updates and script execution during build and development:
    ```js
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
                server.watcher.add(contentPath);
                server.watcher.on('add', handleChanges);
                server.watcher.on('unlink', handleChanges);
                server.watcher.on('change', handleChanges);
            }
        };
    }
    ```

## Dependencies

Key dependencies and devDependencies used in the project:

- **SvelteKit**: Core framework for building the application.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Marked**: Markdown parser.
- **Vite**: Build tool and development server.
- **HtmlParser2**: Library to modify parsed HTML elements and their attributes.

For the full list of dependencies, refer to `package.json`.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Feel free to modify this README to suit your project's specific needs and details.
