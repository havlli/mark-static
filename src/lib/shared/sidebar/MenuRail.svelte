<script>
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { currentTile } from './sidebar-store.js';
	import { sidebarData } from '$lib/data/sidebar.js';
	import { formatFirstCharUppercase } from '$lib/text-utils.js';
	import { mapSectionNameToIcon } from '$lib/shared/sidebar/sidebar-icon-mapper.js';

	let selectedTile = $currentTile;
	$: $currentTile = selectedTile;
</script>

<div class="border-r border-gray-500 border-opacity-20 w-20">
	<AppRail background="transparent">
		{#each sidebarData as tile}
			<AppRailTile
				bind:group={selectedTile}
				name={tile.section}
				value={tile.section}
				title={tile.section}
			>
				<svelte:fragment slot="lead">
					<i class={mapSectionNameToIcon(tile.section)}></i>
				</svelte:fragment>
				<span>{formatFirstCharUppercase(tile.section)}</span>
			</AppRailTile>
		{/each}
	</AppRail>
</div>
