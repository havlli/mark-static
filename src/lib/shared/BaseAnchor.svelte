<script>
	import { resolve } from '$app/paths';

	export let classes = '';
	export let target = '/';
	export let isActive = false;
	export let activeClass = '';
	export let ariaCurrent = undefined;
	export let ariaLabel = undefined;
	export let onclick = () => {};

	$: combinedClasses = isActive ? `${classes} ${activeClass}` : classes;
	$: isExternal = target.startsWith('http');
</script>

{#if isExternal}
	<a
		class={combinedClasses}
		href={target}
		target="_blank"
		rel="external noopener noreferrer"
		aria-current={ariaCurrent}
		aria-label={ariaLabel}
		{onclick}
	>
		<slot />
	</a>
{:else}
	<a
		class={combinedClasses}
		href={resolve(target)}
		aria-current={ariaCurrent}
		aria-label={ariaLabel}
		{onclick}
	>
		<slot />
	</a>
{/if}
