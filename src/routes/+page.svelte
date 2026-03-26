<script lang="ts">
    import { englishWords } from "$lib/assets/content/englishWords";
    import CreeSearchComp from "$lib/components/CreeSearchComp.svelte";
    import Search from "$lib/components/Search.svelte";
    import Fuse from "fuse.js";

    const fuse = new Fuse(englishWords, {
        keys: ["text"],
        includeScore: true,
    });

    let text: string = $state("");
</script>

<div class="mainLayout">
    <h1>Better <span class="mispell">Iwaina</span>?</h1>
    <CreeSearchComp/>

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
    }

    h3 {
        color: var(--grey);
    }
    .mispell {
        text-decoration: red underline wavy;
    }

</style>
