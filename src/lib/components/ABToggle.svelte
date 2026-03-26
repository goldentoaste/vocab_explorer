<script lang="ts">
    interface Props {
        A: string;
        B: string;
        value: string;
    }

    let { A, B, value = $bindable() }: Props = $props();
</script>

<div class="container">
    <button
        class:selected={value === A}
        class="btn A"
        onclick={() => {
            value = A;
        }}
    >
        {A}
    </button>
    <button
        class:selected={value === B}
        class="btn B"
        onclick={() => {
            value = B;
        }}>{B}</button
    >
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        width: fit-content;
        min-width: 150px;

        border-radius: 5px;
        border: 1px solid var(--black);

        overflow: hidden;
    }

    .btn {
        flex: 1;
        padding: 0.25rem;

        color: var(--black);
        background-color: var(--white);

        border: none;

        transition: all ease-out 200ms;
    }

    .A {
        border-right: 1px solid var(--black);
    }

    .selected {
        color: var(--white);
        background-color: var(--black);
    }
</style>
