<script>
	import { onDestroy, onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';
	import { siteName } from '$lib/site-config.js';
	import ImageModal from './ImageModal.svelte';

	export let data;

	let imageModal;
	let isImagePreviewOpen = false;
	let imageTriggers = [];

	const setImagePreviewOpen = (value) => {
		isImagePreviewOpen = value;
	};

	const getImageLabel = (image) => {
		const alt = image.alt?.trim();
		return alt ? `Open image preview: ${alt}` : 'Open image preview';
	};

	const registerImageListeners = () => {
		unregisterImageListeners();

		const parsedImages = document.querySelectorAll('.page-content img');
		parsedImages.forEach((image) => {
			if (image.closest('a, button')) return;

			const parent = image.parentNode;
			if (!parent) return;

			const trigger = document.createElement('button');
			trigger.type = 'button';
			trigger.className = 'image-preview-trigger';
			trigger.setAttribute('aria-label', getImageLabel(image));

			const listener = () => imageModal?.handleImage(image);

			parent.insertBefore(trigger, image);
			trigger.appendChild(image);
			trigger.addEventListener('click', listener);
			imageTriggers.push({ trigger, image, listener });
		});
	};

	const unregisterImageListeners = () => {
		imageTriggers.forEach(({ trigger, image, listener }) => {
			trigger.removeEventListener('click', listener);

			if (trigger.parentNode) {
				trigger.parentNode.insertBefore(image, trigger);
				trigger.remove();
			}
		});
		imageTriggers = [];
	};

	onMount(() => registerImageListeners());
	afterNavigate(() => registerImageListeners());
	onDestroy(() => unregisterImageListeners());
	beforeNavigate(() => unregisterImageListeners());
</script>

<svelte:head>
	<title>{data.page.title} | {siteName}</title>
	{#if data.page.description}
		<meta name="description" content={data.page.description} />
	{/if}
</svelte:head>

<ImageModal bind:this={imageModal} onVisibilityChange={setImagePreviewOpen} />

<div inert={isImagePreviewOpen} aria-hidden={isImagePreviewOpen ? 'true' : undefined}>
	<nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-sm opacity-75">
		{#each data.page.breadcrumb as item, index (`${item.route ?? item.title}-${index}`)}
			{#if index > 0}
				<span>/</span>
			{/if}
			{#if item.route && index < data.page.breadcrumb.length - 1}
				<BaseAnchor target={item.route} classes="hover:underline">{item.title}</BaseAnchor>
			{:else}
				<span>{item.title}</span>
			{/if}
		{/each}
	</nav>

	<section class="page-content">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- Markdown HTML is sanitized in +page.server.js before rendering. -->
		{@html data.content}
	</section>
</div>

<style>
	@reference '../../../app.css';

	:global(.page-content *) {
		@apply mb-4;
	}

	:global(.page-content strong) {
		@apply font-semibold;
	}

	:global(.page-content h1, h2, h3, h4, h5, h6) {
		@apply pb-1.5;
		margin-top: 1.5rem !important;
		margin-bottom: 1rem !important;
	}

	:global(.page-content h2, h3, h4, h5, h6) {
		font-weight: 600 !important;
	}

	:global(.page-content h1) {
		@apply h1;
	}

	:global(.page-content h2) {
		@apply h2;
		@apply border-b border-b-surface-900/20 dark:border-b-surface-50/20;
	}

	:global(.page-content h3) {
		@apply h3;
		@apply border-b border-b-surface-900/20 dark:border-b-surface-50/20;
	}

	:global(.page-content h4) {
		@apply h4;
		@apply border-b border-b-surface-900/20 dark:border-b-surface-50/20;
	}

	:global(.page-content h5) {
		@apply h5;
		@apply border-b border-b-surface-900/20 dark:border-b-surface-50/20;
	}

	:global(.page-content h6) {
		@apply h6;
		@apply border-b border-b-surface-900/20 dark:border-b-surface-50/20;
	}

	:global(.page-content hr) {
		border-width: 0.15em !important;
		@apply border-b border-b-surface-900/20 dark:border-b-surface-50/20;
	}

	:global(.page-content ul) {
		list-style-type: disc;
		margin-left: 2rem;
		padding-left: 0;
	}

	:global(.page-content ol) {
		list-style-type: decimal;
		margin-left: 2rem;
		padding-left: 0;
		font-family: sans-serif;
		line-height: 1.6;
	}

	:global(.page-content li) {
		margin-top: 0.25rem;
		margin-bottom: 0;
	}

	:global(.page-content blockquote) {
		@apply border-l-4 border-gray-400 pl-4 italic my-4;
	}

	:global(.page-content pre) {
		@apply pre bg-gray-500/15 text-gray-200 border-gray-400/25 border p-4 rounded-lg mb-4 overflow-x-auto;
		@apply text-gray-950 dark:text-gray-200;
		font-size: 0.85em;
	}

	:global(.page-content pre code) {
		@apply overflow-x-auto whitespace-pre;
	}

	:global(.page-content code:not(pre code)) {
		@apply code whitespace-break-spaces relative -top-[1px] dark:text-primary-400;
		font-size: 0.85rem !important;
	}

	:global(.page-content code:not(pre code)) {
		@apply code;
	}

	:global(.page-content table) {
		@apply min-w-full rounded overflow-hidden;
	}

	:global(.page-content thead > tr) {
		@apply text-left;
	}

	:global(.page-content tr > th) {
		@apply py-2 px-2;
	}

	:global(.page-content tr > td) {
		@apply py-2 px-2 border-t border-gray-200/15;
	}

	:global(.page-content tbody > tr:hover) {
		@apply bg-gray-500/10;
	}

	:global(.page-content a) {
		@apply text-primary-500 hover:underline;
	}

	:global(.page-content a:visited) {
		@apply text-secondary-500;
	}

	:global(.page-content a:focus) {
		@apply outline-none ring-2 ring-primary-300;
	}

	:global(.page-content img) {
		@apply cursor-zoom-in;
	}

	:global(.page-content .image-preview-trigger) {
		@apply cursor-zoom-in rounded-sm bg-transparent p-0 text-left;
		border: 0;
		color: inherit;
		display: inline-block;
		font: inherit;
		line-height: 0;
		max-width: 100%;
	}

	:global(.page-content .image-preview-trigger:focus-visible) {
		@apply outline-none ring-2 ring-primary-300 ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-950;
	}

	:global(.page-content .image-preview-trigger img) {
		margin-bottom: 0 !important;
	}

	:global(.hljs) {
		background-color: transparent !important;
	}

	:global(pre code.hljs) {
		padding: 0 !important;
		margin: 0 !important;
	}
</style>
