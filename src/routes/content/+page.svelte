<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { firstPageRoute } from '$lib/generated/content.js';

	onMount(() => {
		goto(resolve(firstPageRoute));
	});
</script>

<slot />
