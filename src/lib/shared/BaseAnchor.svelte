<script>
	import { base } from '$app/paths';
	import { createEventDispatcher } from 'svelte';
	export let classes = '';
	export let target = '/';
	export let isActive = false;
	export let activeClass = '';

	const dispatch = createEventDispatcher();

	$: fullLink = `${base}${target}`;

	$: combinedClasses = isActive ? `${classes} ${activeClass}` : classes;
</script>

<a class={combinedClasses} href={fullLink} on:click={(e) => dispatch('click', e)}>
	<slot />
</a>