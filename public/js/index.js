
//Board nums
let dimensionsX = 14;
let dimensionsY = 18;
let numMines = 40;
let totalMarked = 0;

//Timer Nums
let timerInterval;
let seconds = 0;
let isRunning = false;

let board = createBoard(dimensionsX, dimensionsY, numMines);

const minefield = document.getElementById("minefield");

function initializeBoard() {
    displayBoard(board);

    document.getElementById('submit').addEventListener('click', function() {
        dimensionsX = parseInt(document.getElementById('x-dimension').value);
        dimensionsY = parseInt(document.getElementById('y-dimension').value);
        numMines = parseInt(document.getElementById('mines').value);
        board = createBoard(dimensionsX, dimensionsY, numMines);
        displayBoard(board);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeBoard();
});

function displayBoard(board) {
    minefield.innerHTML = "";

    //List remaining mines
    minesLeft = document.querySelector('[mines-left]');
    const minesLeftNum = numMines-totalMarked;
    minesLeft.textContent = minesLeftNum;

    for (let i = 0; i < dimensionsX; i++) {
        for (let j = 0; j < dimensionsY; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            //cell.id = 'cell-' + i + '-' + j;
            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                    cell.textContent = "💣";
                } else if (board[i][j].count > 0) {
                    switch (board[i][j].count) {
                        case 1:
                            cell.style.color = "blue";
                            break;
                        case 2:
                            cell.style.color = "green";
                            break;
                        case 3:
                            cell.style.color = "red";
                            break;
                        case 4:
                            cell.style.color = "darkblue";
                            break;
                        case 5:
                            cell.style.color = "maroon";
                            break;
                        case 6:
                            cell.style.color = "turquoise";
                            break;
                        case 7:
                            cell.style.color = "black";
                            break;
                        case 8:
                            cell.style.color = "grey"; //If by somehow this happens 
                            break;
                    }
                    cell.textContent = board[i][j].count;
                }
            }
            else if (board[i][j].marked) {
                cell.classList.add("marked");
                cell.textContent = "🚩";// Replace with ► in case of error 
            }
            cell.addEventListener("click", () => showTile(board, i, j));
            cell.addEventListener("contextmenu", e => { //https://stackoverflow.com/questions/4235426/how-can-i-capture-the-right-click-event-in-javascript
                e.preventDefault();
                if (!board[i][j].revealed) {
                    markTile(board, i, j);
                }
            })
            minefield.appendChild(cell);
        }
        minefield.appendChild(document.createElement("br"));
    }
}

function revealAllMines() {
    for (let i = 0; i < dimensionsX; i++) {
        for (let j = 0; j < dimensionsY; j++) {
            if (board[i][j].isMine) {
                board[i][j].revealed = true;
            }
        }
    }
}

function createBoard(dimensionsX, dimensionsY, numberOMines) {
    totalMarked = 0;
    seconds = 0;
    stopTimer();
    document.getElementById('timer').innerText = '0 Seconds';
    console.log("Created board successfully");
    let board = []
    for (let i = 0; i < dimensionsX; i++) {
        board[i] = [];
        for (let j = 0; j < dimensionsY; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                marked: false,
                count: 0,
            };
        }
    }
 
    let minesPlaced = 0;
    while (minesPlaced < numberOMines) {
        const row = Math.floor(Math.random() * dimensionsX);
        const col = Math.floor(Math.random() * dimensionsY);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
 
    // Num near non mine cells
    for (let i = 0; i < dimensionsX; i++) {
        for (let j = 0; j < dimensionsY; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let nextX = -1; nextX <= 1; nextX++) {
                    for (let nextY = -1; nextY <= 1; nextY++) {
                        const currentX = i + nextX;
                        const currentY = j + nextY;
                        if (currentX >= 0 && currentX < dimensionsX && currentY >= 0 && currentY < dimensionsY && board[currentX][currentY].isMine) {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
    return board;
}

function showTile(board, row, col) {
    if (!isRunning) {
        startTimer();
    }

    if (row < 0 || row >= dimensionsX || col < 0 || col >= dimensionsY || board[row][col].revealed) {
        return;
    }
    board[row][col].revealed = true;
    if (board[row][col].marked) {
        board[row][col].marked = false;
        totalMarked--;
    }
    if (board[row][col].isMine) {
        alert( //Change Later
            "Game Over! You stepped on a mine after " + seconds + " seconds."
        );
        revealAllMines();
        stopTimer();
    } else if (board[row][col].count === 0) {
        // If cell has no mines nearby, reveal adjacent cells
        for (let nextX = -1; nextX <= 1; nextX++) {
            for (let nextY = -1; nextY <= 1; nextY++) {
                showTile(board, row + nextX, col + nextY);
            }
        }
    }
    displayBoard(board);

    if (checkForWin(board)) {
        alert("Congratulations! You've won the game after " + seconds + " seconds!");
        stopTimer();
    }
}

function markTile(board, row, col) {
    if (numMines < totalMarked) {
        return;
    }
    if (board[row][col].marked) {
        board[row][col].marked = false;
        totalMarked--;
    }
    else {
        board[row][col].marked = true;
        totalMarked++;
    }
    displayBoard(board);
}

function startTimer() {
    if (!isRunning) {
        timerInterval = setInterval(updateTimer, 1000);
        isRunning = true;
    }
}

function updateTimer() {
    seconds++;
    document.getElementById('timer').innerText = seconds + ' Seconds';
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function checkForWin(board) {
    for (let i = 0; i < dimensionsX; i++) {
        for (let j = 0; j < dimensionsY; j++) {
            if (!board[i][j].isMine && !board[i][j].revealed) {
                return false;
            }
            if (board[i][j].isMine && !board[i][j].marked) {
                return false;
            }
        }
    }
    return true;
}
