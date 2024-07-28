const iconMap = new Map([['default', 'fa-solid fa-book']]);

export const mapSectionNameToIcon = (sectionName) => {
	if (!sectionName || !iconMap.has(sectionName)) {
		return iconMap.get('default');
	}

	return iconMap.get(sectionName);
};
