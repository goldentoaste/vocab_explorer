<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import NavBar, { type NavItem } from "$lib/components/NavBar.svelte";
	import "../global.css";

	let { children } = $props();

	let navTargets: NavItem[] = [
		{
			name: "Search",
			src: "/icons/search.svg",
			target: "/",
		},
		{
			name: "Settings",
			src: "/icons/setting.svg",
			target: "/settings",
		},
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="wrapper">
	<div id="content">
		{@render children()}
	</div>
	<div class="navContainer">
		<NavBar navItems={navTargets} />
	</div>
</div>

<style>
	#wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		width: 100dvw;
	}

	#content {
		position: relative;
		height: 100dvh;
		width: 100dvw;
		max-height: 800px;
		max-width: 500px;

		overflow-y: auto;

		background-color: var(--white);
	}

	.navContainer {
		position: absolute;
		height: 100dvh;
		width: 100dvw;
		max-height: 800px;
		max-width: 500px;

		left: 50%;
		top: 50%;

		transform: translate(-50%, -50%);

		pointer-events: none;
	}
</style>
