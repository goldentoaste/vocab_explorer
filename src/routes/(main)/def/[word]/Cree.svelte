<script lang="ts">
    import type { CreeWord } from "$lib/assets/content/dummy/types";
    import { CreeFormatTranslate } from "$lib/assets/cree_util/cree_format_translate";
    import {
        CreeDialects,
        UserPref,
        type CreeDialect,
    } from "$lib/assets/shared_states/userPref.svelte";

    interface Props {
        word: CreeWord;
    }

    let { word }: Props = $props();

    let dialect: CreeDialect = $state(UserPref.dialect);
</script>

<div class="title">
    <h1>{CreeFormatTranslate(word.primaryText, { ...UserPref })}</h1>
    <span>
        {word.wordType} ({word.detailedWordType})
    </span>
    <div class="toolButtons">
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

        <button
            class="iconBtn"
            onclick={() => {
                alert(
                    `Mock audio playback, Chosen dialect: ${dialect}, chosen word ${word.primaryText}`,
                );
            }}
        >
            <img src="/icons/speaker.svg" alt="speaker icon button" />
        </button>

        <button class="iconBtn">
            <img src="/icons/photo.svg" alt=" icon button" />
        </button>
    </div>
</div>

<div class="content">
    {#each word.descriptions as desc, idx}
        <div class="wordDesc">
            <h3>{idx + 1}. {desc}</h3>
        </div>
    {/each}

    <a href="/map/{word.primaryText}">
        <button class="semantic">
            <img src="/icons/map.svg" alt="" /> Semantics-Linked Words
        </button>
    </a>
</div>

<style>
    button {
        display: flex;
        align-items: center;
        font-size: large;

        width: fit-content;
    }

    button > img {
        height: 2rem;
        width: fit-content;
    }

    h1 {
        margin: 0;
    }
    .title {
        display: flex;
        flex-direction: column;

        gap: 0.5rem;
        align-items: start;

        padding: 0rem 2rem;

        flex-wrap: wrap;
    }

    .toolButtons {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        padding: 0rem 2rem 2rem 2rem;
    }
</style>
