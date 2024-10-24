class Point {
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

    isEqual(point){
        return this.x == point.x && this.y == point.y;
    }

    toString(){
        var res = "x: " + this.x + " , y: " + this.y + "\n";
        return res;
    }
}