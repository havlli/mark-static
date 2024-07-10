import { writable } from 'svelte/store';
import { sidebarData } from '$lib/data/sidebar-data.js';

export const currentTile = writable(sidebarData[0].type);

export const formatFirstCharUppercase = (value) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
}