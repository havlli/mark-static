<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import SearchModal from './SearchModal.svelte';

	const modalStore = getModalStore();

	const searchModalComponent = { ref: SearchModal };

	const modalSettings = {
		type: 'component',
		component: searchModalComponent,
	};
</script>

<header class="fixed z-50 flex w-full h-[74px] justify-between p-4 items-center border-b border-gray-500 border-opacity-20">
	<span class="h3 ">Tprocedures</span>
	<nav class="flex gap-1">
		<button class="btn hover:variant-soft-primary">Menu Item</button>
		<button class="btn hover:variant-soft-primary">Menu Item</button>
		<div class="md:inline md:ml-4">
			<button class="btn space-x-4 variant-soft hover:variant-soft-primary" on:click={() => modalStore.trigger(modalSettings)}>
				<i class="fa-solid fa-magnifying-glass text-sm"></i>
				<small class="hidden md:inline-block">Ctrl+K</small>
			</button>
		</div>
		<section class="hidden sm:inline-flex space-x-1">
			<a href="/" class="btn-icon hover:variant-soft-primary">
				<i class="fa-brands fa-github text-lg"></i>
			</a>
		</section>
	</nav>
</header>

<style>

</style>