export const removeDashes = (value) => {
	return value.split('-').join(" ");
}

export const formatFirstCharUppercase = (value) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatTitle = (title) => {
	return removeDashes(title);
};