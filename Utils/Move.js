/**
 * MOVE class
 */
class Move {

    /**
     * Constructor of the class
     * @param {number} PieceId the index of a Pice in the board.pieces array
     * @param {string} type "A" for attack move and "M" for simple move
     * @param {string} movementString string indicating the move pathern of the Piece
     */
    constructor(PieceId, type = "A", movementString) {
        this.id = PieceId;
        this.type = type;
        this.str = movementString;
        this.deffendingIds = []
    }

    /**
     * Creates a new instance/copy of the object
     * @param {string} string a new string to be added to the instance
     * @returns {Move} a new instance the similar to the original one
     */
    copy(string = ""){
        var res = new Move(this.id, this.type, this.str);
        res.deffendingIds = res.deffendingIds.concat(this.deffendingIds);
        res.str += string;

        return res;
    }

    addDeffendingPiece(id){
        if(id != -1){
            this.deffendingIds.push(id);
        }
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

    static MoveToPoint(move){

        var points = [];
        var mp = this.StringToPoint(move.str);

        if(move.type == "M"){
            points = points.concat(mp);
        }else{
            var currP = new Point(0, 0);
            for(var i = 0; i < mp.length; i++){
                points.push(
                    {x: mp[i].x*2 + currP.x,
                     y: mp[i].y*2 + currP.y,
                     enemies: move.deffendingIds}
                    );
                currP.x = mp[i].x*2;
                currP.y = mp[i].y*2;
            }
        }

        for(var i = 0; i < points.length; i++){
            points[i].id = move.id;
        }

        return points;

    }
}