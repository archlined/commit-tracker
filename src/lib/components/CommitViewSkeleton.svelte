<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
</script>

<div class="mb-[1px] py-1.5 opacity-50">
	<p class="mb-[0.4rem] flex">
		<!-- Badge -->
		<Skeleton class="mr-1 h-[1.3rem] w-14 rounded-xl" />

		<!-- Message -->
		<Skeleton class="mr-1 h-[1.3rem] w-3/4" />
	</p>
	<p class="flex items-center">
		<!-- Profile Image -->
		<Skeleton class="mr-1.5 inline-block size-4 rounded-full" />

		<!-- Commit Info -->
		<Skeleton class="h-[0.8rem] w-1/6" />
	</p>
</div>
