import { writable } from 'svelte/store';
import { sidebarData } from '$lib/data/sidebar.js';

export const currentTile = writable(sidebarData[0].section);

export const formatFirstCharUppercase = (value) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatTitle = (title) => {
	return title.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};