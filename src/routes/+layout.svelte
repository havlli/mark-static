<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Modal />
<Header />
<div class="flex-auto w-full h-full pt-[74px] flex overflow-hidden">
	<slot />
</div>
