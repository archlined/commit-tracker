import * as v from 'valibot';

export const LocalStorageRepoSchema = v.array(
	v.object({
		name: v.string(),
		description: v.string(),
		owner: v.string(),
		repo: v.string(),
		branch: v.string()
	})
);
