import { simulate, updateObjs, type SimObj } from "$lib/components/graph/simulations.svelte";
import { Vector2 } from "$lib/components/graph/vector2";

type Items = Record<string, { x: number, y: number }>;
type Lines = Record<string, { x: number, y: number, angle: number, length: number }>
export class GraphController {

    container?: HTMLElement;

    objs: Map<string, SimObj> = new Map();
    connections: Map<string, string[]> = new Map();

    focusedItem?: SimObj;
    hoveredItem?: SimObj;
    hoveredElement?: HTMLElement;

    items = $state.raw<Items>({});
    lines = $state.raw<Lines>({});

    lastFrame = 0;
    deltaTime = 0;
    animationId = -1;

    physicsFps = 60;
    physicsDT = 1 / this.physicsFps;

    camera = $state({ x: 0, y: 0 });

    get cameraCenter() {
        return Vector2.of(this.camera.x + this.width / 2, this.camera.y + this.height / 2);
    }


    width = 0;
    height = 0;
    resizeObserver?: ResizeObserver;

    mutationObserver?: MutationObserver;

    pauseSim = false;
    startingFrame = -1;

    constructor() {

    }

    start() {
        if (this.animationId != -1) {
            this.stop();
            this.start();
        }

        this.animationId = requestAnimationFrame(this.update.bind(this));
        this.startingFrame = -1;
    }

    init(container: HTMLElement) {
        this.container = container;
        const rect = container.getBoundingClientRect();

        this.width = rect.width;
        this.height = rect.height;

        this.camera.x = -rect.width / 2;
        this.camera.y = -rect.height / 2;

        this.resizeObserver = new ResizeObserver((e) => {
            const element = e[0];
            this.width = element.contentBoxSize[0].inlineSize;
            this.height = element.contentBoxSize[0].blockSize;
        });
        this.resizeObserver.observe(this.container);

        this.initEvents();
    }

    stop() {
        if (this.animationId != -1) {
            cancelAnimationFrame(this.animationId);
            this.animationId = -1;
        }

        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        this.container = undefined;
    }


    lastPoint = Vector2.ONE;


    setHover(element: HTMLElement) {
        if (this.hoveredElement) {
            this.clearHover();
        }

        const obj = this.objs.get(element.id);
        if (obj) {
            this.hoveredItem = obj;
            this.hoveredElement = element;

            const rect = element.getBoundingClientRect();
            obj.radius = (rect.width + rect.height) / 3;
            this.pauseSim = false;
        }
    }

    clearHover() {
        if (!this.hoveredElement || !this.hoveredItem) {
            return;
        }
        this.hoveredElement = undefined;
        this.hoveredItem.radius = this.hoveredItem.originalRad;
        this.hoveredItem = undefined;
        this.pauseSim = false;
    }



    initEvents() {
        this.container?.addEventListener("pointerdown", (e) => {
            this.lastPoint = Vector2.of(e.screenX, e.screenY);
            if (e.target == this.container) {
                this.clearHover();
                return;
            }

            const element = e.target as HTMLElement;
            const obj = this.objs.get(element.id);

            if (obj) {
                this.setHover(element);
                this.focusedItem = obj;
                obj.static = true;
            }
        })


        this.container?.addEventListener("pointermove", (e) => {

            const current = Vector2.of(e.screenX, e.screenY);
            const dx = current.x - this.lastPoint.x;
            const dy = current.y - this.lastPoint.y;

            if (e.buttons != 1) {

                if (e.buttons === 0 && e.target !== this.container) {
                    const element = e.target as HTMLElement;
                    this.setHover(element);
                }
                return;
            }

            if (!this.focusedItem) {
                this.camera.x -= dx;
                this.camera.y -= dy;
            } else {
                this.focusedItem.pos.addip(dx, dy);
                this.pauseSim = false; // important!
            }

            this.lastPoint = current;
        });

        this.container?.addEventListener("pointerup", (e) => {
            if (this.focusedItem) {
                this.focusedItem.static = false;
                this.focusedItem = undefined;
            }
            this.lastPoint = Vector2.ZERO;
        })
    }

    update(t: number) {
        if (this.startingFrame = -1) {
            this.startingFrame = t;
        }

        this.deltaTime = (t - this.lastFrame) / 1000;

        if (this.deltaTime > this.physicsDT * 3 || this.pauseSim) {
            // we are cooked, skip this frame.
            this.lastFrame = t;
            return this.animationId = requestAnimationFrame(this.update.bind(this));

        }

        // simulate physics at a lower fps, and skip the update if we are dropping frames.
        if (this.deltaTime > this.physicsDT) {
            simulate(this.objs, this.connections, this.deltaTime);
            this.lastFrame = t;
        }

        // always update positions each frame
        const movement = updateObjs(this.objs);

        // pause the sim when it reach equilibrium
        if (movement < 0.2 && (t - this.startingFrame) > 2000) {
            this.pauseSim = true;
        }

        this.render();

        this.animationId = requestAnimationFrame(this.update.bind(this));
    }

    render() {
        const items: Items = {};
        const lines: Lines = {};

        for (const [id, obj] of this.objs) {
            items[id] = obj.pos.toObj();
        }

        for (const [idA, cons] of this.connections) {
            const A = this.objs.get(idA);

            if (!A) {
                continue;
            }

            for (const idB of cons) {
                const B = this.objs.get(idB);
                if (!B) {
                    continue;
                }

                const diff = B.pos.sub(A.pos);
                const dist = diff.mag();
                const angle = diff.angle();

                lines[`${idA}-${idB}`] = {
                    ...A.pos.toObj(),
                    angle,
                    length: dist
                };
            }
        }

        this.items = items;
        this.lines = lines;

    }

    insertItem(obj: SimObj, parent?: SimObj) {
        if (this.objs.has(obj.id)) {
            console.log(`Id conflict : ${obj.id}. Ignoring the entry.`, this.objs);
        } else {


            this.objs.set(obj.id, obj);

            let origin = parent ? parent.pos : this.cameraCenter;
            origin = origin.addp(
                (this.width / 3) * (Math.random() - 0.5),
                (this.height / 3) * (Math.random() - 0.5),
            );

            obj.pos = origin;
        }


        if (parent) {
            if (this.connections.get(obj.id)?.includes(parent.id)) {
                console.log(`Connection already exists between ${obj.id} and ${parent.id}. Ignoring the entry.`);
                return;
            }

            if (!this.objs.has(parent.id)) {
                console.log(`Parent id not in collection: ${parent.id}. Ignoring the entry.`);
                return;
            }

            const cons = this.connections.get(parent.id);
            if (!cons) {
                this.connections.set(parent.id, [obj.id]);
            } else {
                cons.push(obj.id);
            }
        }
    }
}