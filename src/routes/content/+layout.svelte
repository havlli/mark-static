<script>
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
</script>

<aside class="w-auto h-full hidden lg:block">
	<SidebarLeft />
</aside>
<main id="page" class="overflow-y-auto flex-auto w-full scroll-smooth">
	<slot />
</main>
