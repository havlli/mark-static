<script>
	import { page } from '$app/stores';
</script>

<article class="flex w-full gap-10 items-start">
	<section class="w-full max-w-[56rem] min-w-0 mx-auto space-y-4 mb-10">
		<slot />
	</section>
	<aside class="sticky top-10 w-72 hidden xl:block space-y-4">
		<h1 class="text-sm font-bold uppercase tracking-wide opacity-70">On this page</h1>
		<nav class="space-y-1 text-sm">
			{#each $page.data.page?.headings ?? [] as heading (heading.id)}
				<a
					class={`block rounded px-2 py-1 hover:bg-surface-900/5 dark:hover:bg-surface-50/10 ${
						heading.depth > 2 ? 'ml-4 opacity-80' : ''
					}`}
					href={`#${heading.id}`}
				>
					{heading.title}
				</a>
			{/each}
		</nav>
	</aside>
</article>
