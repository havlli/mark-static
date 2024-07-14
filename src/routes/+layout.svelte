<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
</script>

<Header />
<div class="flex-auto w-full h-full pt-[74px] flex overflow-hidden">
	<aside class="w-auto h-full">
		<SidebarLeft />
	</aside>
	<main id="page" class="overflow-y-auto flex-auto w-full scroll-smooth">
		<slot />
	</main>
</div>
