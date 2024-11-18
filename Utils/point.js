/**
 * POINT class
 */
class Point {

    /**
     * Constructor of the class
     * @param {number} x coordiante on X axis
     * @param {number} y coordinate on Y axis
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    addX(offset){
        return new Point(this.x + offset, this.y);
    }

    addY(offset){
        return new Point(this.x, this.y + offset);
    }

    addOffset(oX, oY){
        return new Point(this.x + oX, this.y + oY);
    }

    /**
     * Checks if two points are equal or not
     * @param {Point} point an other Point to compare to
     * @returns {boolean} returns true if the points are on the same coordinates
     */
    isEqual(point){
        return this.x == point.x && this.y == point.y;
    }

    /**
     * A method for easier logging/printing by converting the Point to string
     * @returns {string} point converted to string
     */
    toString(){
        var res = "x: " + this.x + " , y: " + this.y + "\n";
        return res;
    }
}