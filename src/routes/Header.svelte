<script>
	import { getModalStore, LightSwitch } from '@skeletonlabs/skeleton';
	import SearchModal from './SearchModal.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	const modalStore = getModalStore();

	const searchModalComponent = { ref: SearchModal };

	const modalSettings = {
		type: 'component',
		component: searchModalComponent,
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

<header class="fixed z-50 flex w-full h-[74px] justify-between p-4 items-center border-b border-gray-500 border-opacity-20">
	<section class="flex space-x-6">
		<button class="lg:hidden">
			<i class="fa-solid fa-bars text-xl mt-1 pl-1"></i>
		</button>
		<a class="text-2xl font-heading-token font-bold underline decoration-double decoration-1 decoration-primary-500" href="/">mark-static</a>
	</section>
	<nav class="flex gap-1.5 items-center">
		<a class="btn hover:variant-soft-primary flex justify-center" href="/content">
			<span class="hidden sm:inline">Documentation</span>
			<i class="fa-solid fa-book sm:!hidden !m-0"></i>
		</a>
		<a class="btn hover:variant-soft-primary" href="/">
			<span class="hidden sm:inline">About</span>
			<i class="fa-solid fa-book sm:!hidden !m-0"></i>
		</a>
		<div class="md:inline md:ml-2">
			<button class="btn space-x-4 variant-soft hover:variant-soft-primary" on:click={handleSearchClick}>
				<i class="fa-solid fa-magnifying-glass text-sm"></i>
				<small class="hidden md:inline-block">Ctrl+K</small>
			</button>
		</div>
		<section class="hidden sm:inline-flex space-x-4">
			<a href="/" class="btn-icon hover:variant-soft-primary">
				<i class="fa-brands fa-github text-lg pt-0.5"></i>
			</a>
		</section>
		<section class="inline-flex items-center px-2">
			<LightSwitch width="w-10" height="h-5" />
		</section>
	</nav>
</header>

<style>

</style>