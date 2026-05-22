<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';

	export let nodes = [];
	export let depth = 0;
	export let onNavigate = () => {};

	$: listClasses = depth === 0 ? 'space-y-4' : 'space-y-1';
	$: headingClasses = `font-bold pl-4 ${depth === 0 ? 'text-2xl' : 'text-base'}`;

	const normalizePathname = (pathname) =>
		pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

	const isActiveRoute = (route) =>
		normalizePathname($page.url.pathname) === normalizePathname(resolve(route));
</script>

<ul class={listClasses}>
	{#each nodes as node (node.id)}
		<li>
			{#if node.route}
				{@const isActive = isActiveRoute(node.route)}
				<BaseAnchor
					target={node.route}
					activeClass="bg-primary-300-600-token"
					{isActive}
					ariaCurrent={isActive ? 'page' : undefined}
					onclick={onNavigate}
					classes={depth > 0 ? 'text-sm' : ''}
				>
					{node.title}
				</BaseAnchor>
			{:else}
				<p class={headingClasses}>{node.title}</p>
			{/if}

			{#if node.children.length > 0}
				<div class={`mt-2 ${depth > 0 ? 'pl-3' : ''}`}>
					<svelte:self nodes={node.children} depth={depth + 1} {onNavigate} />
				</div>
			{/if}
		</li>
	{/each}
</ul>
