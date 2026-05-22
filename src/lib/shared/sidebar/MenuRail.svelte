<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import { currentTile } from './sidebar-store.js';
	import { navigation } from '$lib/generated/content.js';
	import { mapSectionToIcon } from '$lib/shared/sidebar/sidebar-icon-mapper.js';

	const normalizePathname = (pathname) =>
		pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

	const isSameOrChildRoute = (pathname, route) => {
		const currentPath = normalizePathname(pathname);
		const targetPath = normalizePathname(resolve(route));

		return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
	};

	const getTabId = (id) => `sidebar-section-tab-${id}`;
	const getPanelId = (id) => `sidebar-section-panel-${id}`;

	const selectTile = async (id, shouldFocus = false) => {
		currentTile.set(id);

		if (shouldFocus) {
			await tick();
			document.getElementById(getTabId(id))?.focus();
		}
	};

	const moveTile = (offset) => {
		const selectedIndex = Math.max(
			navigation.findIndex((tile) => tile.id === $currentTile),
			0
		);
		const nextIndex = (selectedIndex + offset + navigation.length) % navigation.length;

		selectTile(navigation[nextIndex].id, true);
	};

	const handleKeydown = (event) => {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowRight':
				event.preventDefault();
				moveTile(1);
				break;
			case 'ArrowUp':
			case 'ArrowLeft':
				event.preventDefault();
				moveTile(-1);
				break;
			case 'Home':
				event.preventDefault();
				selectTile(navigation[0].id, true);
				break;
			case 'End':
				event.preventDefault();
				selectTile(navigation[navigation.length - 1].id, true);
				break;
		}
	};

	$: routeTileId = navigation.find((item) =>
		isSameOrChildRoute($page.url.pathname, `/content/${item.slug}`)
	)?.id;

	$: if (routeTileId) {
		currentTile.set(routeTileId);
	}
</script>

<div class="border-r border-gray-500/20 w-20">
	<nav class="p-2" aria-label="Content sections">
		<div class="flex flex-col items-center gap-2" role="tablist" aria-orientation="vertical">
			{#each navigation as tile (tile.id)}
				<button
					id={getTabId(tile.id)}
					type="button"
					role="tab"
					class={`flex w-full flex-col items-center gap-1 rounded-md px-2 py-3 text-xs transition-colors hover:variant-soft-primary ${
						$currentTile === tile.id ? 'bg-primary-300-600-token' : ''
					}`}
					title={tile.title}
					aria-selected={$currentTile === tile.id}
					aria-controls={getPanelId(tile.id)}
					tabindex={$currentTile === tile.id ? 0 : -1}
					onclick={() => selectTile(tile.id)}
					onkeydown={handleKeydown}
				>
					<i class={mapSectionToIcon(tile.title)}></i>
					<span class="max-w-full truncate">{tile.title}</span>
				</button>
			{/each}
		</div>
	</nav>
</div>
