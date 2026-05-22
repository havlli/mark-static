import { writable } from 'svelte/store';
import { navigation } from '$lib/generated/content.js';

export const currentTile = writable(navigation[0].id);
