<script lang="ts">
	import { Binoculars } from 'lucide-svelte';
	import ManageDialog from '$lib/components/ManageDialog.svelte';
</script>

<header
	class="sticky top-0 z-10 flex h-16 items-center justify-center gap-4 border-b bg-background bg-opacity-80 px-3.5 backdrop-blur-sm"
>
	<div class="flex flex-wrap items-center gap-2 font-semibold">
		<Binoculars class="size-4 sm:size-6" />
		<span>Commit</span>
		<span>Tracker</span>
	</div>

	<div>
		<ManageDialog />
	</div>
</header>
