<script>
	import MenuRail from '$lib/shared/sidebar/MenuRail.svelte';
	import { currentTile } from '$lib/shared/sidebar/sidebar-service.js';
	import { sidebarData } from '$lib/data/sidebar-data.js';
</script>

<aside class="grid grid-cols-[auto_1fr] h-full w-[360px] border-r border-gray-500 border-opacity-20 sticky">
	<MenuRail />
	<section class="p-4 pb-20 space-y-4 overflow-y-auto h-full">
		{#each sidebarData as sidebarSection}
			{#if $currentTile === sidebarSection.type}
				{#each sidebarSection.categories as category, categoryIndex}
					<p class="font-bold pl-4 text-2xl">{category.title}</p>
					<nav class="list-nav">
						<ul>
							{#each category.subcategories as subcategory}
							<li>
								<a href={subcategory.path}>{subcategory.title}</a>
							</li>
							{/each}
						</ul>
					</nav>
					{#if sidebarSection.categories.length - 1 !== categoryIndex}
						<hr class="!my-6 opacity-50">
					{/if}
				{/each}
			{/if}
		{/each}
	</section>
</aside>
