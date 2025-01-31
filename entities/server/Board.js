const Piece = require("./Piece");
/**
 * BOARD class
 */
class Board {

    /**
     * Constructor of the class
     * @param {number} size board of what size we what to be (how many squares on each side)
     */
    constructor(size = 8) {
        this.size = size;
        this.pieces = [];
        this.tileSize = 70;
        this.generateStandartBoard();
    }


    /**
     * Generates a new Board with Pieces using infoarmation from the constructor
     */
    generateStandartBoard(){
        this.pieces = [];
        var numberOfRowWithPieces = this.size == 8 ? 3 : (this.size == 6 ? 2 : 1);
        for(let y = 0; y < numberOfRowWithPieces; y++) {
            for(let x = 0; x < this.size; x++){
                if(this.size < 8 ? (x + y + Math.floor( (8 - this.size) / 2 ) )%2 != 0 : (x + y)%2 != 0){
                    this.pieces.push(new Piece(x, y, 1));
                }
            }
        }

        for(let y = this.size - 1; y > this.size - numberOfRowWithPieces -1; y--) {
            for(let x = 0; x < this.size; x++){
                if(this.size < 8 ? (x + y + Math.floor( (8 - this.size) / 2 ) )%2 != 0 : (x + y)%2 != 0){
                    this.pieces.push(new Piece(x, y, 0));
                }
            }
        }
    }

    /**
     * Draws the board and the Piece if any
     * @param {string} whiteColor color for the white Squares
     * @param {string} blackColor color for the black Squares
     */
    draw(whiteColor = "#f8e7bb", blackColor = "#660000"){
        for(let y = 0; y < this.size; y++) {
            for(let x = 0; x < this.size; x++){
                if(this.size < 8 ? (x + y + Math.floor( (8 - this.size) / 2 ) )%2 == 0 : (x + y)%2 == 0){
                    context.fillStyle = whiteColor
                }else{
                    context.fillStyle = blackColor
                }
                context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
            
        }
        for (let i = 0; i < this.pieces.length; i++) {
            if(this.pieces[i] != null){
                this.pieces[i].draw(this.tileSize);
            }
            
        }
    }
}
if(module){
    module.exports = Board;
}