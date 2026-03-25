// read this: https://arborjs.org/docs/barnes-hut

import { BarnesHutQuadTree } from "$lib/components/graph/quadtree";
import { Vector2 } from "$lib/components/graph/vector2";
const SPRING = 0.2;
const TARGET_DIST = 0; // length of spring connecting two sim objs.
const REULSION_FORCE = 600000; // coefficient to Coulomb's Law
const DAMP = 0.9; // dampening factor, amount to reduce forces by each frame.


export class SimObj {
    id: string;

    pos: Vector2;
    vel: Vector2;

    radius: number; // pretend each obj is spherical for simplicity.
    originalRad : number;
    mass: number;

    static: boolean = false;

    constructor(pos: Vector2, vel: Vector2, radius: number, id: string, mass: number) {
        this.originalRad = radius;
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
        this.id = id;
        this.mass = mass;
    }

}

/**
 * Applys force to o1 only, calculations done from o1's perspective.
 * @param o1
 * @param o2
 * @param dt a fraction of a second
 */
function applySpringForce(o1: SimObj, o2: SimObj, dt: number) {
    // hooks law.
    // F_s = k * x
    // x = distance spring is away from neutral. Positive when stretched, negative when compressed
    // k = spring coefficient.
    // spring force scales linearly with distance away from neutral.

    const p1 = o1.pos;
    const p2 = o2.pos;

    const dp = p2.sub(p1);
    const dir = dp.normalized();
    const dist = dp.mag() - (TARGET_DIST + o1.radius + o2.radius); //
    const change = dir.mul(SPRING * dist * dt)

    o1.vel.addi(change);
    o2.vel.subi(change);
}


/**
 * Applies forces to o1 only.
 */

function applyRepulsiveForce(o1: SimObj, o2: SimObj, dt: number) {
    /**
     * Coulomb's law.
     * F = (constant * charge1 * charge2) * (1 / dist^2)
     * Here we assume charge1 = charge2 = 1, ie all objects repulse each other equally.
     * the repulsive constant is determined empirically (ie, vibe based).
     */
    const p1 = o1.pos;
    const p2 = o2.pos;
    const dp = p2.sub(p1);

    const dir = dp.normalized();
    const dist = dp.mag() + 0.01; // avoid div/0
    const change = dir.mul((-(REULSION_FORCE * o1.mass * o2.mass) / (dist * dist) + 5.5) * dt).clampMagnitude(4); // apply a hard coded attractive force.

    o1.vel.addi(change);
}

/**
 *
 * @param objMap
 * @param objConnections spring connections, rep as a digraph.
 */
export function simulate(objMap: Map<string, SimObj>, objConnections: Map<string, string[]>, dt: number) {

    // apply spring force O(E) pray is there isn't too many connections
    for (const [key, connections] of objConnections.entries()) {
        const o1 = objMap.get(key);

        for (const con of connections) {
            const o2 = objMap.get(con);

            if (!(o1 && o2)) {
                console.log(`Invalid mappings ${o1?.id} ${o2?.id}`);
                continue;
            }

            applySpringForce(o1, o2, dt);
        }
    }



    // barnes-hut for repulsive sim. O(n*Log(n)) to avoid N+1
    // step 1, build barnes-hut tree
    const root = BarnesHutQuadTree.default();

    for (const o of objMap.values()) {
        root.insert(o.pos);
    }

    // step 2 run the simulate and apply force.
    for (const o of objMap.values()) {

        root.simulate(o.pos, (center, mass) => {
            const otherObj = new SimObj(center, Vector2.ONE, 0, "", mass);
            applyRepulsiveForce(o, otherObj, dt);
        });
    }
}


export function updateObjs(objMap: Map<string, SimObj>) {
    let movement = 0;
    for (const o of objMap.values()) {
        if (o.static) {
            o.vel = Vector2.ZERO;
        }

        o.vel.muli(DAMP);
        o.pos.addi(o.vel);

        movement += o.vel.mag();
    }

    return movement;
}