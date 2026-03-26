<script lang="ts" module>
</script>

<script lang="ts">
    import { SimObj } from "$lib/components/graph/simulations.svelte";
    import { Vector2 } from "$lib/components/graph/vector2";
    import { untrack } from "svelte";

    import type { PageProps } from "./$types";

    import { GraphController } from "$lib/components/graph/controller.svelte";
    import { CreeWordConnections } from "$lib/assets/content/wordConnections";
    import { creeWords } from "$lib/assets/content/itwewinaScrapedDictionary";

    let { params, data }: PageProps = $props();

    let container = $state<HTMLElement>();
    let controller = new GraphController();

    $effect(() => {
        if (container !== undefined) {
            controller.init(container!);

            const wordObjMap: Record<string, SimObj> = {};

            let queue = [data.creeWord.primaryText];
            wordObjMap[data.creeWord.primaryText] = new SimObj(
                Vector2.ZERO,
                Vector2.ZERO,
                50,
                params.word,
                1,
            );
            untrack(() => {
                controller.insertItem(wordObjMap[data.creeWord.primaryText]);
            });

            let degreeOfSep = 2; // read branches 2 layers deep.
            while (queue.length > 0 && degreeOfSep > 0) {
                const copy = [...queue];
                queue = [];

                for (const wordId of copy) {
                    const rootObj = wordObjMap[wordId];
                    for (const connection of CreeWordConnections[rootObj.id] ?? []) {
                        if (!(connection in wordObjMap)) {
                            wordObjMap[connection] = new SimObj(
                                Vector2.ZERO,
                                Vector2.ZERO,
                                50,
                                connection,
                                1,
                            );
                        }
                        untrack(() => {
                            controller.insertItem(wordObjMap[connection], rootObj);
                        });
                        queue.push(connection);
                    }
                }
                degreeOfSep -= 1;
            }

            controller.start();
        }

        return () => {
            controller.stop();
        };
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="container"
    bind:this={container}
    style="background-position: {-controller.camera.x}px {-controller.camera.y}px;"
>
    {#if controller}
        {@const cam = controller.camera}

        <span class="locationLabel"
            >({controller.camera.x.toFixed(0)}, {controller.camera.y.toFixed(0)}, Pause: {controller.pauseSim},
            α: {controller.alpha.toFixed(5)})</span
        >

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
            {@const word = creeWords[id] || { descriptions: [], primaryText: "Missing lol" }}
            <div {id} class="square" style="--x: {item.x - cam.x}px; --y: {item.y - cam.y}px;">
                <span class="primary" draggable="false">
                    {word.primaryText}
                </span>

                <span class="secondary" draggable="false">
                    {word.descriptions[0] ?? ""}
                </span>

                <div class="desc" draggable="false">
                    {#each word.descriptions as desc}
                        <span class="secondary">
                            {desc}
                        </span>
                    {/each}
                </div>
                <a href="/def/{id}" draggable="false">
                    <button>Read More</button>
                </a>
            </div>
        {/each}
    {/if}
</div>

<style>
    .locationLabel {
        position: absolute;
        left: 2rem;
        top: 2rem;

        opacity: 0.2;
        font-size: small;
        user-select: none;
        pointer-events: none;
    }

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
        height: auto;
        flex: 1;

        overflow: hidden;
        position: relative;
        /* important! touch-action:none; disable browser's default touch handling. */
        touch-action: none;

        background-size: 50px 50px;
        background-image: linear-gradient(to right, rgba(128, 128, 128, 0.326) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.329) 1px, transparent 1px);
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

        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .primary {
        }

        .secondary {
            font-weight: lighter;
            font-size: small;
        }

        .desc {
            font-weight: lighter;
            font-size: small;
            padding: 0.25rem;
            border-top: 1px solid var(--black);
            display: none;
        }

        a {
            display: none;
            pointer-events: all;
            align-self: flex-end;
        }
    }

    .square > * {
        user-select: none;
        pointer-events: none;
    }

    .square:hover {
        z-index: 11;

        .desc {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        a {
            display: block;
        }
    }
</style>
