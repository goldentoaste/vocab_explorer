<script lang="ts">
    import { CreeDialects, UserPref } from "$lib/assets/shared_states/userPref.svelte";
    import ABToggle from "$lib/components/ABToggle.svelte";
    import Toggle from "$lib/components/Toggle.svelte";

    // Code
</script>

<div class="container">
    <h1 class="title">User Preference</h1>

    <div>
        <label for="">Display Format</label>
        <ABToggle A={"SRO"} B={"Syllabics"} bind:value={UserPref.format} />
    </div>

    <div>
        <label for="">Long Vowel</label>
        <ABToggle A={"Circumflex"} B={"Macron"} bind:value={UserPref.longVowelRep} />
    </div>

    <div>
        <Toggle label="Use Dialect Marker" bind:checked={UserPref.useDialectMarker} />
    </div>

    <div>
        <label for="dialectSelector">Default dialect</label>
        <select id="dialectSelector" name="Dialect Switcher" bind:value={UserPref.dialect}>
            {#each CreeDialects as d}
                <option> {d}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;

        padding: 2rem;
        padding-top: 0;
    }
</style>
