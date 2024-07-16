<script>
	import { onMount } from 'svelte';

	export let data;

	const handleImageClicked = (event) => {
		const image = event.target;
		image.classList.toggle('fullscreen');
	}

	onMount(() => {
		const parsedImages = document.querySelectorAll('.page-content img');
		parsedImages.forEach(image => image.addEventListener('click', handleImageClicked));
	})
</script>

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

    :global(.fullscreen) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        cursor: zoom-out; /* Change cursor on fullscreen */
        object-fit: contain; /* Ensure image fits within the viewport */
        background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
        transition: transform 0.3s ease;
    }

    :global(.fullscreen img) {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        cursor: zoom-out; /* Change cursor on fullscreen */
    }
</style>