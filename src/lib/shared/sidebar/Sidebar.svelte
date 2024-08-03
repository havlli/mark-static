<script>
	import MenuRail from '$lib/shared/sidebar/MenuRail.svelte';
	import { currentTile } from '$lib/shared/sidebar/sidebar-store.js';
	import { sidebarData } from '$lib/data/sidebar.js';
	import { formatTitle } from '$lib/text-utils.js';
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';

	const drawerStore = getDrawerStore();

	const closeDrawer = () => {
		if ($drawerStore.open) {
			drawerStore.close();
		}
	};
</script>

<div
	class="grid grid-cols-[auto_1fr] lg:w-[360px] h-full border-r border-gray-500 border-opacity-20 sticky gap-0"
>
	<MenuRail />
	<section class="p-4 pb-20 space-y-4 overflow-y-auto h-full">
		{#each sidebarData as sidebarSection}
			{#if $currentTile === sidebarSection.section}
				{#each sidebarSection.categories as category, categoryIndex}
					<p class="font-bold pl-4 text-2xl">{formatTitle(category.title)}</p>
					<nav class="list-nav">
						<ul>
							{#each category.subcategories as subcategory}
								<li>
									<BaseAnchor target={subcategory.route}
															activeClass="bg-primary-300-600-token"
															isActive={$page.url.pathname.endsWith(subcategory.route)}
															on:click={closeDrawer}
									>
										{formatTitle(subcategory.title)}
									</BaseAnchor>
								</li>
							{/each}
						</ul>
					</nav>
					{#if sidebarSection.categories.length - 1 !== categoryIndex}
						<hr class="!my-6 opacity-50" />
					{/if}
				{/each}
			{/if}
		{/each}
	</section>
</div>
