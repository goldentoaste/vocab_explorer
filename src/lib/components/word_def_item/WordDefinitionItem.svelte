<script lang="ts">
    export interface WordDef {
        primaryText: string;
        alterativeText: string;
        wordType: "None" | "Verb";

        descriptions: string[];
        alternativeDescription: string[];

        detailWord_Ling: string;
        morphs: { description: string; word: string }[];
        alternativeMorphs: { description: string; word: string }[];

        audioKey?: string;
        imageSrc?: string[];
    }

    interface Props {
        index: number;
        definition: WordDef;
        useDefault?: boolean;
    }

    let { definition, useDefault = true, index }: Props = $props();

    let showDetail = $state(false);
</script>

<div class="container">
    <div class="hor">
        <div class="ver">
            <div class="hor">
                <!-- title -->
                <span>
                    {index}.
                </span>

                <span>
                    {#if useDefault}
                        {definition.primaryText}
                    {:else}
                        {definition.alterativeText}
                    {/if}
                </span>

                <span>
                    [{definition.wordType}]
                </span>
                <!-- end title row -->
            </div>

            <div class="ver description">
                <!-- description -->
                <ul>
                    {#if useDefault}
                        {#each definition.descriptions as desc}
                            <li>{desc}</li>
                        {/each}
                    {:else}
                        {#each definition.alternativeDescription as desc}
                            <li>{desc}</li>
                        {/each}
                    {/if}
                </ul>
                <!-- end description -->
            </div>

            <button class="semantic">
                <img src="/icons/map.svg" alt="" /> Semantics
            </button>
        </div>

        <div class="ver sideBtns">
            <!-- side buttons -->
            <button class="iconBtn">
                <img src="/icons/speaker.svg" alt="speaker icon button" />
            </button>
            <button class="iconBtn">
                <img src="/icons/photo.svg" alt=" icon button" />
            </button>
            <button class="iconBtn">
                <img src="/icons/plus.svg" alt="press to show more info" />
            </button>
            <!-- end side buttons -->
        </div>
    </div>

    <div class="detailContainer">
        <div class="detailContent"></div>
    </div>
</div>

<style>
    .container {
        padding: 0.75rem;
        border: 2px solid var(--black);
        border-radius: 6px;

        max-width: 350px;
    }

    .sideBtns {
        margin-left: auto;
        gap: 0.25rem;
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
