export class Vector2 {

    x: number;
    y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static of(x: number, y: number) {
        return new Vector2(x, y);
    }

    /**
     * returns the mid point between the 2 vectors.
     * Same as lerp(v1, v2, 0.5);
     * @param v1
     * @param v2
     * @returns
     */
    static midPoint(v1: Vector2, v2: Vector2) {
        return new Vector2(
            (v1.x + v2.x) / 2,
            (v1.y + v2.y) / 2
        )
    }

    static get ZERO() {
        return new Vector2(0, 0);
    }

    static get ONE() {
        return new Vector2(1, 1);
    }

    static get UNIT_X() {
        return new Vector2(1, 0);
    }

    static get UNIT_Y() {
        return new Vector2(0, 1);
    }

    toArr() {
        return [this.x, this.y];
    }

    toObj() {
        return {
            x: this.x,
            y: this.y
        }
    }

    static fromArr(arr: [number, number]) {
        return new Vector2(arr[0], arr[1]);
    }

    /**
     * add piece-wise
     * @param x
     * @param y
     */
    addp(x: number, y: number) {
        return new Vector2(this.x + x, this.y + y);
    }

    add(other: Vector2) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /**
     * add in place
     * @param other
     * @returns
     */
    addi(other: Vector2) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * add in place, piece-wise
     * @param x
     * @param y
     */
    addip(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    sub(other: Vector2) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    subp(x: number, y: number) {
        return new Vector2(this.x - x, this.y - y);
    }

    subi(other: Vector2) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    mul(factor: number) {
        return new Vector2(this.x * factor, this.y * factor);
    }

    muli(factor: number) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    div(quotient: number) {
        return new Vector2(this.x / quotient, this.y / quotient);
    }

    divi(quotient: number) {
        this.x /= quotient;
        this.y /= quotient;
        return this;
    }

    mag() {
        return Math.hypot(this.x, this.y);
    }

    dot(other: Vector2) {
        return this.x * other.x + this.y * other.y;
    }

    distTo(other: Vector2) {
        return other.sub(this).mag();
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    normalized() {
        const m = this.mag();
        if (m === 0) {
            return Vector2.ZERO;
        }
        return new Vector2(this.x / m, this.y / m);
    }

    /**
     * normalize in place
     */
    normalize() {
        const m = this.mag();

        if (m === 0) {
            this.x = 0;
            this.y = 0;
            return this;
        }

        this.x = this.x / m;
        this.y = this.y / m;
        return this;
    }

    clampMagnitude(maxMag: number) {
        const m = this.mag();
        if (m < maxMag) {
            return this;
        }
        return this.normalize().muli(maxMag);
    }

    /**
     * upper left and right quadrant are -negative, lower left and right are +positive.
     * @returns angle relative to positive X axis
     */
    angle() {
        return Math.atan2(this.y, this.x) * (180 / Math.PI);
    }

    toString() {
        return `Vector2(${this.x}, ${this.y})`
    }
}


export class AABB {
    topleft: Vector2;
    botright: Vector2;

    constructor(topleft: Vector2, botright: Vector2) {
        this.topleft = topleft;
        this.botright = botright;
    }

    static fromPosSize(x: number, y: number, w: number, h: number) {
        return new AABB(
            new Vector2(x, y,),
            new Vector2(x + w, y + h)
        )
    }

    get topright() {
        return new Vector2(this.botright.x, this.topleft.y);
    }

    get botleft() {
        return new Vector2(this.topleft.x, this.botright.y);
    }

    toString() {
        return `AABB(${this.topleft.toString()}, ${this.botright.toString()})`
    }

    /**
     * checks if a point is within this AABB (inclusive)
     * @param point
     * @returns
     */
    containsPoint(point: Vector2) {
        return (point.x >= this.topleft.x && point.y >= this.topleft.y && point.x <= this.botright.x && point.y <= this.botright.y);
    }

    /**
     * checks if this AABB fully contains the provide aabb. (inclusive)
     * @param aabb
     */
    containsAABB(aabb: AABB | undefined) {
        if (!aabb) {
            return false;
        }

        const a = this;
        const b = aabb;

        return (
            b.left - a.right < 0 &&
            a.left - b.right < 0 &&
            b.top - a.bot < 0 &&
            a.top - b.bot < 0
        )
    }

    cornerContains(aabb: AABB | undefined) {
        if (!aabb) {
            return false;
        }
        return this.containsPoint(aabb.topleft) || this.containsPoint(aabb.botright) || this.containsPoint(aabb.botleft) || this.containsPoint(aabb.topright);
    }

    collidingWith(aabb: AABB) {
        // if the other rect is not entirely above, below, left, or right, then these two must be colliding
        return !(
            aabb.right < this.left || // other is to the left
            aabb.left > this.right || // other is to the right
            aabb.top > this.bot || // other is below
            aabb.bot < this.top // other is above
        );
    }

    nudgeTopLeft(diff: Vector2) {
        this.topleft.addi(diff);
    }
    nudgeTopLeftp(x: number, y: number) {
        this.topleft.addip(x, y);
    }

    nudgeBotRight(diff: Vector2) {
        this.botright.addi(diff);
    }
    nudgeBotRightp(x: number, y: number) {
        this.botright.addip(x, y);
    }

    shift(x: number, y: number) {
        this.topleft.addip(x, y);
        this.botright.addip(x, y);
        return this;
    }


    /**
     * expand this AABB inplace to contain the given point
     * @param point
     */
    expandToContain(point: Vector2) {
        this.topleft.x = Math.min(point.x, this.topleft.x);
        this.topleft.y = Math.min(point.y, this.topleft.y);
        this.botright.x = Math.max(point.x, this.botright.x);
        this.botright.y = Math.max(point.y, this.botright.y);
    }

    get x() {
        return this.topleft.x;
    }

    get y() {
        return this.topleft.y;
    }

    get width() {
        return this.botright.x - this.topleft.x;
    }

    get height() {
        return this.botright.y - this.topleft.y;
    }

    get left() {
        return this.topleft.x;
    }

    get right() {
        return this.botright.x;
    }

    get top() {
        return this.topleft.y;
    }

    get bot() {
        return this.botright.y;
    }

    get center() {
        return this.topleft.add(this.botright).divi(2);
    }

}
