<script>
	import { firstPageRoute } from '$lib/generated/content.js';
	import BaseAnchor from '$lib/shared/BaseAnchor.svelte';
	import { docsLabel, homepage, repositoryUrl } from '$lib/site-config.js';
	import { resolve } from '$app/paths';

	const title = homepage.title || 'Convert Your Markdown Files to Static Site';
	const description =
		homepage.description || 'Dynamic Markdown to static site generator with SvelteKit.';
	const primaryLabel = homepage.primaryLabel || docsLabel;
	const secondaryHref = homepage.secondaryHref || repositoryUrl;
	const secondaryLabel = homepage.secondaryLabel || 'View on GitHub';
</script>

<main class="container h-full mx-auto flex justify-center items-center">
	<section class="py-16 text-center max-w-[700px] p-3 relative">
		<section class="animated-bg w-[10rem] h-[10rem] md:w-[20rem] md:h-[20rem]"></section>
		<h1 class="h1 !text-4xl md:!text-5xl mb-4">{title}</h1>
		<p class="text-xl mb-8">{description}</p>
		<div class="flex flex-wrap justify-center gap-5 relative">
			<a
				href={resolve(firstPageRoute)}
				class="btn bg-primary-400-500-token text-token py-2 px-4 rounded">{primaryLabel}</a
			>
			{#if secondaryHref}
				<BaseAnchor
					target={secondaryHref}
					classes="btn bg-gray-800 dark:bg-gray-600 text-white py-2 px-4 rounded"
				>
					{secondaryLabel}
				</BaseAnchor>
			{/if}
		</div>
	</section>
</main>

<style>
	.animated-bg {
		position: absolute;
		width: 10rem;
		height: 10rem;
		top: 50%;
		left: 50%;
		margin-left: -5rem;
		margin-top: -5rem;
		z-index: -1;
		border-radius: 9999px;
		--tw-blur: blur(50px);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		animation:
			pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;

		@media (min-width: 768px) {
			width: 20rem;
			height: 20rem;
			top: 50%;
			left: 50%;
			margin-left: -10rem;
			margin-top: -10rem;
		}
	}

	@keyframes glow {
		0% {
			background-color: rgb(var(--color-primary-500) / 0.2);
		}

		33% {
			background-color: rgb(var(--color-secondary-500) / 0.2);
		}

		66% {
			background-color: rgb(var(--color-tertiary-500) / 0.2);
		}

		to {
			background-color: rgb(var(--color-primary-500) / 0.2);
		}
	}

	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
