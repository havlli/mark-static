<script>
	import { base } from '$app/paths';
	import { createEventDispatcher } from 'svelte';
	export let classes = '';
	export let target = '/';
	export let isActive = false;
	export let activeClass = '';

	const dispatch = createEventDispatcher();

	$: href = target.startsWith('http') ? target : `${base}${target}`;

	$: combinedClasses = isActive ? `${classes} ${activeClass}` : classes;
</script>

<a class={combinedClasses} {href} on:click={(e) => dispatch('click', e)}>
	<slot />
</a>
