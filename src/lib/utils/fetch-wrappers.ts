import { safeFetchJson } from '$lib/utils';
import type { ListCommits200Response } from '$lib/types/git-types';
import type { Repo } from '$lib/types';

export async function fetchRepositoryCommits(
	repo: Repo,
	cacheOpts: 'only-if-cached' | 'skip-cache' | undefined = undefined
) {
	const skipCache = cacheOpts === 'skip-cache';
	const onlyCache = cacheOpts === 'only-if-cached';

	return await safeFetchJson<ListCommits200Response>(
		`/api/repos/${repo.owner}/${repo.repo}/${repo.branch}`,
		{
			headers: skipCache ? { 'Cache-Control': 'no-cache' } : undefined,
			cache: onlyCache ? 'only-if-cached' : undefined,
			mode: onlyCache ? 'same-origin' : undefined
		}
	);
}
