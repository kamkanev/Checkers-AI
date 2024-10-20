class Piece {
    constructor(x, y, color = 0, isKing = false) {
        this.position = new Point(x, y);
        this.color = color;
        this.isKing = isKing;
        this.drawSize = 30;
    }

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

        return moves;
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
    }
}