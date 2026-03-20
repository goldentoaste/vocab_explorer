<script lang="ts">
    import { englishWords } from "$lib/assets/content/englishWords";
    import NavBar, { type NavItem } from "$lib/components/NavBar.svelte";
    import Search from "$lib/components/Search.svelte";
    import Fuse from "fuse.js";

    const fuse = new Fuse(englishWords, {
        keys: ["text"],
        includeScore: true,
    });

    let text: string = "";
</script>

<div class="mainLayout">
    <h1>Better Iwaina?</h1>
    <Search
        bind:text
        style="min-width:60%;"
        autoCompleteProvider={(key) => {
            const searchRes = fuse.search(key, {
                limit: 10,
            });

            return searchRes
                .filter((item) => (item.score ?? 1) < 0.5)
                .map((item) => {
                    return item.item.text;
                });
        }}
    />

    {#if !text}
        <h3>Search searching to get started!</h3>
    {/if}
</div>

<style>
    .mainLayout {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 2rem;
    }

    h3 {
        color: var(--grey);
    }
</style>
