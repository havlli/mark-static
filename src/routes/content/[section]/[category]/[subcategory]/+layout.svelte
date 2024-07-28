<script>
	import { formatTitle } from '$lib/text-utils.js';
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	export let data;

	let tocKey = 0;
	$: tocKey = $page.url.pathname;
</script>

<article class="p-10 flex w-full justify-between gap-10 items-start">
	<section class="max-w-[56rem] mx-auto space-y-4 mb-10 w-full">
		<span class="badge variant-soft translate-y-1">{formatTitle(data.category)}</span>
		<h1 class="h1">{formatTitle(data.subcategory)}</h1>
		<div use:tocCrawler={{ mode: 'generate', scrollTarget: '#page', key: tocKey }}>
			<slot />
		</div>
	</section>
	<aside class="sticky top-10 z-50 h-fit w-72 hidden xl:block space-y-4">
		<TableOfContents>
			<h1>On this page</h1>
		</TableOfContents>
	</aside>
</article>
