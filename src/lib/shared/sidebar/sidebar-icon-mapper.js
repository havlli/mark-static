const iconMap = new Map([['default', 'fa-solid fa-book']]);
iconMap.set('info', 'fa-solid fa-info');

export const mapSectionNameToIcon = (sectionName) => {
	if (!sectionName || !iconMap.has(sectionName.toLowerCase())) {
		return iconMap.get('default');
	}

	return iconMap.get(sectionName.toLowerCase());
};
