<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center w-full">
	<div class="flex items-end justify-start">
		<h1 class="h1 font-bold pr-2">{$page.status}</h1>
		<p class="h3 font-bold opacity-90">{$page.error.message}</p>
	</div>
	<span class="opacity-60">Oops, you shouldn't be here!</span>
</div>