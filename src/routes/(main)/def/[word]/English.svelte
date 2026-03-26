<script lang="ts">
	import type { EnglishWord } from "$lib/assets/content/dummy/types";
	import { creeWords } from "$lib/assets/content/itwewinaScrapedDictionary";
	import { UiStates } from "$lib/assets/shared_states/ui.svelte";
	import {
		CreeDialects,
		UserPref,
		type CreeDialect,
	} from "$lib/assets/shared_states/userPref.svelte";
	import CreeDefinition from "$lib/components/word_def_item/CreeDefinition.svelte";

	interface Props {
		word: EnglishWord;
	}
	const { word }: Props = $props();

	let sticky = $derived(UiStates.scrollY > UiStates.topbarHeight);
	let dialect: CreeDialect = $state(UserPref.dialect);
</script>

<div class="hor title" style="top: {UiStates.topbarHeight}px;" class:sticky>
	<h1>{word.primaryText}</h1>
	<div class="hor langOpt">
		<button
			class="iconBtn"
			onclick={() => {
				if (UserPref.format == "SRO") {
					UserPref.format = "Syllabics";
				} else {
					UserPref.format = "SRO";
				}
			}}
		>
			<img src="/icons/translate.svg" alt="SRO/Cree Syllabic toggle" />
		</button>
		<select name="Dialect Switcher" id="dialect" bind:value={dialect}>
			{#each CreeDialects as d}
				<option> {d}</option>
			{/each}
		</select>
	</div>
</div>






<div class="ver defContainer">
	{#each word.creeWords as creeWordId, index}
		{@const creeWord = creeWords[creeWordId]}
		{#if creeWord}
			<CreeDefinition {creeWord} index={index + 1} />
		{/if}
	{/each}
</div>

<style>
	.title.sticky {
		border-color: var(--black);
	}

	h1 {
		margin: 0;
	}

	.title {
		align-items: center;
		flex-wrap: wrap;

		position: sticky;

		background-color: var(--white);

		border-bottom: 2px solid transparent;
		transition: border-color 200ms ease-out;

		padding: 0rem 2rem;
		z-index: 100;
	}

	.langOpt {
		margin-left: auto;
		gap: 1rem;
	}

	.defContainer {
		align-items: center;
		gap: 1rem;

		padding: 2rem;
	}
</style>
