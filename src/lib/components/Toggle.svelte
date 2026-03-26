<script lang="ts">
    interface Props {
        label: string;
        checked: boolean;
    }

    let { label, checked = $bindable() }: Props = $props();
</script>

<div class="container">
    <label for="check">{label}</label>
    <input id="check" type="checkbox" bind:checked class:active={checked} />
</div>

<style>
    .container {
        display: flex;
        gap: 2rem;
    }

    input#check {
        width: 2rem;
        height: 1rem;

        appearance: none;
        position: relative;

        border: 1px solid var(--black);
        border-radius: 5px;

        background-color: var(--white);

        transition: background-color 200ms ease-out;
    }

    #check::after {
        content: "";
        position: absolute;

        width: calc(0.75rem);
        height: calc(100% - 4px);

        top: 2px;
        left: 2px;

        border-radius: 5px;
        border: 1px solid var(--black);
        background-color: var(--black);

        transition: left 200ms ease-out;
    }

    #check.active::after {
        left: calc(100% - 1rem - 2px);
        background-color: var(--white);
    }

    #check.active {
        background-color: var(--black);
    }
</style>
