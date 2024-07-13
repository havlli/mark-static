<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
</script>

<Header />
<div id="content" class="flex-auto w-full h-full pt-[74px] flex overflow-hidden">
	<aside class="w-auto h-full">
		<SidebarLeft />
	</aside>
	<main class="p-10 overflow-y-auto w-full">
		<slot />
	</main>
</div>
