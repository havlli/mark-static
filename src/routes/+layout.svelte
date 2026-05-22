<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import SearchModal from './SearchModal.svelte';
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
	import DarkModeResolver from './DarkModeResolver.svelte';
	import { theme } from '$lib/site-config.js';
	import { isDrawerOpen, isSearchOpen } from '$lib/shared/ui/ui-store.js';
	import { focusTrap } from '$lib/shared/ui/focus-trap.js';

	const closeSearch = () => isSearchOpen.set(false);
	const closeDrawer = () => isDrawerOpen.set(false);

	const closeSearchFromBackdrop = (event) => {
		if (event.target === event.currentTarget) closeSearch();
	};

	const closeSearchFromBackdropKeydown = (event) => {
		if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			closeSearch();
		}
	};

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			closeSearch();
			closeDrawer();
		}
	};

	const applySiteTheme = () => {
		document.body.dataset.theme = theme.skeleton || 'wintry';
		document.body.dataset.msTheme = theme.preset || 'default';
		document.body.dataset.msBackground = theme.background || 'aurora';
	};

	onMount(() => {
		applySiteTheme();
		document.addEventListener('keydown', handleKeydown);

		return () => document.removeEventListener('keydown', handleKeydown);
	});

	$: isModalOpen = $isSearchOpen || $isDrawerOpen;
</script>

<DarkModeResolver />
{#if $isSearchOpen}
	<div
		id="site-search-dialog"
		class="modal-backdrop fixed inset-0 z-50 flex items-start justify-center px-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="site-search-title"
		tabindex="-1"
		use:focusTrap={{ onEscape: closeSearch }}
		onclick={closeSearchFromBackdrop}
		onkeydown={closeSearchFromBackdropKeydown}
	>
		<SearchModal onClose={closeSearch} />
	</div>
{/if}
{#if $isDrawerOpen}
	<div class="fixed inset-0 z-50 lg:hidden">
		<button
			type="button"
			class="modal-backdrop absolute inset-0"
			aria-label="Close navigation"
			tabindex="-1"
			onclick={closeDrawer}
		></button>
		<div
			id="mobile-navigation"
			class="site-drawer relative h-full w-[80%] max-w-96 shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="mobile-navigation-title"
			tabindex="-1"
			use:focusTrap={{ onEscape: closeDrawer }}
		>
			<div class="flex h-full flex-col">
				<div class="flex items-center justify-between border-b border-gray-500/20 p-3">
					<h2 id="mobile-navigation-title" class="font-bold">Navigation</h2>
					<button
						type="button"
						class="btn-icon hover:variant-soft-primary"
						aria-label="Close navigation"
						onclick={closeDrawer}
					>
						<i class="fa-solid fa-xmark"></i>
					</button>
				</div>
				<div class="min-h-0 flex-1">
					<SidebarLeft />
				</div>
			</div>
		</div>
	</div>
{/if}
<div class="contents" inert={isModalOpen} aria-hidden={isModalOpen ? 'true' : undefined}>
	<Header />
	<div class="flex-auto w-full h-full pt-[74px] flex overflow-hidden">
		<slot />
	</div>
</div>
