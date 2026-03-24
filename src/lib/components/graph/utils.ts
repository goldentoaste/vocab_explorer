import { createSubscriber } from "svelte/reactivity";

export class ManualReactiveMap<K, V> {
    _data: Map<K, V> = new Map<K, V>();
    #subscribe;
    #forceUpdate: (() => void) | undefined;

    constructor(map: Map<K,V>) {
        this._data = map;
        this.#subscribe = createSubscriber((update) => {
            this.#forceUpdate = update;
        });
    }

    get data() {
        this.#subscribe();
        return this._data;
    }

    update() {
        if (!this.#forceUpdate) {
            alert("not initialized");
            return;
        }

        this.#forceUpdate();
    }
}