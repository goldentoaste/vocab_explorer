<script lang="ts">
	import { UiStates } from "$lib/assets/shared_states/ui.svelte";
	import { onMount } from "svelte";
	import CreeSearchComp from "./CreeSearchComp.svelte";
</script>

<div class="hor container" bind:clientHeight={UiStates.topbarHeight}>
	<button
		class="iconBtn"
		onclick={() => {
			history.back();
		}}
	>
		<img src="/icons/back.svg" alt="" style="width: 1rem; height:auto;" />
	</button>
	<CreeSearchComp></CreeSearchComp>
	<a href="/settings	">
		<button class="iconBtn" style="width:2rem; height: 2rem;">
			<img src="/icons/setting.svg" alt="settings button." />
		</button></a
	>

	<a href="/"
		><button class="iconBtn" style="width:2rem; height: 2rem;"
			><img src="/icons/home.svg" alt="Go home" /></button
		></a
	>
</div>

<style>
	.container {
		position: sticky;
		top: 0;

		width: 100%;
		display: flex;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;

		background-color: var(--white);
		z-index: 1000;
	}
</style>
