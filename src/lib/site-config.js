import config from '../../markstatic.config.js';

export const siteConfig = config;
export const site = config.site ?? {};
export const content = config.content ?? {};
export const theme = config.theme ?? {};
export const homepage = config.homepage ?? {};

export const siteName = site.name || 'mark-static';
export const docsLabel = site.docsLabel || 'Documentation';
export const repositoryUrl = site.repositoryUrl || '';
