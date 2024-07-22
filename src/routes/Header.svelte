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
	<a class="h3" href="/">Tprocedures</a>
	<nav class="flex gap-2">
		<a class="btn hover:variant-soft-primary" href="/instructions">Instructions</a>
		<a class="btn hover:variant-soft-primary" href="/">About</a>
		<div class="md:inline md:ml-4">
			<button class="btn space-x-4 variant-soft hover:variant-soft-primary" on:click={handleSearchClick}>
				<i class="fa-solid fa-magnifying-glass text-sm"></i>
				<small class="hidden md:inline-block">Ctrl+K</small>
			</button>
		</div>
		<section class="hidden sm:inline-flex space-x-4">
			<a href="/" class="btn-icon hover:variant-soft-primary">
				<i class="fa-brands fa-github text-lg"></i>
			</a>
		</section>
		<section class="inline-flex items-center pb-1">
			<LightSwitch/>
		</section>
	</nav>
</header>

<style>

</style>