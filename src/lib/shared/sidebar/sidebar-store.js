import { writable } from 'svelte/store';
import { sidebarData } from '$lib/data/sidebar.js';

export const currentTile = writable(sidebarData[0].section);