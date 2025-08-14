<script lang="ts">
	import RepoCommits from '$lib/components/RepoCommits.svelte';
	import { repositories } from '$lib/data/repos.svelte';
</script>

{#if repositories.current.length === 0}
	<p class="px-auto text-center text-lg font-medium">No repositories are being tracked</p>
	<p class="text-center text-muted-foreground">
		Use the 'Manage' button to add or import repositories you wish to track.
	</p>
{:else}
	{#each repositories.current as repo}
		<RepoCommits {repo} />
	{/each}
{/if}
