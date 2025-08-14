import type { paths } from '$lib/types/openapi/github';

export type ListCommitsQueryParams =
	paths['/repos/{owner}/{repo}/commits']['get']['parameters']['query'];

export type ListCommits200Response =
	paths['/repos/{owner}/{repo}/commits']['get']['responses']['200']['content']['application/json'];

export type Commit = ListCommits200Response[number];
