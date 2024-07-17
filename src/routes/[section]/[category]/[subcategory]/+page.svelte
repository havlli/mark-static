<script>
	import { onDestroy, onMount } from 'svelte';
	import ImageModal from './ImageModal.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	export let data;

	let imageModal;
	const handleImageClicked = (event) => imageModal.handleImage(event.target);

	let imageListeners = [];

	const registerImageListeners = () => {
		const parsedImages = document.querySelectorAll('.page-content img');
		parsedImages.forEach(image => {
			const listener = handleImageClicked.bind(null);
			image.addEventListener('click', listener);
			imageListeners.push({ element: image, listener});
		});
	};

	const unregisterImageListeners = () => {
		imageListeners.forEach(({ element, listener }) => {
			element.removeEventListener('click', listener);
		});
		imageListeners = [];
	}

	onMount(() => registerImageListeners());
	afterNavigate(() => registerImageListeners());
	onDestroy(() => unregisterImageListeners());
	beforeNavigate(() => unregisterImageListeners());
</script>

<ImageModal bind:this={imageModal}/>
<section class="page-content">
	{@html data.content}
</section>

<style lang="postcss">
    :global(.page-content > *) {
        @apply my-4;
    }

    :global(.page-content h1) {
        @apply h1;
    }

    :global(.page-content h2) {
        @apply h2;
    }

    :global(.page-content h3) {
        @apply h3;
    }

    :global(.page-content h4) {
        @apply h4;
    }

    :global(.page-content h5) {
        @apply h5;
    }

    :global(.page-content h6) {
        @apply h6;
    }

    :global(.page-content hr) {
        @apply opacity-30;
    }

    :global(.page-content ul) {
        list-style-type: disc; /* Classic bullet points */
        margin-left: 2rem; /* Indent the list */
        padding-left: 0; /* Remove default padding */
        font-family: sans-serif; /* A clean, readable font */
        line-height: 1.6; /* Improve readability */
    }

    :global(.page-content ol) {
        list-style-type: decimal; /* Classic bullet points */
        margin-left: 2rem; /* Indent the list */
        padding-left: 0; /* Remove default padding */
        font-family: sans-serif; /* A clean, readable font */
        line-height: 1.6; /* Improve readability */
    }

    :global(.page-content li) {
        margin-bottom: 0.5rem; /* Space between items */
    }

    :global(.page-content blockquote) {
        @apply border-l-4 border-gray-400 pl-4 italic my-4;
    }

    :global(.page-content pre) {
        @apply bg-gray-800 bg-opacity-50 text-gray-200 border-gray-400 border border-opacity-25 p-4 rounded-lg overflow-auto;
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
</style>