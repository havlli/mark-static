<script>
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';
	import { firstPageRoute } from '$lib/generated/content.js';
	import { docsLabel, repositoryUrl, siteName } from '$lib/site-config.js';
	import DarkModeToggle from '$lib/shared/ui/DarkModeToggle.svelte';
	import { isDrawerOpen, isSearchOpen } from '$lib/shared/ui/ui-store.js';

	const handleKeydown = (event) => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			handleSearchClick();
		}
	};
	const handleSearchClick = () => isSearchOpen.set(true);

	if (browser) {
		onMount(() => document.addEventListener('keydown', handleKeydown));
		onDestroy(() => document.removeEventListener('keydown', handleKeydown));
	}
</script>

<header
	class="site-header fixed z-39 flex w-full h-[74px] justify-between p-4 items-center border-b"
>
	<div class="flex gap-6 pl-2">
		<button
			class="lg:hidden"
			type="button"
			aria-label="Open navigation"
			aria-controls="mobile-navigation"
			aria-expanded={$isDrawerOpen}
			onclick={() => isDrawerOpen.set(true)}
		>
			<i class="fa-solid fa-bars text-base mt-1 pl-1"></i>
		</button>
		<BaseAnchor
			classes="text-2xl font-heading-token font-bold underline decoration-double decoration-1 decoration-primary-500"
		>
			{siteName}
		</BaseAnchor>
	</div>
	<nav class="flex gap-1.5 items-center">
		<BaseAnchor
			classes="btn hover:variant-soft-primary flex justify-center"
			target={firstPageRoute}
		>
			<span class="hidden sm:inline">{docsLabel}</span>
			<i class="fa-solid fa-book sm:!hidden !m-0"></i>
		</BaseAnchor>
		<div class="md:inline md:ml-2">
			<button
				class="btn header-search-button variant-soft hover:variant-soft-primary"
				type="button"
				aria-label="Open search"
				aria-controls="site-search-dialog"
				aria-expanded={$isSearchOpen}
				aria-haspopup="dialog"
				aria-keyshortcuts="Control+K Meta+K"
				onclick={handleSearchClick}
			>
				<i class="fa-solid fa-magnifying-glass text-sm"></i>
				<small class="hidden md:inline-block">Ctrl/Cmd+K</small>
			</button>
		</div>
		<div class="hidden sm:inline-flex space-x-4">
			{#if repositoryUrl}
				<BaseAnchor
					target={repositoryUrl}
					classes="btn-icon hover:variant-soft-primary"
					ariaLabel={`Open ${siteName} repository`}
				>
					<i class="fa-brands fa-github text-lg pt-0.5"></i>
				</BaseAnchor>
			{/if}
		</div>
		<div class="inline-flex items-center px-2">
			<DarkModeToggle />
		</div>
	</nav>
</header>
