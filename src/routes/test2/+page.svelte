<script lang="ts">
    let width = $state(0);
    let content = $state<HTMLDivElement>();
</script>

<span>Width is: {width}</span>

<h1 bind:clientWidth={width} bind:this={content}>STUFF STUFF</h1>

<style>
    /* CSS */
</style>
