<script>
	import { onDestroy, onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import ImageModal from './ImageModal.svelte';
	import { formatTitle } from '$lib/text-utils.js';

	export let data;

	let imageModal;
	const handleImageClicked = (event) => imageModal.handleImage(event.target);

	let imageListeners = [];

	const registerImageListeners = () => {
		const parsedImages = document.querySelectorAll('.page-content img');
		parsedImages.forEach((image) => {
			const listener = handleImageClicked.bind(null);
			image.addEventListener('click', listener);
			imageListeners.push({ element: image, listener });
		});
	};

	const unregisterImageListeners = () => {
		imageListeners.forEach(({ element, listener }) => {
			element.removeEventListener('click', listener);
		});
		imageListeners = [];
	};

	onMount(() => registerImageListeners());
	afterNavigate(() => registerImageListeners());
	onDestroy(() => unregisterImageListeners());
	beforeNavigate(() => unregisterImageListeners());
</script>

<ImageModal bind:this={imageModal} />
<span class="badge variant-soft translate-y-1">{formatTitle(data.categoryTitle)}</span>
<section class="page-content">
	{@html data.content}
</section>

<style lang="postcss">
	:global(.page-content *) {
		@apply mb-4;
	}

	:global(.page-content strong) {
		@apply font-semibold;
	}

	:global(.page-content h1, h2, h3, h4, h5, h6) {
		@apply pb-1.5;
		@apply mb-4 mt-6 !important;
	}

  :global(.page-content h2, h3, h4, h5, h6) {
      @apply font-semibold !important;
  }

	:global(.page-content h1) {
		@apply h1;
	}

	:global(.page-content h2) {
		@apply h2;
		@apply border-b border-b-surface-900 border-opacity-20;
		@apply dark:border-b-surface-50 dark:border-opacity-20;
	}

	:global(.page-content h3) {
		@apply h3;
		@apply border-b border-b-surface-900 border-opacity-20;
		@apply dark:border-b-surface-50 dark:border-opacity-20;
	}

	:global(.page-content h4) {
		@apply h4;
		@apply border-b border-b-surface-900 border-opacity-20;
		@apply dark:border-b-surface-50 dark:border-opacity-20;
	}

	:global(.page-content h5) {
		@apply h5;
		@apply border-b border-b-surface-900 border-opacity-20;
		@apply dark:border-b-surface-50 dark:border-opacity-20;
	}

	:global(.page-content h6) {
		@apply h6;
		@apply border-b border-b-surface-900 border-opacity-20;
		@apply dark:border-b-surface-50 dark:border-opacity-20;
	}

	:global(.page-content hr) {
		border-width: 0.15em !important;
		@apply border-b border-b-surface-900 border-opacity-20 !important;
		@apply dark:border-b-surface-50 dark:border-opacity-20;
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
		@apply pre bg-gray-500 bg-opacity-15 text-gray-200 border-gray-400 border border-opacity-25 p-4 rounded-lg mb-4 overflow-x-auto;
			@apply text-gray-950 dark:text-gray-200;
		font-size: 0.85em;
	}

	:global(.page-content code:not(pre code)) {
		@apply dark:text-primary-400 !important;
		@apply code whitespace-break-spaces;
		@apply relative -top-[1px];
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
		@apply py-2 px-2 border-t border-gray-200 border-opacity-15;
	}

	:global(.page-content tbody > tr:hover) {
		@apply bg-gray-500 bg-opacity-10;
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
</style>
