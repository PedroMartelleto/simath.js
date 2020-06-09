import CoordinateSystem from "../LinearAlgebra/CoordinateSystem";
import Vector from "../LinearAlgebra/Vector";
import Quadratic from "../Polynomials/Quadratic";
import { lusolve } from "mathjs";

export default class Conic {
    /**
     * The coefficients represent the equation below:
     *     ax^2 + bxy + cy^2 + dx + ey + f = 0.
     * 
     * Note that the coordinateSystem should be on a plane (2D).
     * 
     * @param {number} a 
     * @param {number} b 
     * @param {number} c 
     * @param {number} d 
     * @param {number} e 
     * @param {number} f 
     * @param {CoordinateSystem} coordinateSystem 
     */
    constructor(a, b, c, d, e, f, coordinateSystem) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.coordinateSystem = coordinateSystem;
    }

    /**
     * Expresses g(x, y) = 0 as f: R -> R^2, f(x) = y. Then, returns f(x).
     * @param {number} x
     * @returns {Vector}
     */
    eval(x) {
        const qA = 0;
        const qB = 0;
        const qC = 0;

        const roots = new Quadratic(qA, qB, qC).roots();
        return Vector.Vec2(roots[0], roots[1]);
    }

    eval(x, y) {
        return this.a * x**2 + this.b * x * y + this.c * y**2 + this.d * x + this.e * y + this.f;
    }

    /**
     * Eliminates, if possible, b, d and e by changing the coordinate system.
     */
    simplify() {
        const A = [[this.a, this.b/2], [this.b/2, this.c]];
        const b = [-this.d/2, -this.e/2];
        const solution = lusolve(A, b);

        const h = solution[0][0];
        const k = solution[1][0];

        this.translate(h, k);
        
        const theta = Math.atan(this.b / (this.a - this.c));

        this.rotate(theta);

        // TODO: This
        // this.coordinateSystem.translate(...);
        // this.coordinateSystem.rotate(...);
    }

    translate(h, k) {
        const d = 2 * this.a * h + this.b * k + this.d;
        const e = 2 * this.c * k + this.b * h + this.e;
        const f = this.eval(h, k);

        this.d = d;
        this.e = e;
        this.f = f;
    }

    rotate(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        const a = this.a * c**2 + this.b * s * c + this.c * s**2;
        const b = (this.c - this.a) * Math.sin(2 * theta) + this.b * Math.cos(2 * theta);
        const c = this.a * s**2 - this.b * s * c * this.c * c**2;
        const d = this.d * c + this.e * s;
        const e = -this.d * s + this.e * c;
        const f = this.f;

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    identify() {

    }

    focus() {

    }

    center() {

    }

    vertex() {

    }

    asymptotes() {

    }

    axis() {

    }

    /**
     * Finds new coefficients such that this conic is equivalent in the new coordinate system.
     * @param {CoordinateSystem} coordinateSystem 
     */
    /*
     TODO: Implement this
     changeCoordinateSystem(coordinateSystem) {
        // Let the current basis be E and the other basis be F.
        const E = this.coordinateSystem;
        const F = coordinateSystem;

        // This should be a 2x2 matrix
        const Mfe = F.matrixTo(E);
        const Mef = E.matrixTo(F);

        // a, b, c calculation

        // d, e calculation

        // f does not change

        this.coordinateSystem = coordinateSystem;
    }
    */


    // MARK: Cloning

    /**
     * Copies the given basis.
     * @param {ConicSection} other 
     */
    constructor(other) {
        this.a = other.a;
        this.b = other.b;
        this.c = other.c;
        this.d = other.d;
        this.e = other.e;
        this.f = other.f;
        this.coordinateSystem = other.coordinateSystem;
    }
    
    /**
     * Clones this.
     */
    clone() {
        return new Conic(this);
    }
}