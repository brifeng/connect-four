/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    const row = [];
    for (let i = 0; i < HEIGHT; i++) {
        board.push([])
        for (let j = 0; j < WIDTH; j++) {
            board[i].push(null);
        }
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
    // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.querySelector('#board');
    // TODO: add comment for this code
    const top = document.createElement("tr"); // create table row element
    top.setAttribute("id", "column-top"); // set id to "column-top", this element will be the top row
    top.addEventListener("click", handleClick); // run handleClick function when top row is clicked

    // loop through top row, adding a cell in each column
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoard.append(top); // append top row element to html board

    // TODO: add comment for this code
    for (let y = 0; y < HEIGHT; y++) { // loop through each row in board
        const row = document.createElement("tr"); // make table row element for each row
        for (let x = 0; x < WIDTH; x++) { // loop through each column in row
            const cell = document.createElement("td"); // make a cell for each column in specified row
            cell.setAttribute("id", `${y}-${x}`); // set id for each cell for reference
            row.append(cell); // add cell to table row element
        }
        htmlBoard.append(row); // add populated row to board
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
    // TODO: write the real version of this, rather than always returning 0
    for (let i = HEIGHT - 1; i >= 0; i--) {
        if (!board[i][x]) {
            return i;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
    // TODO: make a div and insert into correct table cell
    const piece = document.createElement('div');
    piece.setAttribute('id', `${y}-${x}`);
    piece.setAttribute('class', `piece p${currPlayer}`);
    const tdCell = document.getElementById(`${y}-${x}`);
    tdCell.append(piece);
}

/** endGame: announce game end */
const endGame = (msg) => {
    // TODO: pop up alert message

    setTimeout(() => alert(msg), 1250);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (checkForTie()) {
        return endGame("It's a draw!");
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = currPlayer === 1 ? 2 : 1;
}

const checkForTie = () => {
    for (let row of board) {
        if (!row.every((cell) => cell !== null)) // is every cell filled(/not null)? if that's not true, then not tie
            return false;
    }
    return true; // after looping through board and every cell is filled, then it's a tie
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
        );
    }

    // TODO: read and understand this code. Add comments to help you.

    // these loops are redundant because there will be some that go out of bounds
    for (let y = 0; y < HEIGHT; y++) { // loop through every row
        for (let x = 0; x < WIDTH; x++) { // loop through every cell in each row
            const horiz = [ // choose the current piece and right 3
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3]
            ];
            const vert = [ // choose the current piece and down 3
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x]
            ];
            const diagDR = [ // choose the current piece and down-right 3
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3]
            ];
            const diagDL = [ // choose current piece and down-left 3
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3]
            ];

            // if any of the 4 pieces starting from the initial/current on are valid and the same color, there is a winner
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();