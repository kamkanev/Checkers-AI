﻿// Creating variables
var board = new Board(6);
var mousePoint = new Point(-1, -1);
var chosenPiece = -1;
var selectedTile = false;
var chosenMoves = [];

function update() {
    
}

function draw() {
    // This is how you draw a rectangle
    //context.fillRect(myX, myY, 30, 30);
    board.draw();

    if(selectedTile){
    context.strokeStyle = "red";
    context.strokeRect(mousePoint.x * board.tileSize, mousePoint.y * board.tileSize, board.tileSize, board.tileSize);
    context.strokeRect(mousePoint.x * board.tileSize + 1, mousePoint.y * board.tileSize + 1, board.tileSize - 1, board.tileSize - 1);

    drawMoves(getPointsFromMovements());
    }
};

function keyup(key) {
    // Show the pressed keycode in the console
    console.log("Pressed", key);
};

function mouseup() {
    // Show coordinates of mouse on click
    //console.log("Mouse clicked at", mouseX, mouseY);
    mousePoint.x = Math.floor(mouseX/ board.tileSize);
    mousePoint.y = Math.floor(mouseY/ board.tileSize);

    if(selectedTile){
        var moves = getPointsFromMovements();
        for(var i =0; i < moves.length; i++){
            if(mousePoint.isEqual(board.pieces[chosenPiece].position.addOffset(moves[i].x, moves[i].y))){
                movePiece(moves[i]);
                break;
            }
        }
        mousePoint.x = mousePoint.y = -1;
        chosenPiece = -1;
        chosenMoves = [];
    }

    selectedTile = false;
        if (!(mousePoint.x > board.size - 1 || mousePoint.x < 0 || mousePoint.y > board.size - 1 || mousePoint.y < 0)){
        
            console.log("In board")
            for(var i =0; i < board.pieces.length; i++){
                if(mousePoint.isEqual(board.pieces[i].position)){
                    selectedTile = true;
                    chosenPiece = i;
                    chosenMoves = board.pieces[i].avaiableMoves(i, board.pieces, board.size);
                    //console.log(chosenMoves);
                    break;
                }
            }
        }

        if(selectedTile){
            console.log(mousePoint.toString())
        }else{
            mousePoint.x = mousePoint.y = -1;
            chosenPiece = -1;
            chosenMoves = [];
        }
};
/***
 * Only for moving for now
 * TODO attack
 */
function movePiece(move){
    board.pieces[chosenPiece].position = board.pieces[chosenPiece].position.addOffset(move.x, move.y);
}

function getPointsFromMovements(){
    var movePoints = [];
    chosenMoves.forEach(m => {
        var pm = Move.StringToPoint(m.str);
        for(var i =0; i < pm.length; i++){
            movePoints.push(pm[i]);
        }
    });

    return movePoints;
}

function drawMoves(moves){
    context.fillStyle = "red";
    context.globalAlpha = 0.4;

    for(var i = 0; i < moves.length; i++){

        context.fillRect( (mousePoint.x + moves[i].x) * board.tileSize, (mousePoint.y + moves[i].y) * board.tileSize, board.tileSize, board.tileSize);        

    }

    //SHOUD STAY AT THE END
    context.globalAlpha = 1;
}
