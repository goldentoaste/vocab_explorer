<script lang="ts">
	import type { CreeWord } from "$lib/assets/content/dummy/types";
	import { CreeFormatTranslate } from "$lib/assets/cree_util/cree_format_translate";
	import { UserPref } from "$lib/assets/shared_states/userPref.svelte";

	interface Props {
		index: number;
		creeWord: CreeWord;
	}

	let { creeWord, index }: Props = $props();

	let showDetail = $state(false);
	let contentHeight = $state(0);
	let dialect = $state(UserPref.dialect);
</script>

<div class="container" class:cree={UserPref.format === "Syllabics"}>
	<div class="hor">
		<div class="ver">
			<div class="hor" style="gap:1rem; align-items: center;">
				<span class="title">
					{index}.
					{CreeFormatTranslate(creeWord.primaryText, {
						...UserPref,
					})}
				</span>

				<span class="wordType">
					[{creeWord.wordType}]
				</span>
				<!-- end title row -->
			</div>

			<div class="ver description">
				<!-- description -->
				<ul>
					{#each creeWord.descriptions as desc}
						<li>{desc}</li>
					{/each}
				</ul>
				<!-- end description -->
			</div>

			<a href="/map/{creeWord.primaryText}">
				<button class="semantic">
					<img src="/icons/map.svg" alt="" /> Semantics
				</button>
			</a>
		</div>

		<div class="ver sideBtns">
			<!-- side buttons -->
			<button
				class="iconBtn"
				onclick={() => {
					alert(
						`Mock audio playback, Chosen dialect: ${dialect}, chosen word ${creeWord.primaryText}`,
					);
				}}
			>
				<img src="/icons/speaker.svg" alt="speaker icon button" />
			</button>
			<button class="iconBtn">
				<img src="/icons/photo.svg" alt=" icon button" />
			</button>
			<button
				class="iconBtn"
				onclick={() => {
					showDetail = !showDetail;
				}}
			>
				{#if !showDetail}
					<img src="/icons/plus.svg" alt="press to show more info" />
				{:else}
					<img src="/icons/minus.svg" alt="press to hide more info" />
				{/if}
			</button>
			<!-- end side buttons -->
		</div>
	</div>

	<!-- <h2 bind:clientHeight={contentHeight}>Tester</h2> -->

	<div class="detailContainer" style:--contentHeight={contentHeight} class:showDetail>
		<div class="detailContent" bind:clientHeight={contentHeight}>
			<div class="divider"></div>
			<span>{creeWord.detailedWordType}</span>

			<div class="morphsContainer">
				{#each creeWord.morphs as morph}
					<span style="grid-column: 1; text-align: right;">{morph.semantic}</span>

					<span style="grid-column: 2; text-align: left;"
						>{CreeFormatTranslate(morph.creeMorph, { ...UserPref })}</span
					>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.cree {
		font-family: CanadianSyllabic;
	}

	.container {
		padding: 0.75rem;
		border: 2px solid var(--black);
		border-radius: 6px;

		width: 100%;
		max-width: 350px;
	}

	.title {
		font-size: larger;
	}

	.wordType {
		font-size: smaller;
	}

	.sideBtns {
		margin-left: auto;
		gap: 0.25rem;
	}

	.divider {
		width: auto;
		height: 2px;
		background-color: var(--black);
		margin: 0.25rem 0;
	}

	.detailContent {
		display: flex;
		flex-direction: column;
		position: relative;
		padding-top: 0.5rem;
	}

	.detailContainer {
		height: fit-content;
		max-height: 0;

		transition: max-height 200ms ease-out;
		overflow: hidden;
	}

	.detailContainer.showDetail {
		max-height: calc(var(--contentHeight) * 1px);
	}

	.morphsContainer {
		font-size: smaller;
		margin-top: 0.5rem;

		max-width: 100%;
		display: grid;
		grid-template-columns: auto-fill auto-fill;
		gap: 1rem;
	}

	button {
		display: flex;
		align-items: center;
		flex-direction: row;
		width: fit-content;

		border: 1px solid var(--lightGrey);
		transition: border-color 200ms ease-out;
		background-color: transparent;

		padding: 0.25rem;
	}

	button:hover {
		border-color: var(--black);
	}

	button > img {
		height: auto;
		width: 1.25rem;
	}

	button.iconBtn {
		width: 1.75rem;
		height: 1.75rem;
	}

	ul {
		margin: 0.5rem;
		padding-left: 1rem;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
