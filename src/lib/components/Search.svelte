<script lang="ts">
    interface Props {
        text?: string;
        autoCompleteProvider: (key: string) => string[];
        style?: string;
    }

    let { text = $bindable(""), autoCompleteProvider, style }: Props = $props();

    let completeOptions = $derived(autoCompleteProvider(text));
    let showingOptions = $derived(text.length > 0);

    function ItemSelected(key: string) {
        text = key;
    }
</script>

<div class="wrapper" class:displayContent={showingOptions} {style}>
    <input type="text" bind:value={text} />

    {#if showingOptions}
        <!-- content -->

        <div class="searchContent">
            {#if completeOptions.length === 0}
                <span class="noRes">No results found.</span>
            {/if}

            {#each completeOptions as item, index (item)}
                <button
                    class="searchItem"
                    onclick={() => {
                        ItemSelected(item);
                    }}
                >
                    {item}
                </button>
            {/each}
        </div>
    {/if}

    <img class="icon" src="/icons/search.svg" alt="" />
</div>

<style>
    .wrapper {
        width: auto;
        position: relative;

        background-color: var(--white);
        border: 2px solid var(--black);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
    }
    .wrapper.displayContent {
        border-radius: 10px 10px 0px 0px;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        outline: none;
        border: none;
        background-color: transparent;
        border-radius: 10px;
    }

    .searchContent {
        position: absolute;
        z-index: 1000;

        top: calc(100% + 2px);
        left: -2px;

        width: calc(100% + 4px);
        height: fit-content;

        display: flex;
        flex-direction: column;

        border: 2px solid;
        border-top: none;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
    }

    .searchItem {
        border: none;
        background-color: var(--white);
        border-bottom: 1px solid var(--black);
        display: flex;
        justify-content: flex-start;
        padding: 0.5rem;

        transition: filter 200ms ease-out;
    }

    .searchItem:hover {
        filter: brightness(0.96);
    }

    .searchItem:last-child {
        border: none;
    }

    .noRes {
        padding: 0.5rem;
    }

    .icon {
        width: 1rem;
        height: auto;
        margin-right: 0.5rem;
    }
</style>
