<script>
	import { getDrawerStore, getModalStore, LightSwitch } from '@skeletonlabs/skeleton';
	import SearchModal from './SearchModal.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';
	import { searchIndex } from '$lib/data/search-index.js';

	const drawerStore = getDrawerStore();

	const modalStore = getModalStore();

	const searchModalComponent = { ref: SearchModal };

	const modalSettings = {
		type: 'component',
		component: searchModalComponent
	};

	const handleKeydown = (event) => {
		if (event.ctrlKey && event.key === 'k') {
			event.preventDefault();
			modalStore.clear();
			handleSearchClick();
		}
	};
	const handleSearchClick = () => modalStore.trigger(modalSettings);

	if (browser) {
		onMount(() => document.addEventListener('keydown', handleKeydown));
		onDestroy(() => document.removeEventListener('keydown', handleKeydown));
	}
</script>

<header
	class="fixed z-39 flex w-full h-[74px] justify-between p-4 items-center border-b border-gray-500 border-opacity-20"
>
	<section class="flex gap-6 pl-2">
		<button class="lg:hidden" on:click={() => drawerStore.open()}>
			<i class="fa-solid fa-bars text-base mt-1 pl-1"></i>
		</button>
		<BaseAnchor
			classes="text-2xl font-heading-token font-bold underline decoration-double decoration-1 decoration-primary-500"
		>
			mark-static
		</BaseAnchor>
	</section>
	<nav class="flex gap-1.5 items-center">
		<BaseAnchor
			classes="btn hover:variant-soft-primary flex justify-center"
			target={searchIndex[0].route}
		>
			<span class="hidden sm:inline">Documentation</span>
			<i class="fa-solid fa-book sm:!hidden !m-0"></i>
		</BaseAnchor>
		<div class="md:inline md:ml-2">
			<button
				class="btn space-x-4 variant-soft hover:variant-soft-primary"
				on:click={handleSearchClick}
			>
				<i class="fa-solid fa-magnifying-glass text-sm"></i>
				<small class="hidden md:inline-block">Ctrl+K</small>
			</button>
		</div>
		<section class="hidden sm:inline-flex space-x-4">
			<BaseAnchor classes="btn-icon hover:variant-soft-primary">
				<i class="fa-brands fa-github text-lg pt-0.5"></i>
			</BaseAnchor>
		</section>
		<section class="inline-flex items-center px-2">
			<LightSwitch width="w-10" height="h-5" />
		</section>
	</nav>
</header>

<style>
</style>
