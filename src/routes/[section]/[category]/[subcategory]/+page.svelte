<script>
	export let data;
</script>

<article>
	<h1>{data.title}</h1>
	{@html data.content}
</article>

<style lang="postcss">
	h1 {
			@apply h2;
	}
</style>