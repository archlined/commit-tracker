// import { PersistedState } from 'runed';
import { PersistedState } from '$lib/utils/persistedState.svelte';
import type { Repo } from '$lib/types';

export const repositories = new PersistedState('repositories', [] as Repo[], {
	storage: 'local'
});
