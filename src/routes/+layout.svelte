<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import FontPreload from '$lib/components/FontPreload.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	const { children } = $props();
</script>

<svelte:head>
	<title>Commit Tracker</title>

	<FontPreload
		paths={['/fonts/geist/GeistVariableVF.woff2', '/fonts/geist/GeistMonoVariableVF.woff2']}
	/>
</svelte:head>

<Toaster
	position="top-center"
	closeButton
/>
<div
	class="flex min-h-screen w-full flex-col"
	data-vaul-drawer-wrapper
>
	<Header />

	<div class="main-content mx-4 my-4 flex max-w-7xl flex-col gap-4">
		{@render children()}
	</div>
</div>

<style>
	@media (min-width: 1312px) {
		.main-content {
			margin-left: auto;
			margin-right: auto;
			margin-top: 2.5rem;
			margin-bottom: 2.5rem;
			width: 100%;
		}
	}
</style>
