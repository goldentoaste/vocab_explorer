import { AABB, Vector2 } from "$lib/components/graph/vector2";

const QT_CAP = 4;

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


