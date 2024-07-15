<script>
	export let data;
</script>

<section class="page-content">
	{@html data.content}
</section>

<style lang="postcss">
    :global(.page-content > *) {
        @apply my-4;
    }

    :global(.page-content > h1) {
        @apply h1;
    }

    :global(.page-content > h2) {
        @apply h2;
    }

    :global(.page-content > h3) {
        @apply h3;
    }

    :global(.page-content > h4) {
        @apply h4;
    }

    :global(.page-content > h5) {
        @apply h5;
    }

    :global(.page-content > h6) {
        @apply h6;
    }

    :global(.page-content > hr) {
        @apply opacity-30;
    }

    :global(.page-content > ul) {
        list-style-type: disc; /* Classic bullet points */
        margin-left: 2rem; /* Indent the list */
        padding-left: 0; /* Remove default padding */
        font-family: sans-serif; /* A clean, readable font */
        line-height: 1.6; /* Improve readability */
    }

    :global(.page-content > ul > li) {
        margin-bottom: 0.5rem; /* Space between items */
    }
</style>