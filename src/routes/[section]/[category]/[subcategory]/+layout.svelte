<script>
	import { formatTitle } from '$lib/text-utils.js';

	export let data;
</script>

<article>
	<section class="space-y-4 mb-10">
		<span class="badge variant-soft translate-y-1">{formatTitle(data.category)}</span>
		<h1 class="h1">{formatTitle(data.subcategory)}</h1>
	</section>
	<slot />
</article>