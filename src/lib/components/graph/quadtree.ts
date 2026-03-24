import { AABB, Vector2 } from "$lib/components/graph/vector2";

const QT_CAP = 4;

const THETA = 0;

export class BarnesHutQuadTree {
    /**
     * In Barnes-Hut, a region can only contain or not contain a point.
     * If a region needs to have more than 1 point, split it.
     *
     * https://arborjs.org/docs/barnes-hut
     * https://jheer.github.io/barnes-hut/
     */
    boundary: AABB;
    point?: Vector2;

    totalMass: number;
    centerOfMass: Vector2;

    NW?: BarnesHutQuadTree;
    NE?: BarnesHutQuadTree;
    SW?: BarnesHutQuadTree;
    SE?: BarnesHutQuadTree;

    constructor(boundary: AABB) {
        this.boundary = boundary;
        this.totalMass = 0;
        this.centerOfMass = boundary.center;
    }

    static default() {
        return new BarnesHutQuadTree(new AABB(Vector2.of(-5000, -5000), Vector2.of(5000, 5000)));
    }


    simulate(body: Vector2, callback: (centerOfMass: Vector2, mass: number) => void) {
        // external node
        if (this.point) {
            if (this.point.eq(body)) {
                return; // same body, no work needed
            }

            callback(this.point, 1);
            return;
        }

        const sdRatio = this.boundary.width / (this.centerOfMass.distTo(body));

        if (sdRatio < THETA) {
            return callback(this.centerOfMass, this.totalMass);
        }

        if (this.NE) {
            this.NW!.simulate(body, callback);
            this.NE!.simulate(body, callback);
            this.SW!.simulate(body, callback);
            this.SE!.simulate(body, callback);
        }
    }

    subdivide() {
        const center = this.boundary.center;
        const boundary = this.boundary;
        this.NW = new BarnesHutQuadTree(new AABB(boundary.topleft.clone(), center.clone()));
        this.NE = new BarnesHutQuadTree(new AABB(Vector2.of(center.x, boundary.top), Vector2.of(boundary.right, center.y)));
        this.SW = new BarnesHutQuadTree(new AABB(Vector2.of(boundary.left, center.y), Vector2.of(center.x, boundary.bot)));
        this.SE = new BarnesHutQuadTree(new AABB(center.clone(), boundary.botright.clone()));
    }

    insert(p: Vector2) {
        if (!this.boundary.containsPoint(p) || (this.point && this.point.eq(p))) {
            return false;
        }


        // no body and internal
        if (!this.point && !this.NE) {
            this.point = p;
            this.totalMass = 1;
            this.centerOfMass = p.clone();
            return true;
        }

        // internal with children
        if (!this.point) {
            // update center of mass
            this.centerOfMass = this.centerOfMass.mul(this.totalMass).addi(p).divi(this.totalMass + 1);
            this.totalMass += 1;

            // recursively insert the actual point to children
            if (this.NE!.insert(p)) return true;
            if (this.NW!.insert(p)) return true;
            if (this.SE!.insert(p)) return true;
            if (this.SW!.insert(p)) return true;
        }

        // external node. Has a point => no children.
        if (this.point && !this.NE) {
            this.subdivide();

            this.centerOfMass = this.centerOfMass.mul(this.totalMass).addi(p).divi(this.totalMass + 1);
            this.totalMass += 1;

            // use short circuiting, the first success stops evaluation.
            this.NE!.insert(p) ||
                this.NW!.insert(p) ||
                this.SE!.insert(p) ||
                this.SW!.insert(p);

            this.NE!.insert(this.point) ||
                this.NW!.insert(this.point) ||
                this.SE!.insert(this.point) ||
                this.SW!.insert(this.point);

            this.point = undefined;
            return true;
        }

        throw Error(`This should never happen. Point ${this.point}, AABB: ${this.boundary}, NE: ${this.NE}`);

    }
}

class QuadTree {
    // https://en.wikipedia.org/wiki/Quadtree

    boundary: AABB;
    points: Vector2[] = [];


    NW?: QuadTree;
    NE?: QuadTree;
    SW?: QuadTree;
    SE?: QuadTree;


    constructor(boundary: AABB) {
        this.boundary = boundary;
    }

    static default() {
        return new QuadTree(new AABB(Vector2.of(-5000, -5000), Vector2.of(5000, 5000)));
    }


    subdivide() {
        const center = this.boundary.center;
        const boundary = this.boundary;
        this.NW = new QuadTree(new AABB(boundary.topleft.clone(), center.clone()));
        this.NE = new QuadTree(new AABB(Vector2.of(center.x, boundary.top), Vector2.of(boundary.right, center.y)));
        this.SW = new QuadTree(new AABB(Vector2.of(boundary.left, center.y), Vector2.of(center.x, boundary.bot)));
        this.SE = new QuadTree(new AABB(center.clone(), boundary.botright.clone()));

        for (const p of this.points) {
            if (this.NE.insert(p)) continue;
            if (this.NW.insert(p)) continue;
            if (this.SE.insert(p)) continue;
            if (this.SW.insert(p)) continue;
        }
        this.points.length = 0;
    }

    insert(p: Vector2) {
        if (!this.boundary.containsPoint(p)) {
            return false;
        }

        if (this.points.length <= QT_CAP && this.NE === undefined) {
            this.points.push(p);
            return true;
        }

        if (this.NE === undefined) {
            this.subdivide();
        }

        if (this.NE!.insert(p)) return true;
        if (this.NW!.insert(p)) return true;
        if (this.SE!.insert(p)) return true;
        if (this.SW!.insert(p)) return true;


        // oh no! bug!
        return false;
    }

    rangeQuery(range: AABB) {
        const out: Vector2[] = [];

        if (!this.boundary.collidingWith(range)) {
            return out;
        }

        if (!this.NE) {
            out.push(...this.points);
            return out;
        }

        out.push(...this.NW?.rangeQuery(range)!);
        out.push(...this.NE?.rangeQuery(range)!);
        out.push(...this.SE?.rangeQuery(range)!);
        out.push(...this.SW?.rangeQuery(range)!);

        return out;
    }

}


