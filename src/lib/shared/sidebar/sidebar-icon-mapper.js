const iconMap = new Map([['default', 'fa-solid fa-book']]);
iconMap.set('info', 'fa-solid fa-info');
iconMap.set('markdown', 'fa-solid fa-file-invoice');
iconMap.set('other', 'fa-solid fa-otter');

export const mapSectionToIcon = (sectionName) => {
	if (!sectionName || !iconMap.has(sectionName.toLowerCase())) {
		return iconMap.get('default');
	}

	return iconMap.get(sectionName.toLowerCase());
};
