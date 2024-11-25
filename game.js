// Creating variables
var boardSizeInput = 6;
var board = new Board(boardSizeInput);
var mousePoint = new Point(-1, -1);
var chosenPiece = -1;
var selectedTile = false;
var chosenMoves = [];

//turn variables
var players = [1, 0];
var playerTurn = 0;
var turnCount = 1;
var endgame = false;
var winner = -1;

//RL variables
var rngAgent = new RandomAgent();
var QL = new QLearing();
var reward = 0;

var sim = new Simulation(new Board(boardSizeInput), new RandomAgent(), QL, 50);
sim.run();
console.log(sim.getWinRatios());


function update() {

    if(players[playerTurn] == 0){
        //choose AI move
        if(!checkLose()){
            // for(var i =0; i < board.pieces.length; i++){
            //     if(board.pieces[i].color == playerTurn){
            //         // selectedTile = true;
            //         // chosenPiece = i;
            //         //put after AI selection ^
            //         chosenMoves = chosenMoves.concat(board.pieces[i].avaiableMoves(i, board.pieces, board.size));
            //         //console.log(chosenMoves);
            //         //break;
            //     }
            // }
            chosenMoves = Piece.allAvaibleMoves(board.pieces, board.size, playerTurn);
            var moves = getPointsFromMovements();
                //console.log(moves);
                var action = QL.chooseAction(board.pieces, moves);
                //selectedTile = true;
                chosenPiece = action.id;
                
                movePiece(action);
    
    
                mousePoint.x = mousePoint.y = -1;
                chosenPiece = -1;
                chosenMoves = [];
                selectedTile = false;
        }
        
    }
    
}

function draw() {
    // This is how you draw a rectangle
    //context.fillRect(myX, myY, 30, 30);
    board.draw();

    context.fillStyle="#000";
    context.font="20px Verdana";
    context.fillText("Turn: " + turnCount, canvas.width - 100, 40);

    context.fillStyle="#f00";
    context.font="30px Verdana";
    context.fillText("Player 1", board.size * board.tileSize + 10, 40);
    
    context.fillStyle="#00f";
    context.font="30px Verdana";
    context.fillText("Player 0", board.size * board.tileSize + 10, board.size * board.tileSize - 40);

    if(playerTurn == 1){
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(board.size * board.tileSize + 130, 33, 7, 0, 2 * Math.PI, false);
        context.fill(); 
    }else{
        context.fillStyle = 'blue';
        context.beginPath();
        context.arc(board.size * board.tileSize + 130, board.size * board.tileSize - 47, 7, 0, 2 * Math.PI, false);
        context.fill();
    }
    

    if(!endgame){
        if(selectedTile){
            context.strokeStyle = "red";
            context.strokeRect(mousePoint.x * board.tileSize, mousePoint.y * board.tileSize, board.tileSize, board.tileSize);
            context.strokeRect(mousePoint.x * board.tileSize + 1, mousePoint.y * board.tileSize + 1, board.tileSize - 1, board.tileSize - 1);
        
            drawMoves(getPointsFromMovements());
        }
    }else{
        context.fillStyle = (winner == 1) ? "red" : "blue" ;
        context.font = "60px Verdana";
        context.fillText("Player " + winner + " wins!", 50, 250);
        context.font = "40px Verdana";
        context.fillText("Press R to restart game!", 25, 300);
    }
};

function keyup(key) {
    // Show the pressed keycode in the console
    console.log("Pressed", key);
    if (key == 82){ //R
        resetGame();
    }
};

function mouseup() {
    // Show coordinates of mouse on click
    //console.log("Mouse clicked at", mouseX, mouseY);
    if(!endgame){
        mousePoint.x = Math.floor(mouseX/ board.tileSize);
        mousePoint.y = Math.floor(mouseY/ board.tileSize);

        if(players[playerTurn] == 1 && selectedTile){
            var moves = getPointsFromMovements();
            //console.log(moves);
            
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
            if (players[playerTurn] == 1 && !(mousePoint.x > board.size - 1 || mousePoint.x < 0 || mousePoint.y > board.size - 1 || mousePoint.y < 0)){
            
                //console.log("In board")
                for(var i =0; i < board.pieces.length; i++){
                    if(mousePoint.isEqual(board.pieces[i].position) && board.pieces[i].color == playerTurn){
                        selectedTile = true;
                        chosenPiece = i;
                        chosenMoves = board.pieces[i].avaiableMoves(i, board.pieces, board.size);
                        //console.log(chosenMoves);
                        break;
                    }
                }
            }

            if(selectedTile){
                //console.log(mousePoint.toString())
            }else{
                mousePoint.x = mousePoint.y = -1;
                chosenPiece = -1;
                chosenMoves = [];
            }
    }
};

/**
 * Apply a Move to the chosen Piece and check to collect opponent Pieces
 * @param {Move} move A Move where to move a piece at
 */
function movePiece(move){

    var oldPieces = []
    board.pieces.forEach(piece => {
        oldPieces.push(piece.copy());
    });
    
    board.pieces[chosenPiece].position = board.pieces[chosenPiece].position.addOffset(move.x, move.y);
    if(!board.pieces[chosenPiece].isKing &&
         ( (board.pieces[chosenPiece].position.y == 0 && board.pieces[chosenPiece].color == 0) ||
            (board.pieces[chosenPiece].position.y == board.size - 1 && board.pieces[chosenPiece].color == 1) )){
                board.pieces[chosenPiece].isKing = true;
                reward += 1.5; //for kinging
            }
    
    if(move.enemies){
        for (let i = 0; i < move.enemies.length; i++) {
            reward += 1; //for taken Piece
            
        }
        
        board.pieces = board.pieces.filter((value, index) => !move.enemies.includes(index));
        
    }

    if(players[playerTurn] == 0){
        //console.log(oldPieces, board.pieces);
        QL.updateQValue(oldPieces, board.pieces, move, reward);
    }

    

    playerTurn = (playerTurn + 1) % 2;
    if(checkLose()){
        winner = (playerTurn + 1) % 2;
        endgame = true;
        return;
    }
    reward = 0;
    turnCount++;
}

/**
 * Checks if the current player loses the game
 * @returns {boolean} true if the current player loses the game
 */
function checkLose(){
    for(var i = 0; i < board.pieces.length; i++){
        if(board.pieces[i].color == playerTurn){
            if(board.pieces[i].avaiableMoves(i, board.pieces, board.size).length != 0){
                return false;
            }
        }
    }
    reward -= 1000;
    return true;
}

function getPointsFromMovements(){
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

/**
 * Draws the moves on the board
 * @param {Array of Move} moves array of moves on the board to be drawn
 */
function drawMoves(moves){
    context.fillStyle = "#00ff00";
    context.globalAlpha = 0.5;

    for(var i = 0; i < moves.length; i++){

        context.fillRect( (mousePoint.x + moves[i].x) * board.tileSize, (mousePoint.y + moves[i].y) * board.tileSize, board.tileSize, board.tileSize);        

    }

    //SHOUD STAY AT THE END
    context.globalAlpha = 1;
}

/**
 * The function resets the game variables to start a new game
 * @param {number} newSize the size of the new board
 */
function resetGame(newSize = 6){

    boardSizeInput = newSize;
    board.size = newSize;
    board.generateStandartBoard();
     mousePoint = new Point(-1, -1);
     chosenPiece = -1;
     selectedTile = false;
     chosenMoves = [];

     //players = [1, 0]; // change later
     playerTurn = 0;
     turnCount = 1;
     endgame = false;
     winner = -1;
     reward = 0;
}