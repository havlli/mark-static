<script>
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	let tocKey = 0;
	$: tocKey = $page.url.pathname;
</script>

<article class="flex w-full gap-10 items-start">
	<section class="w-full max-w-[56rem] min-w-0 mx-auto space-y-4 mb-10">
		<div use:tocCrawler={{ mode: 'generate', scrollTarget: '#page', key: tocKey }}>
			<slot />
		</div>
	</section>
	<aside class="sticky top-10 w-72 hidden xl:block space-y-4">
		<TableOfContents>
			<h1>On this page</h1>
		</TableOfContents>
	</aside>
</article>
