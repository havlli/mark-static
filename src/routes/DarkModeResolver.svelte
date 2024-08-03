<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let isDarkMode;
	let observer;

	const handleDarkModeChange = () => {
		isDarkMode = document.documentElement.classList.contains('dark');
	};

	onMount(() => {
		handleDarkModeChange();

		observer = new MutationObserver(handleDarkModeChange);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<svelte:head>
	{#if isDarkMode}
		<link id="highlight-dark" rel="stylesheet" href="{base}/css/github-dark.min.css" />
	{:else}
		<link id="highlight-light" rel="stylesheet" href="{base}/css/github.min.css" />
	{/if}
</svelte:head>
