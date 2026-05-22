<script>
	import { searchIndex } from '$lib/generated/content.js';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { toLowerCaseNoDashes, removeDashes } from '$lib/text-utils.js';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';

	export let onClose = () => {};

	function removeStaticPath(route) {
		return route.split('/').slice(2).join('/');
	}

	function groupByParent(filteredData) {
		const grouped = filteredData.reduce((acc, item) => {
			const parent = item.breadcrumb.slice(0, -1).join(' / ') || item.section;

			if (!acc[parent]) {
				acc[parent] = {
					parent,
					subcategories: []
				};
			}

			acc[parent].subcategories.push(item);

			return acc;
		}, {});

		return Object.values(grouped);
	}

	function search(value) {
		const normalizedQuery = toLowerCaseNoDashes(value.trim());
		const filteredData = searchIndex.filter(
			(item) =>
				normalizedQuery.length === 0 ||
				toLowerCaseNoDashes(
					[item.title, item.description, item.tags.join(' '), item.searchText].join(' ')
				).includes(normalizedQuery)
		);

		return groupByParent(filteredData);
	}

	let query = '';
	let searchInput;
	const searchResults = writable(search(query));

	onMount(() => searchInput?.focus());

	$: $searchResults = search(query);
	$: resultCount = $searchResults.reduce(
		(count, groupedResults) => count + groupedResults.subcategories.length,
		0
	);
	$: statusMessage =
		query.trim().length === 0
			? `${resultCount} pages available.`
			: `${resultCount} search ${resultCount === 1 ? 'result' : 'results'} for ${query}.`;
</script>

<div class="card bg-animated relative mt-8 mb-auto w-full max-w-[800px] shadow-xl backdrop-blur-lg">
	<header class="bg-white/10 dark:bg-black/10 flex items-center">
		<h2 id="site-search-title" class="sr-only">Search documentation</h2>
		<label for="site-search-input" class="sr-only">Search documentation</label>
		<i class="fa-solid fa-magnifying-glass text-xl ml-4"></i>
		<input
			id="site-search-input"
			type="search"
			placeholder="Search..."
			aria-controls="site-search-results"
			aria-describedby="site-search-status"
			data-autofocus
			bind:this={searchInput}
			bind:value={query}
			class="m-2 ml-4 w-full border-0 bg-transparent px-3 py-2 text-lg placeholder-surface-900/50 dark:placeholder-surface-50/50"
		/>
		<button
			type="button"
			class="btn-icon m-2 shrink-0 hover:variant-soft-primary"
			aria-label="Close search"
			onclick={onClose}
		>
			<i class="fa-solid fa-xmark"></i>
		</button>
	</header>
	<p id="site-search-status" class="sr-only" aria-live="polite">{statusMessage}</p>
	<nav
		id="site-search-results"
		aria-label="Search results"
		class="list-nav hide-scrollbar max-h-[480px] overflow-x-auto bg-transparent"
	>
		{#each $searchResults as groupedSearchResults (groupedSearchResults.parent)}
			<div class="text-sm font-bold p-4">{removeDashes(groupedSearchResults.parent)}</div>
			<ul>
				{#each groupedSearchResults.subcategories as subcategory (subcategory.route)}
					<li class="text-lg">
						<BaseAnchor
							target={subcategory.route}
							onclick={onClose}
							classes="!rounded-none justify-between hover:variant-soft focus:variant-filled-primary"
						>
							<div class="flex items-center gap-4">
								<i class="fa-solid fa-file"></i>
								<span class="flex-auto font-bold opacity-75">{removeDashes(subcategory.title)}</span
								>
							</div>
							<span class="hidden md:block text-xs opacity-50"
								>{removeStaticPath(subcategory.route)}</span
							>
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
	<footer
		class="hidden md:flex items-center gap-2 bg-white/10 dark:bg-black/10 p-4 text-xs font-bold"
	>
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
		background: linear-gradient(
			-45deg,
			rgba(var(--color-surface-700) / 0.15) 50%,
			rgba(var(--color-surface-200) / 0.15) 100%
		);
		background-size: 500% 500%;
		animation: gradient 5s ease infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.bg-animated {
			animation: none;
		}
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
