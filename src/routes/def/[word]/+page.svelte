<script lang="ts">
    import { isEnglishWord } from "$lib/assets/content/englishWords";
    import { seeDefinitions } from "$lib/components/word_def_item/dummyData";
    import WordDefinitionItem from "$lib/components/word_def_item/WordDefinitionItem.svelte";
    import { error } from "@sveltejs/kit";

    let { params } = $props();

    if (!isEnglishWord(params.word)) {
        error(404, { message: `Word not found: ${params.word}` });
    }
</script>

<div class="hor title">
    <h1>{params.word}</h1>
    <div class="hor langOpt">
        <button class="iconBtn"
            ><img src="/icons/translate.svg" alt="SRO/Cree Syllabic toggle" /></button
        >
        <select name="Dialect Switcher" id="dialect">
            <option value="plainscree">Plains Cree</option>
            <option value="swampcree">Swamp Cree</option>
            <option value="woodsscree">Woods Cree</option>
            <option value="eastcree">East Cree</option>
        </select>
    </div>
</div>

<div class="ver defContainer">
    {#each seeDefinitions as definition, index}
        <WordDefinitionItem {definition} index={index + 1} />
    {/each}
</div>

<style>
    .title {
        align-items: center;
        flex-wrap: wrap;
    }

    .langOpt {
        margin-left: auto;
        gap: 1rem;
    }

    .defContainer {
        align-items: center;
        gap: 1rem;
    }
</style>
