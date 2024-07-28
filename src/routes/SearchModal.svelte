<script>
	import { searchIndex } from '$lib/data/search-index.js';
	import { writable } from 'svelte/store';
	import { toLowerCaseNoDashes, removeDashes } from '$lib/text-utils.js';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modal = getModalStore();

	function groupByCategory(filteredData) {
		const grouped = filteredData.reduce((acc, item) => {
			if (!acc[item.category]) {
				acc[item.category] = {
					category: item.category,
					subcategories: []
				};
			}

			acc[item.category].subcategories.push(item);

			return acc;
		}, {});

		return Object.values(grouped);
	}

	function search(value) {
		const filteredData = searchIndex.filter(
			(item) =>
				toLowerCaseNoDashes(item.section).includes(value.toLowerCase()) ||
				toLowerCaseNoDashes(item.category).includes(value.toLowerCase()) ||
				toLowerCaseNoDashes(item.subcategory).includes(value.toLowerCase())
		);

		return groupByCategory(filteredData);
	}

	let query = '';
	const searchResults = writable(search(query));

	$: $searchResults = search(query);
</script>

<div
	class="card !bg-surface-100/60 dark:!bg-surface-500/30 backdrop-blur-lg overflow-hidden w-full max-w-[800px] shadow-xl mt-8 mb-auto"
>
	<header class="bg-surface-300-600-token flex items-center">
		<i class="fa-solid fa-magnifying-glass text-xl ml-4"></i>
		<input
			type="search"
			placeholder="Search..."
			bind:value={query}
			class="bg-transparent border-0 ring-0 focus:ring-0 w-full m-2 ml-4 text-lg px-3 py-2"
		/>
	</header>
	<nav class="list-nav overflow-x-auto max-h-[480px] hide-scrollbar bg-transparent">
		{#each $searchResults as groupedSearchResults}
			<div class="text-sm font-bold p-4">{removeDashes(groupedSearchResults.category)}</div>
			<ul>
				{#each groupedSearchResults.subcategories as subcategory}
					<li class="text-lg">
						<a
							class="!rounded-none justify-between hover:variant-soft focus:!variant-filled-primary outline-0"
							href={subcategory.path}
							on:click={() => modal.close()}
						>
							<div class="flex items-center gap-4">
								<i class="fa-solid fa-file"></i>
								<span class="flex-auto font-bold opacity-75"
									>{removeDashes(subcategory.subcategory)}</span
								>
							</div>
							<span class="hidden md:block text-xs opacity-50">{subcategory.path}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/each}
		{#if $searchResults.length === 0}
			<div class="p-4">
				<p class="text-sm">
					No results found for <code class="code">{query}</code>.
				</p>
			</div>
		{/if}
	</nav>
	<footer class="hidden md:flex items-center gap-2 bg-surface-300-600-token p-4 text-xs font-bold">
		<div>
			<kbd class="kbd">Esc</kbd> to Close
		</div>
		<div>
			<kbd class="kbd">Tab</kbd> to navigate
		</div>
		<div>
			<kbd class="kbd">Enter</kbd> to select
		</div>
	</footer>
</div>
