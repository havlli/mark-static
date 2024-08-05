<script>
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { currentTile } from './sidebar-store.js';
	import { sidebarData } from '$lib/data/sidebar.js';
	import { formatFirstCharUppercase } from '$lib/text-utils.js';
	import { mapSectionToIcon } from '$lib/shared/sidebar/sidebar-icon-mapper.js';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	onMount(() => {
		$currentTile =
			sidebarData.find(({ section }) =>
				$page.url.pathname.startsWith(`${base}/content/${section.toLowerCase()}`)
			)?.section || sidebarData[0].section;
	});
</script>

<div class="border-r border-gray-500 border-opacity-20 w-20">
	<AppRail background="transparent" active="bg-primary-300-600-token">
		{#each sidebarData as tile}
			<AppRailTile
				bind:group={$currentTile}
				name={tile.section}
				value={tile.section}
				title={tile.section}
			>
				<svelte:fragment slot="lead">
					<i class={mapSectionToIcon(tile.section)}></i>
				</svelte:fragment>
				<span>{formatFirstCharUppercase(tile.section)}</span>
			</AppRailTile>
		{/each}
	</AppRail>
</div>
