<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
</script>

<Header />
<div id="content" class="flex-auto w-full h-full pt-[74px] flex overflow-hidden">
	<SidebarLeft />
	<main>
		<slot />
	</main>
</div>
