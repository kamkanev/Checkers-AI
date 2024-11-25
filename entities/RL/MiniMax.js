class MiniMax {
    constructor(alpha, beta, depth, isMaximazing) {
        
    }

    chooseAction(state, actions){

        
        
    }

    minimax(){

    }

    _applyMove(){

    }

    _isLosing(){

    }

    static _convertMoves(chosenMoves){
        var movePoints = [];
        chosenMoves.forEach(m => {
            //var pm = Move.StringToPoint(m.str);//change to work for attack
            //var p = Move.MoveToPoint(m);
            //console.log("P:", p);
            movePoints = movePoints.concat(Move.MoveToPoint(m));
            // for(var i = 0; i < p.length; i++){
            //     movePoints.push(p[i]);
            // }
        });
    
        return movePoints;
    }
}