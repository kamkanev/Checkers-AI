const Rewards = require("../../Utils/Rewards");
const Piece = require("./Piece");
const Point = require("../../Utils/point");
const Move = require("../../Utils/Move");
const performance = require('perf_hooks').performance;

class Simulation {
    constructor(board, whiteAgent, blackAgent, simNumber = 10) {
        this.board = board;
        this.whiteAgent = whiteAgent;
        this.blackAgent = blackAgent;
        this.number = simNumber;
        this.reward = Rewards.DEFAULT;
        this.wins = [0, 0];

        //Add stop watch
        this.performTime = new Array(simNumber);
    }

    simulate(swap = false){

        var turnNumber = 0;
        var color = 0;
        var moves = [];
        var action;
        var colorSwap = (!swap) ? 0 : 1;
        var turnAvrTime = [0, 0];
        var turns = [0, 0];

        this.reward = Rewards.DEFAULT;

        while(!this._checkLose(color)){

            moves = Simulation._getPointsFromMovements(Piece.allAvaibleMoves(this.board.pieces, this.board.size, color));
            if(color % 2 == colorSwap){
                const start = performance.now();
                action = this.whiteAgent.chooseAction(this.board.pieces, moves);
                const end = performance.now();
                turnAvrTime[(color + colorSwap) % 2] += (end - start);
            }else{
                const start = performance.now();
                action = this.blackAgent.chooseAction(this.board.pieces, moves);
                const end = performance.now();
                turnAvrTime[(color + colorSwap) % 2] += (end - start);
            }

            this._applyMove(action.id, action, color, colorSwap);

            turnNumber++;
            turns[(color + colorSwap) % 2]++;
            color = (color + 1) % 2;
            this.reward = Rewards.DEFAULT; //*= -1; //inverses to get neg rewards the oppenent

        }

        //console.log(((color + 1) % 2) == 0 ? "white wins" : "black wins");
        

        this.reward = Rewards.DEFAULT;

        turnAvrTime[0] /= turns[0];
        turnAvrTime[1] /= turns[1];

        this.wins[(color + 1 + colorSwap) % 2]++;

        return turnAvrTime;

    }

    run(swap = false){

        console.log("Start simulation ...");
        

        this.wins = [0, 0];

        if(!swap){

            for (let i = 0; i < this.number; i++) {

                console.log((i+1) + " game is simutaing of " + this.number);
                
                
                this.performTime[i] = this.simulate();

                if(typeof this.whiteAgent.decayEpsilon === "function"){
                    this.whiteAgent.decayEpsilon(i);
                }
                if(typeof this.blackAgent.decayEpsilon === "function"){
                    this.blackAgent.decayEpsilon(i);
                    
                }

                this.board.generateStandartBoard();
                
            }

        }else{

            for (let i = 0; i < this.number/2; i++) {

                console.log((i+1) + " game is simutaing of " + this.number);
                
                this.performTime[i] = this.simulate();

                if(typeof this.whiteAgent.decayEpsilon === "function"){
                    this.whiteAgent.decayEpsilon(i);
                }
                if(typeof this.blackAgent.decayEpsilon === "function"){
                    this.blackAgent.decayEpsilon(i);
                }

                this.board.generateStandartBoard();
                
            }

            console.log("Swap is performed!");
            

            for (let i = this.number/2; i < this.number; i++) {

                console.log((i+1) + " game is simutaing of " + this.number);
                
                this.performTime[i] = this.simulate(true);

                if(typeof this.whiteAgent.decayEpsilon === "function"){
                    this.whiteAgent.decayEpsilon(i);
                }
                if(typeof this.blackAgent.decayEpsilon === "function"){
                    this.blackAgent.decayEpsilon(i);
                }

                this.board.generateStandartBoard();
                
            }

        }

        console.log("End of simulation");
        

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
                    this.reward += Rewards.KING; //for kinging
                }
        
        if(move.enemies){
            for (let i = 0; i < move.enemies.length; i++) {
                this.reward += this.board.pieces[move.enemies[i]].isKing ? Rewards.KING : Rewards.PERPIECE; //for taken Piece
                
            }
            
            this.board.pieces = this.board.pieces.filter((value, index) => !move.enemies.includes(index)); 
        }

        if(this._checkLose(color)){
            this.reward += Rewards.LOSE;
            if(color % 2 == colorSwap){
                if(typeof this.blackAgent.updateQValue === 'function'){
                    this.blackAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward * (-1));
                    //console.log("Updated Q value white");
                    
                }
            }else{
                if(typeof this.whiteAgent.updateQValue === 'function'){
                    this.whiteAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward * (-1));
                    //console.log("Updated Q value black");
                }
            }
        }else if(this._checkLose((color + 1) % 2)){
            this.reward += Rewards.WIN;
            if(color % 2 == colorSwap){
                if(typeof this.blackAgent.updateQValue === 'function'){
                    this.blackAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward * (-1));
                    //console.log("Updated Q value white");
                    
                }
            }else{
                if(typeof this.whiteAgent.updateQValue === 'function'){
                    this.whiteAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward * (-1));
                    //console.log("Updated Q value black");
                }
            }
        }

        if(color % 2 == colorSwap){
            if(typeof this.whiteAgent.updateQValue === 'function'){
                this.whiteAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward);
                //console.log("Updated Q value white");
                
            }
        }else{
            if(typeof this.blackAgent.updateQValue === 'function'){
                this.blackAgent.updateQValue(oldPieces, this.board.pieces, move, this.reward);
                //console.log("Updated Q value black");
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
        //this.reward -= Rewards.LOSE;
        return true;
    }

    getWinRatios(){
        var wr = [this.wins[0], this.wins[1]];
        wr[0] /= this.number;
        wr[1] /= this.number;

        return wr;
    }

    getPerformanceInMicroSec(){
        this.performTime.forEach( perf => {
            perf[0] *= 1000;
            perf[1] *= 1000;
        });

        return this.performTime;
    }
}

if(module){
    module.exports = Simulation;
}