<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { searchIndex } from '$lib/data/search-index.js';
	import { base } from '$app/paths';

	onMount(() => {
		goto(`${base}${searchIndex[0].route}`);
	});
</script>

<slot />
