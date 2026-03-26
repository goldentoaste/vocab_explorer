<script lang="ts">
	import { goto } from "$app/navigation";
	import {
		creeWords,
		englishWords,
	} from "$lib/assets/content/itwewinaScrapedDictionary";
	import Search from "$lib/components/Search.svelte";
	import Fuse from "fuse.js";

	const fuse = new Fuse(
		[...Object.values(creeWords), ...Object.values(englishWords)],
		{
			keys: ["primaryText", "descriptions"],
			isCaseSensitive: true,
			ignoreDiacritics: true,
			threshold: 0.45,
		},
	);

	let text = $state("");
</script>

<Search
	bind:text
	style="width:100%;
	max-width: 300px;"
	autoCompleteProvider={(key) => {
		const searchRes = fuse.search(key, {
			limit: 10,
		});
		return searchRes.map((item) => item.item.primaryText);
	}}
	onsubmit={() => {
		
		if (!(text in creeWords) && !(text in englishWords)) {
			alert("Word not found!");
		} else {
			goto(`/def/${text}`);
		}
	}}
/>

<style>
	/* CSS */
</style>
