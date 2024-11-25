class Simulation {
    constructor(board, whiteAgent, blackAgent, simNumber = 10) {
        this.board = board;
        this.whiteAgent = whiteAgent;
        this.blackAgent = blackAgent;
        this.number = simNumber;
        this.reward = 0;
        this.wins = [0, 0];
        //Add stop watch
    }

    simulate(swap = false){

        var turnNumber = 0;
        var color = 0;
        var moves = [];
        var action;
        var colorSwap = (!swap) ? 0 : 1;

        while(!this._checkLose(color)){

            moves = Simulation._getPointsFromMovements(Piece.allAvaibleMoves(this.board.pieces, this.board.size, color));
            if(color % 2 == colorSwap){
                //stop watch for turn white
                action = this.whiteAgent.chooseAction(this.board.pieces, moves);
                //
            }else{
                //stop watch for turn black
                action = this.blackAgent.chooseAction(this.board.pieces, moves);
                //
            }

            this._applyMove(action.id, action, color, colorSwap);

            turnNumber++;
            color = (color + 1) % 2;
            this.reward = 0;

        }

        this.wins[(color + 1) % 2]++;

    }

    run(swap = false){

        this.wins = [0, 0];

        if(!swap){

            for (let i = 0; i < this.number; i++) {
                
                //maybe stop watch
                this.simulate();
                //

                this.board.generateStandartBoard();
                
            }

        }else{

            for (let i = 0; i < this.number/2; i++) {
                
                //maybe stop watch
                this.simulate();
                //

                this.board.generateStandartBoard();
                
            }

            for (let i = this.number/2; i < this.number; i++) {
                
                //maybe stop watch
                this.simulate(true);
                //

                this.board.generateStandartBoard();
                
            }

        }

        //maybe clear method

    }

    static _getPointsFromMovements(chosenMoves){
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


    _applyMove(chosenPiece, move, color, colorSwap){

        var oldPieces = []
        this.board.pieces.forEach(piece => {
            oldPieces.push(piece.copy());
        });

        this.board.pieces[chosenPiece].position = this.board.pieces[chosenPiece].position.addOffset(move.x, move.y);
        if(!this.board.pieces[chosenPiece].isKing &&
            ( (this.board.pieces[chosenPiece].position.y == 0 && this.board.pieces[chosenPiece].color == 0) ||
                (this.board.pieces[chosenPiece].position.y == this.board.size - 1 && this.board.pieces[chosenPiece].color == 1) )){
                    this.board.pieces[chosenPiece].isKing = true;
                    this.reward += 1.5; //for kinging
                }
        
        if(move.enemies){
            for (let i = 0; i < move.enemies.length; i++) {
                this.reward += 1; //for taken Piece
                
            }
            
            this.board.pieces = this.board.pieces.filter((value, index) => !move.enemies.includes(index)); 
        }

        if(color % 2 == colorSwap){
            if(typeof this.whiteAgent.updateQValue === 'function'){
                this.whiteAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward);
                console.log("Updated Q value white");
                
            }
        }else{
            if(typeof this.blackAgent.updateQValue === 'function'){
                this.blackAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward);
                console.log("Updated Q value black");
            }
        }

    }

    _checkLose(color){
        for(var i = 0; i < this.board.pieces.length; i++){
            if(this.board.pieces[i].color == color){
                if(this.board.pieces[i].avaiableMoves(i, this.board.pieces, this.board.size).length != 0){
                    return false;
                }
            }
        }
        this.reward -= 1000;
        return true;
    }

    getWinRatios(){
        var wr = [this.wins[0], this.wins[1]];
        wr[0] /= this.number;
        wr[1] /= this.number;

        return wr;
    }
}