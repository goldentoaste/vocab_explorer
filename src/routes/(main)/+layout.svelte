<script lang="ts">
    import Topbar from '$lib/components/Topbar.svelte';

	
	const {children} = $props();
</script>

<Topbar/>
{@render children()}


