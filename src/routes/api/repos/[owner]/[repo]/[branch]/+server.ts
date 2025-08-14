import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import { safeFetchJson } from '$lib/utils';
import { error, json } from '@sveltejs/kit';
import type { ListCommits200Response } from '$lib/types/git-types';

export async function GET({ params, setHeaders }) {
	const [responseJson, responseError] = await safeFetchJson<ListCommits200Response>(
		`https://api.github.com/repos/${params.owner}/${params.repo}/commits?sha=${params.branch}&per_page=10`,
		{
			headers: {
				Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
				'X-GitHub-Api-Version': '2022-11-28',
				Accept: 'application/vnd.github+json'
			}
		}
	);
	if (responseError) {
		error(400, responseError.message);
	}

	// Cache the reponses for 60 minutes
	setHeaders({
		'Cache-Control': 'max-age=3600'
	});

	return json(responseJson);
}
