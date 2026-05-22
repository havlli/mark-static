/**
 * Mark Static project configuration.
 *
 * Scaffolded sites should be able to change identity, content location,
 * deployment base paths, and high-level theme choices from this file.
 */
export default {
	site: {
		name: 'mark-static',
		description: 'Dynamic Markdown to static site generator with SvelteKit.',
		docsLabel: 'Documentation',
		repositoryUrl: 'https://github.com/havlli/mark-static',
		basePath: '/mark-static',
		language: 'en'
	},
	content: {
		dir: 'static/content'
	},
	theme: {
		skeleton: 'wintry',
		preset: 'default',
		background: 'aurora'
	},
	homepage: {
		title: 'Convert Your Markdown Files to Static Site',
		description: 'Dynamic Markdown to static site generator with SvelteKit.',
		primaryLabel: 'Documentation',
		secondaryLabel: 'View on GitHub'
	}
};
