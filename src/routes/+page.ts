export const ssr = false;

import { commitsState } from '$lib/data/commits';
import { repositories } from '$lib/data/repos.svelte';
import { fetchRepositoryCommits } from '$lib/utils/fetch-wrappers';

// Only runs on the browser, before the page is rendered.
// Gets the repositories from localStorage and maps them to commmits stored in the browser-cache.
export async function load() {
	for (const repo of repositories.current) {
		const [commits, error] = await fetchRepositoryCommits(repo, 'only-if-cached');
		if (error) {
			commitsState.set(repo, undefined);
			continue;
		}

		commitsState.set(repo, commits);
	}

	return {};
}
