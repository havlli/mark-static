<script>
	import MenuRail from '$lib/shared/sidebar/MenuRail.svelte';
	import SidebarTree from '$lib/shared/sidebar/SidebarTree.svelte';
	import { currentTile } from '$lib/shared/sidebar/sidebar-store.js';
	import { navigation } from '$lib/generated/content.js';
	import { isDrawerOpen } from '$lib/shared/ui/ui-store.js';

	const closeDrawer = () => {
		isDrawerOpen.set(false);
	};

	const getTabId = (id) => `sidebar-section-tab-${id}`;
	const getPanelId = (id) => `sidebar-section-panel-${id}`;
</script>

<div class="site-sidebar grid grid-cols-[auto_1fr] lg:w-[360px] h-full border-r sticky gap-0">
	<MenuRail />
	<div class="p-4 pb-20 space-y-4 overflow-y-auto h-full">
		{#each navigation as root (root.id)}
			<div
				id={getPanelId(root.id)}
				role="tabpanel"
				aria-labelledby={getTabId(root.id)}
				hidden={$currentTile !== root.id}
			>
				<nav class="list-nav" aria-label={`${root.title} pages`}>
					<SidebarTree nodes={root.children} onNavigate={closeDrawer} />
				</nav>
			</div>
		{/each}
	</div>
</div>
