<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { subHours } from 'date-fns';
	import { RotateCw, TriangleAlert } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { fetchRepositoryCommits } from '$lib/utils/fetch-wrappers';
	import CommitViewSkeleton from './CommitViewSkeleton.svelte';
	import CommitView from './CommitView.svelte';
	import type { Commit } from '$lib/types/git-types';
	import type { Repo } from '$lib/types';
	import { commitsState } from '$lib/data/commits';
	import { onMount } from 'svelte';
	import Separator from './ui/separator/separator.svelte';

	let { repo }: { repo: Repo } = $props();

	let commits: Commit[] | null = $state(null);
	let last24HoursCommits: any[] | null = $state(null);
	let noCommitInTheLast24Hours: boolean = $state(false);

	let loadingState: 'idle' | 'loading' = $state('idle');

	function setComponentState(newCommits: Commit[]) {
		last24HoursCommits = newCommits.filter(
			(commit) => new Date(commit.commit.committer?.date ?? new Date()) >= subHours(new Date(), 24)
		);
		noCommitInTheLast24Hours = last24HoursCommits?.length === 0;

		commits = last24HoursCommits?.length !== 0 ? last24HoursCommits : newCommits;
	}

	async function getRepositoryCommits(
		cacheOpts: 'only-if-cached' | 'skip-cache' | undefined = undefined
	) {
		loadingState = 'loading';

		const [rawCommits, error] = await fetchRepositoryCommits(repo, cacheOpts);
		if (error) {
			console.error(error);
			loadingState = 'idle';
			return;
		}

		setComponentState(rawCommits);

		loadingState = 'idle';
	}

	onMount(() => {
		commits = commitsState.get(repo) ?? null;
		if (commits) {
			setComponentState(commits);
		}
	});
</script>

<Card.Root class={[noCommitInTheLast24Hours && 'border-orange-400 border-opacity-40']}>
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger
						disabled={loadingState === 'loading'}
						class={buttonVariants({ variant: 'outline' })}
						onclick={() => getRepositoryCommits('skip-cache')}
					>
						<RotateCw class="size-4" />
					</Tooltip.Trigger>
					<Tooltip.Content>Force Refresh</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<p>
				<a
					href="https://github.com/{repo.owner}/{repo.repo}/commits/{repo.branch}"
					target="_blank"
					rel="noreferrer"
				>
					<!-- {repo.name} -->
					{repo.owner}/{repo.repo}
				</a>

				<span
					class={[
						'font-mono text-base text-muted-foreground',
						repo.branch !== 'main' && repo.branch !== 'master' && 'text-purple-400'
					]}
				>
					({repo.branch})
				</span>
			</p>

			{#if noCommitInTheLast24Hours}
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<TriangleAlert class="inline-block size-5 text-orange-400" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p class="text-orange-400">No commits in the last 24 hours.</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			{/if}
		</Card.Title>

		<Card.Description class="truncate whitespace-nowrap">
			{repo.description}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<ScrollArea class="relative h-[250px] overflow-y-scroll">
			<div>
				{#if loadingState === 'loading'}
					{#each { length: 5 }}
						<CommitViewSkeleton />
						<Separator class="h-[1px]" />
					{/each}
				{:else if commits === null}
					<Button
						class="w-full"
						onclick={() => getRepositoryCommits()}
					>
						Load data
					</Button>
				{:else}
					{#each commits as commit}
						<CommitView
							{commit}
							owner={repo.owner}
							repo={repo.repo}
						/>
						<Separator class="h-[1px]" />
					{/each}
				{/if}
			</div>
		</ScrollArea>
	</Card.Content>
</Card.Root>
