class Move {
    constructor(PieceId, type = "A", movementString) {
        this.id = PieceId;
        this.type = type;
        this.str = movementString;
    }

    static StringToPoint(movementString){

        var points = [];

        for(var i = 0; i < movementString.length; i++){
            switch (movementString[i]) {
                case "R":
                    points.push({x: +1, y: -1});
                    break;
                case "L":
                    points.push({x: -1, y: -1});
                    break;
                case "r":
                    points.push({x: +1, y: +1});
                    break;
                case "l":
                    points.push({x: -1, y: +1});
                    break;
            
                default:
                    break;
            }
        }

        return points;

    }
}