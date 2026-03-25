<script lang="ts">
    import { isEnglishWord } from "$lib/assets/content/englishWords";
    import { seeDefinitions } from "$lib/assets/content/dummyData.js";
    import WordDefinitionItem from "$lib/components/word_def_item/WordDefinitionItem.svelte";
    import { error } from "@sveltejs/kit";
    import { UserPref } from "$lib/assets/shared_states/userPref.svelte.js";

    let { params, data } = $props();
</script>

<div class="hor title">
    <h1>{params.word}</h1>
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
