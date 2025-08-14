<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import { repositories } from '$lib/data/repos.svelte';
	import * as v from 'valibot';
	import { LocalStorageRepoSchema } from '$lib/schemas/LocalStorageRepoSchema';
	import { toast } from 'svelte-sonner';
	import Separator from './ui/separator/separator.svelte';

	const newRepository = {
		name: 'Svelte',
		description: 'web development for the rest of us',

		owner: 'sveltejs',
		repo: 'svelte',
		branch: 'main'
	};

	function addRepository() {
		if (
			repositories.current.find(
				(repo) =>
					repo.owner === newRepository.owner &&
					repo.repo === newRepository.repo &&
					repo.branch === newRepository.branch
			)
		) {
			console.log('Such a repository already exists');
			return;
		}

		repositories.current = [...repositories.current, newRepository];
	}

	let exportBtnEl: HTMLAnchorElement | null = $state(null);
	const downloadableData = $derived.by(() => {
		if (!repositories.current.length) return null;

		const data = JSON.stringify(repositories.current);
		const blob = new Blob([data], { type: 'application/json' });

		return window.URL.createObjectURL(blob);
	});

	async function onFileUpload({
		currentTarget
	}: Event & {
		currentTarget: EventTarget & HTMLInputElement;
	}) {
		const textContent = await currentTarget.files?.item(0)?.text();
		if (!textContent) return;

		// Validate file format to be valid JSON.
		let parsed: any = null;
		try {
			parsed = JSON.parse(textContent);
		} catch (e) {
			toast.error('Invalid JSON structure!');
			return;
		}

		// Validate JSON by schema.
		if (!v.is(LocalStorageRepoSchema, parsed)) {
			toast.error('Invalid JSON structure!');
			return;
		}

		repositories.current = JSON.parse(textContent);
		toast.success('Imported successfully!');
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'ml-auto')}>
		Repositories
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit repositories</Dialog.Title>
			<Dialog.Description>
				Make changes to your repository list here. Changes are saved automatically.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-2">
			{#each repositories.current as repository}
				<div>
					<Button
						variant="destructive"
						onclick={() => {
							repositories.current = repositories.current.filter((repo) => repo !== repository);
						}}
					>
						-
					</Button>
					<Button
						onclick={() => {
							repository.name = `${repository.name}+`;
							repositories.current = [...repositories.current];
						}}
					>
						{repository.name}
						{repository.branch}
					</Button>
				</div>
			{/each}

			<Separator class="my-2" />

			<div class="space-y-2">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="name"
						class="text-right"
					>
						Name
					</Label>
					<Input
						id="name"
						bind:value={newRepository.name}
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="description"
						class="text-right"
					>
						Description
					</Label>
					<Input
						id="description"
						bind:value={newRepository.description}
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="owner"
						class="text-right"
					>
						Owner
					</Label>
					<Input
						id="owner"
						bind:value={newRepository.owner}
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="repo"
						class="text-right"
					>
						Repo
					</Label>
					<Input
						id="repo"
						bind:value={newRepository.repo}
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="branch"
						class="text-right"
					>
						Branch
					</Label>
					<Input
						id="branch"
						bind:value={newRepository.branch}
						class="col-span-3"
					/>
				</div>
				<Button
					class="w-full"
					onclick={addRepository}
				>
					Add
				</Button>
			</div>

			<Separator class="my-2" />

			<Dialog.Footer class="grid grid-cols-2 gap-4">
				<Button
					bind:ref={exportBtnEl}
					href={downloadableData}
					download="repositories.json"
					variant="secondary"
				>
					Export
				</Button>
				<input
					type="file"
					accept="application/json"
					id="importedJson"
					class="hidden"
					oninput={onFileUpload}
				/>
				<label
					for="importedJson"
					class={cn(buttonVariants({ variant: 'secondary' }), 'cursor-pointer')}
				>
					Import
				</label>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>
