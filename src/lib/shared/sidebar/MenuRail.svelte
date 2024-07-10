<script>
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { currentTile, formatFirstCharUppercase } from './sidebar-service.js';
	import { sidebarData } from '$lib/data/sidebar-data.js';

	let selectedTile = $currentTile;
	$: $currentTile = selectedTile;
</script>

<div class="border-r border-gray-500 border-opacity-20">
	<AppRail background="transparent" >
		{#each sidebarData as tile}
			<AppRailTile bind:group={selectedTile} name={tile.type} value={tile.type} title={tile.type}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>{formatFirstCharUppercase(tile.type)}</span>
			</AppRailTile>
		{/each}
	</AppRail>
</div>
