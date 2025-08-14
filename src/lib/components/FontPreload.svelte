<script lang="ts">
	export let paths: string[];
</script>

{#each paths as href (href)}
	{@const type = href.substring(href.lastIndexOf('.') + 1)}

	<link
		{href}
		rel="preload"
		as="font"
		type="font/{type}"
		crossOrigin="anonymous"
	/>
{/each}
