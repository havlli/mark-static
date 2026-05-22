<script>
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
</script>

<a
	href="#page"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white"
>
	Skip to content
</a>
<aside class="w-auto h-full hidden lg:block">
	<SidebarLeft />
</aside>
<main id="page" tabindex="-1" class="overflow-y-auto p-10 flex-auto w-full scroll-smooth">
	<slot />
</main>
