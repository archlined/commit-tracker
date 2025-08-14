import type { Repo } from '$lib/types';
import type { Commit } from '$lib/types/git-types';

class Commits {
	#commits = new Map<Repo, Commit[] | undefined>();

	get = (repo: Repo) => {
		return this.#commits.get(repo);
	};

	set = (repo: Repo, commits: Commit[] | undefined) => {
		this.#commits.set(repo, commits);
	};
}

export const commitsState = new Commits();
