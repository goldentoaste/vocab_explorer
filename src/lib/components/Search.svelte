<script lang="ts">
    interface Props {
        text?: string;
        autoCompleteProvider: (key: string) => string[];
        style?: string;
        onsubmit?: () => void;
        autoSubmit?: boolean;
    }

    let {
        text = $bindable(""),
        autoCompleteProvider,
        onsubmit = () => {},
        style,
        autoSubmit = true,
    }: Props = $props();

    let completeOptions = $derived(autoCompleteProvider(text));
    let focused = $state(false);
    let showingOptions = $derived(text.length > 0 && focused);
    let searchContent = $state<HTMLDivElement>();

    function ItemSelected(key: string) {
        text = key;
        focused = false;
        if (autoSubmit) {
            onsubmit();
        }
    }
</script>

<form
    class="wrapper"
    class:displayContent={showingOptions}
    {style}
    onsubmit={(e) => {
        e.preventDefault();
        onsubmit();
    }}
>
    <input
        placeholder="Search ..."
        type="search"
        bind:value={text}
        onsubmit={() => {
            onsubmit();
        }}
        onfocus={() => {
            focused = true;
        }}
        onfocusout={(e) => {
            if (searchContent && searchContent.contains(e.relatedTarget as Node)) {
                return;
            }
            focused = false;
        }}
    />

    {#if showingOptions}
        <div class="searchContent" bind:this={searchContent}>
            {#if completeOptions.length === 0}
                <span class="noRes">No results found.</span>
            {/if}

            {#each completeOptions as item (item)}
                <button
                    class="searchItem"
                    onclick={() => {
                        ItemSelected(item);
                        // console.log(item);
                    }}
                >
                    {item}
                </button>
            {/each}
        </div>
    {/if}

    <img class="icon" src="/icons/search.svg" alt="" />
</form>

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
