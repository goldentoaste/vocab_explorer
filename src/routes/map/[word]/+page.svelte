<script lang="ts" module>
    export interface WordConnection {
        primaryText: string;
        secondaryText: string;

        description: string[];

        connections: WordConnection[];
    }

    type WordGraphDesc = Omit<WordConnection, "connections">;
</script>

<script lang="ts">
    import { dummyCreeData } from "$lib/assets/content/dummyData";
    import { SimObj, simulate } from "$lib/components/graph/simulations.svelte";
    import { Vector2 } from "$lib/components/graph/vector2";
    import { onDestroy, onMount, untrack } from "svelte";

    import type { PageProps } from "./$types";
    import { ManualReactiveMap } from "$lib/components/graph/utils";
    import { GraphController } from "$lib/components/graph/controller.svelte";

    let { params }: PageProps = $props();

    const data = dummyCreeData;

    const connections = new Map([
        ["1", ["2", "3"]],
        ["3", ["4"]],
    ]);

    let container = $state<HTMLElement>();
    let controller = new GraphController();

    $effect(() => {
        if (container !== undefined) {
            // debug
            const a = new SimObj(Vector2.ZERO, Vector2.ZERO, 50, "1", 1);
            const b = new SimObj(Vector2.ZERO, Vector2.ZERO, 50, "2", 1);
            const c = new SimObj(Vector2.ZERO, Vector2.ZERO, 50, "3", 1);
            const d = new SimObj(Vector2.ZERO, Vector2.ZERO, 50, "4", 1);
            const e = new SimObj(Vector2.ZERO, Vector2.ZERO, 50, "5", 1);

            untrack(() => {
                controller.init(container!);
                controller.insertItem(a);
                controller.insertItem(b, a);
                controller.insertItem(c, a);
                controller.insertItem(d, a);
                controller.insertItem(e, d);

                controller.insertItem(b, c);

                controller.start();
            });
        }

        return () => {
            controller.stop();
        };
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="container" bind:this={container}>
    {#if controller}
        {@const cam = controller.camera}
        {#each Object.entries(controller.lines) as [id, line] (id)}
            <div
                class="line"
                style="--x: {line.x - cam.x}px;
                --y:{line.y - cam.y}px;
                --dist: {line.length}px;
                --angle: {line.angle}deg;
                "
            ></div>
        {/each}

        {#each Object.entries(controller.items) as [id, item] (id)}
            <div {id} class="square" style="--x: {item.x - cam.x}px; --y: {item.y - cam.y}px;">
                Some testing text
            </div>
        {/each}
    {/if}
</div>

<style>
    .line {
        background-color: var(--black);

        height: 2px;
        width: var(--dist);
        transform-origin: top left;

        translate: var(--x) var(--y);
        rotate: var(--angle);

        position: absolute;
        left: 0%;
        top: 0%;

        z-index: 5;
        pointer-events: none;
    }

    .container {
        width: 100%;
        height: 100%;

        border: 2px solid red;

        overflow: hidden;
        position: relative;
        /* important! touch-action:none; disable browser's default touch handling. */
        touch-action: none;
    }
    .square {
        position: absolute;
        transform-origin: center;
        transform: translate(var(--x), var(--y)) translate(-50%, -50%);

        left: 0;
        top: 0;
        min-width: 50px;
        max-width: 200px;
        min-height: 2rem;
        background-color: var(--white);

        user-select: none;
        z-index: 10;

        color: var(--black);
        border: 2px solid var(--black);
        border-radius: 5px;
        padding: 0.5rem;
    }

    .square:hover::after {
        content: "abc adada dasd asd asfewoifodj asod ";
        z-index: 11;
    }
</style>
