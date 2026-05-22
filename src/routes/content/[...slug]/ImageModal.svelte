<script>
	import { tick } from 'svelte';
	import { scale, fade } from 'svelte/transition';
	import { focusTrap } from '$lib/shared/ui/focus-trap.js';

	let isVisible = false;
	let src = '';
	let alt = '';
	let closeButton;

	export let onVisibilityChange = () => {};

	const close = () => {
		isVisible = false;
		onVisibilityChange(false);
	};

	const closeFromBackdrop = (event) => {
		if (event.target === event.currentTarget) close();
	};

	const closeFromBackdropKeydown = (event) => {
		if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			close();
		}
	};

	export async function handleImage(image) {
		src = image.src;
		alt = image.alt;
		isVisible = true;
		onVisibilityChange(true);

		await tick();
		closeButton?.focus();
	}
</script>

{#if isVisible}
	<div
		class="fullscreen"
		role="dialog"
		aria-label={alt ? `Image preview: ${alt}` : 'Image preview'}
		aria-modal="true"
		tabindex="-1"
		use:focusTrap={{ onEscape: close }}
		onclick={closeFromBackdrop}
		onkeydown={closeFromBackdropKeydown}
		transition:fade
	>
		<img {src} {alt} in:scale={{ delay: 250 }} out:scale />
		<button
			type="button"
			class="close-button"
			aria-label="Close image preview"
			bind:this={closeButton}
			onclick={close}
		>
			<i class="fa-solid fa-xmark"></i>
		</button>
	</div>
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
		position: relative;
		z-index: 1;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		pointer-events: none;
		cursor: zoom-out;
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 2;
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.45);
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.55);
		color: white;
		cursor: pointer;
		font: inherit;
		font-size: 1rem;
		line-height: 1;
	}

	.close-button:focus-visible {
		outline: 2px solid white;
		outline-offset: 3px;
	}
</style>
