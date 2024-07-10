<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
	import { onMount } from 'svelte';

	const offsetContentFromHeader = () => {
		const headerHeight = document.querySelector('header').offsetHeight;
		console.log(headerHeight);
		document.getElementById('content').style.paddingTop = headerHeight + 'px';
	}

	onMount(() => {
		offsetContentFromHeader();
	})
</script>

<Header />
<div id="content" class="flex-auto w-full h-full flex overflow-hidden">
	<SidebarLeft />
	<main>
		<slot />
	</main>
</div>
