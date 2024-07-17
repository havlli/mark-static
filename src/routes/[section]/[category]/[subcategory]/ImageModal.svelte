<script>
	import { scale, fade } from 'svelte/transition';

	let isVisible = false;
	let src = '';
	let alt = '';

	export function handleImage(image) {
		src = image.src;
		alt = image.alt;
		isVisible = true;
	}

</script>

{#if isVisible}
	<button class="fullscreen" on:click={() => isVisible = !isVisible} transition:fade>
		<img {src} {alt} in:scale={{ delay: 250 }} out:scale />
	</button>
{/if}

<style>
    .fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: zoom-out;
    }

    .fullscreen img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        cursor: zoom-out;
    }
</style>