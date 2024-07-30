<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import { Drawer, initializeStores, Modal } from '@skeletonlabs/skeleton';
	import SidebarLeft from '$lib/shared/sidebar/Sidebar.svelte';
	import DarkModeResolver from './DarkModeResolver.svelte';

	initializeStores();
</script>

<DarkModeResolver />
<Modal />
<Drawer zIndex="z-50" rounded="rounded-none" width="w-[80%]">
	<SidebarLeft />
</Drawer>
<Header />
<div class="flex-auto w-full h-full pt-[74px] flex overflow-hidden">
	<slot />
</div>
