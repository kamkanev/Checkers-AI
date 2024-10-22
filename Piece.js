class Piece {
    constructor(x, y, color = 0, isKing = false) {
        this.position = new Point(x, y);
        this.color = color;
        this.isKing = isKing;
        this.drawSize = 30;
    }
    /**
     * Get all avaible moves and attacks of a Piece
     * @param {number} id index of the current piece in the pieces array
     * @param {Array of Piece} pieces array of all pieces need to calculate moves and attacks
     * @param {number} boardSize size of the board (example. 8x8)
     * @returns {Array of Move} all avaible moves for this piece
     */
    avaiableMoves(id = -1, pieces, boardSize){
        var moves = [];
        //var id = -1;

        // for(var i = 0; i < pieces.length; i++){
        //     if(pieces[i].position.isEqual(this.position)){
        //         id = i;
        //     }
        // }
        if(id == -1){
            console.error("Piece not found in avaiableMoves(pieces)");
            return [];
        }
        
        //Check avaible moves for the piece
        var upR = true, upL = true, downR = true, downL = true;
            for(var i = 0; i < pieces.length; i++){
                
                if(this.color == 0 || (this.color == 1 && this.isKing)){
                    
                    if(pieces[i].position.isEqual(this.position.addOffset(+1, -1))){
                        
                        upR = false;
                   }
                   if(pieces[i].position.isEqual(this.position.addOffset(-1, -1))){
                       

                       upL = false;
                   }
                }
                if(this.color == 1 || (this.color == 0 && this.isKing)){
                    if(pieces[i].position.isEqual(this.position.addOffset(+1, +1))){

                        downR = false;
                    }
                    if(pieces[i].position.isEqual(this.position.addOffset(-1, +1))){
                       
                       downL = false;
                    }
                }
            }

            if(this.color == 0 || (this.color == 1 && this.isKing)){
                if(upR && ( this.position.x + 1 < boardSize && this.position.y -1 >= 0)){
                    moves.push(new Move(id, "M", "R"));
                }
                if(upL && ( this.position.x - 1 >= 0 && this.position.y  - 1>= 0)){
                    moves.push(new Move(id, "M", "L"));
                }
            }
            if(this.color == 1 || (this.color == 0 && this.isKing)){
                if(downR && ( this.position.x + 1 < boardSize && this.position.y + 1 < boardSize)){
                    moves.push(new Move(id, "M", "r"));
                }
                if(downL && ( this.position.x - 1 >= 0 && this.position.y + 1 < boardSize)){
                    moves.push(new Move(id, "M", "l"));
                }
            }

        //Checka avaiable attacks (maybe recurcive)
        //TODO
        var attackIn = [];
        var attackOut = [];
        if(this.color == 0 || (this.color == 1 && this.isKing)){
            this._attackMoves(attackIn, new Move(id, "A", "R"), new Array(pieces.length).fill(0), pieces, new Point(+1, -1), boardSize);
            
            this._attackMoves(attackIn, new Move(id, "A", "L"), new Array(pieces.length).fill(0), pieces, new Point(-1, -1), boardSize);
        }
        if(this.color == 1 || (this.color == 0 && this.isKing)){
            this._attackMoves(attackIn, new Move(id, "A", "r"), new Array(pieces.length).fill(0), pieces, new Point(+1, +1), boardSize);

            /*attackOut = attackOut.concat(*/
            this._attackMoves(attackIn, new Move(id, "A", "l"), new Array(pieces.length).fill(0), pieces, new Point(-1, +1), boardSize)//);
        }
        //console.log(attackIn);
        moves = moves.concat(attackIn);
        

        return moves;
    }
    /**
     * Check attacks of a Specific Piece
     * @param {Array of Move} result returns the result
     * @param {Move} move use the Piece info
     * @param {Array of number} validator Array with 0s to backtrack
     * @param {Array of Piece} pieces Array to check for attcks
     * @param {Point} moveDir Used to move piece in this direction
     * @param {number} boardSize size of the board (example. 8x8)
     * @param {number} hop counts the jumps of Pieces
     */
    _attackMoves(result, move, validator, pieces, moveDir, boardSize, hop=0){

        if(pieces[move.id].position.y + moveDir.y < 0 || pieces[move.id].position.y + moveDir.y > boardSize - 1
            || pieces[move.id].position.x + moveDir.x < 0 || pieces[move.id].position.x + moveDir.x > boardSize - 1
        ){
            return;
        }

        if(hop%2 == 0){
                for(var i =0; i < pieces.length; i++){
                    if(pieces[move.id].color != pieces[i].color && pieces[move.id].position.addOffset(moveDir.x, moveDir.y).isEqual(pieces[i].position)){
                        //TODO recurcion
                        if(validator[i] == 1){
                            return;
                        }
                        //console.log(hop, move, i, validator, moveDir);
                        
                        validator[i] = 1;
                        move.deffendingIds.push(i);
                        var addMove = Move.StringToPoint(move.str[move.str.length-1])[0];
                        this._attackMoves(result, move, validator, pieces, moveDir.addOffset(addMove.x, addMove.y), boardSize, ++hop);
                    }
                }
                //console.log("result:", result);
                
            return;// result;

        }else{
            
            for(var i =0; i < pieces.length; i++){
                if(pieces[move.id].position.addOffset(moveDir.x, moveDir.y).isEqual(pieces[i].position)){
                    move.deffendingIds.pop();
                    return;
                    //this._attackMoves(result, move, validator, pieces, moveDir, boardSize, ++hop);
                }
            }
            
            result.push(move.copy());
            //console.log("if2:",hop, move, validator, moveDir);
            let newHop = ++hop;
            if(pieces[move.id].color == 0 || (pieces[move.id].color == 1 && pieces[move.id].isKing)){
                //up right
                this._attackMoves(result, move.copy("R"), validator.concat([]), pieces, moveDir.addOffset(+1, -1), boardSize, newHop);
                // up left
                this._attackMoves(result, move.copy("L"), validator.concat([]), pieces, moveDir.addOffset(-1, -1), boardSize, newHop);
            }
            if(pieces[move.id].color == 1 || (pieces[move.id].color == 0 && pieces[move.id].isKing)){
                //up right
                this._attackMoves(result, move.copy("r"), validator.concat([]), pieces, moveDir.addOffset(+1, +1), boardSize, newHop);
                // up left
                this._attackMoves(result, move.copy("l"), validator.concat([]), pieces, moveDir.addOffset(-1, +1), boardSize, newHop);
            }
            //4 way


            return;
        }

    }

    draw(boardSize){
        context.fillStyle = this.color == 0 ? "grey" : "red";
        if(boardSize){
            context.fillRect(this.position.x * boardSize + (boardSize-this.drawSize)/2,
             this.position.y * boardSize + (boardSize-this.drawSize)/2,
              this.drawSize, this.drawSize);

        }else{
            
            context.fillRect(this.position.x, this.position.y, this.drawSize, this.drawSize);
        }

        if(this.isKing){
            context.fillStyle = "black";
            context.fillRect(this.position.x * boardSize + (boardSize-this.drawSize)/2 + this.drawSize/2 - 5,
             this.position.y * boardSize + (boardSize-this.drawSize)/2 + + this.drawSize/2 - 5,
              10, 10);
        }
    }
}