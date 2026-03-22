<script lang="ts">
    export interface NavItem {
        name: string;
        target: string;
        src: string;
    }

    interface Props {
        navItems: NavItem[];
    }

    let { navItems }: Props = $props();
</script>

<nav>
    {#each navItems as item, index (item.target)}
        <a href={item.target} class="navLink">
            {#if item.src}
                <img src={item.src} alt="" />
            {/if}

            <span>{item.name}</span>
        </a>
    {/each}
</nav>

<style>
    nav {
        pointer-events: all;

        display: flex;
        justify-content: space-around;
        align-items: center;

        position: absolute;
        bottom: 0rem;
        left: 0;

        width: 100%;
        padding: 0.25rem;

        border-top: 2px solid var(--black);
        background-color: var(--white);
    }

    a.navLink {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        text-decoration: none;
        color: var(--black);

        border: 2px solid transparent;
        padding: 0.5rem;
        transition: border-color 200ms ease-out;
    }

    a.navLink:hover {
        border-color: var(--black);
    }

    a > img {
        width: auto;
        height: 2rem;
    }
</style>
