<script lang="ts">
    import type { PageProps } from "./$types";
    import Cree from "./Cree.svelte";
    import English from "./English.svelte";

    let { params, data }: PageProps = $props();
</script>

<div class="container">
    {#if data.wordType === "english"}
        <English word={data.engWord} />
    {:else}
        <Cree word={data.creeWord}/>
    {/if}
</div>

<style>
    .container {
        position: relative;
        flex: 1;
    }
</style>
