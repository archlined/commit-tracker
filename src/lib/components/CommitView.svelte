<script lang="ts">
	import type { Commit } from '$lib/types/git-types';
	import { formatDistanceToNowStrict } from 'date-fns';

	const { commit, repo, owner }: { commit: Commit; repo: string; owner: string } = $props();

	function getBadge(commitMessage: string) {
		const badgeTypes = ['chore', 'feat', 'fix', 'docs', 'perf', 'meta'] as const;
		const CLASS_MAP: Record<string, string | undefined> = {
			feat: 'bg-green-500 border-green-400 text-green-300',
			perf: 'bg-orange-500 border-orange-400 text-orange-300',
			chore: 'bg-slate-500 border-slate-400 text-slate-300',
			fix: 'bg-red-500 border-red-400 text-red-300',
			docs: 'bg-blue-500 border-blue-400 text-blue-300'
		};

		if (badgeTypes.some((type) => commitMessage.startsWith(type))) {
			const type = badgeTypes.find((type) => commitMessage.startsWith(type))!;
			const classes = CLASS_MAP[type];

			return {
				type,
				classes: classes ?? 'bg-stone-500 border-stone-400 text-stone-300'
			};
		}

		return null;
	}

	function getPullRequest() {
		let pullRequest = commit.commit.message.match(/\#[0-9]+/)?.at(0);
		if (pullRequest !== undefined) {
			pullRequest = pullRequest.replace('#', '');
		}

		return pullRequest;
	}

	function getIsBotAuthor() {
		if (commit.author) {
			return commit.author.login.startsWith('github') || commit.author.login === 'dependabot[bot]';
		}

		return false;
	}

	function getTimeDistance() {
		if (commit.commit.author && commit.commit.author.date) {
			return formatDistanceToNowStrict(new Date(commit.commit.author.date), {
				addSuffix: true
			});
		}

		return null;
	}

	function getTruncatedMessage() {
		function debadgeMessage(message: string) {
			return message.replace(/^(chore|feat|fix|docs|perf|meta)[^:]*:/, '').trim();
		}
		function removePullRequestNumber(message: string) {
			return message.replace(/\(#[0-9]+\)/, '');
		}

		const truncatedMessage = commit.commit.message.split('\n')[0];

		const noPullRequest = removePullRequestNumber(truncatedMessage);

		const badge = getBadge(noPullRequest);

		if (!badge) {
			return {
				message: noPullRequest,
				badge: null
			};
		}

		return {
			message: debadgeMessage(noPullRequest),
			badge
		};
	}

	const pullRequest = getPullRequest();
	const isBotAuthor = getIsBotAuthor();
	const timeDistance = getTimeDistance();
	const { message, badge } = getTruncatedMessage();
</script>

<div class={['py-1.5', isBotAuthor && 'opacity-50']}>
	<p class="mb-1 text-base font-medium">
		{#if badge}
			<span
				class={[
					'mr-1 rounded-xl border border-opacity-40 bg-opacity-15 px-2 font-normal',
					badge.classes
				]}
			>
				{badge.type}
			</span>
		{/if}
		<a
			class="underline-offset-4 hover:underline"
			href={commit.html_url}
			target="_blank"
		>
			{message}
		</a>
		{#if pullRequest}
			<span class="inline-block text-nowrap">
				(
				<a
					class="text-blue-400 underline-offset-4 hover:underline"
					href="https://github.com/{owner}/{repo}/pull/{pullRequest}"
					target="_blank"
					rel="noreferrer"
				>
					#{pullRequest}
				</a>
				)
			</span>
		{/if}
	</p>
	<p class="flex items-center text-xs text-muted-foreground">
		{#if commit.author}
			<img
				src={commit.author?.avatar_url}
				alt="commit author avatar"
				class="mr-2 inline-block size-4 rounded-full"
			/>
		{/if}
		{commit.author?.login ?? ''} commited on {timeDistance}
	</p>
</div>
