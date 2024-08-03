<script>
	import { searchIndex } from '$lib/data/search-index.js';
	import { writable } from 'svelte/store';
	import { toLowerCaseNoDashes, removeDashes } from '$lib/text-utils.js';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';

	const modal = getModalStore();

	function removeStaticPath(route) {
		return route.split('/').slice(2).join('/');
	}

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
	class="card bg-animated backdrop-blur-lg w-full max-w-[800px] shadow-xl mt-8 mb-auto"
>
	<header class="!bg-opacity-10 bg-white dark:bg-black flex items-center">
		<i class="fa-solid fa-magnifying-glass text-xl ml-4"></i>
		<input
			type="search"
			placeholder="Search..."
			bind:value={query}
			class="bg-transparent border-0 w-full m-2 ml-4 text-lg px-3 py-2 placeholder-surface-900 placeholder-opacity-50 dark:placeholder-surface-50 dark:placeholder-opacity-50 focus:ring-0 focus:outline-none focus:outline-0"
		/>
	</header>
	<nav class="list-nav overflow-x-auto max-h-[480px] hide-scrollbar bg-transparent">
		{#each $searchResults as groupedSearchResults}
			<div class="text-sm font-bold p-4">{removeDashes(groupedSearchResults.category)}</div>
			<ul>
				{#each groupedSearchResults.subcategories as subcategory}
					<li class="text-lg">
						<BaseAnchor target={subcategory.route}
												on:click={() => modal.close()}
												classes="!rounded-none justify-between hover:variant-soft focus:variant-filled-primary focus:ring-0 focus:outline-none focus:outline-0"
						>
							<div class="flex items-center gap-4">
								<i class="fa-solid fa-file"></i>
								<span class="flex-auto font-bold opacity-75">{removeDashes(subcategory.subcategory)}</span>
							</div>
							<span class="hidden md:block text-xs opacity-50">{removeStaticPath(subcategory.route)}</span>
						</BaseAnchor>
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
	<footer class="hidden md:flex items-center gap-2 !bg-opacity-10 bg-white dark:bg-black p-4 text-xs font-bold">
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

<style>
    .bg-animated {
        background: linear-gradient(-45deg, rgba(var(--color-surface-700) / 0.15) 50%, rgba(var(--color-surface-200) / 0.15) 100%);
        background-size: 500% 500%;
        animation: gradient 5s ease infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>