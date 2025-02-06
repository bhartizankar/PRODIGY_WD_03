const board = Array(9).fill(null);
const cells = [];
let currentPlayer = "X";
let isGameOver = false;

const messageEl = document.getElementById("message");
const difficultySelect = document.getElementById("difficulty");

function initBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  board.fill(null);
  isGameOver = false;
  currentPlayer = "X";
  messageEl.textContent = "Player X's turn";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => handleMove(i));
    gameBoard.appendChild(cell);
    cells[i] = cell;
  });
}

function handleMove(index) {
  if (isGameOver || board[index] !== null) return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add("taken");

  if (checkWinner()) {
    messageEl.textContent = `Player ${currentPlayer} wins!`;
    isGameOver = true;
    return;
  } else if (board.every(cell => cell !== null)) {
    messageEl.textContent = "It's a draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    computerMove();
  } else {
    messageEl.textContent = `Player X's turn`;
  }
}

function computerMove() {
  const difficulty = difficultySelect.value;
  let move;
  
  if (difficulty === "easy") {
    move = getRandomMove();
  } else if (difficulty === "medium") {
    move = getWinningMove() || getRandomMove();
  } else if (difficulty === "hard") {
    move = getWinningMove() || getBlockingMove() || getRandomMove();
  }

  board[move] = "O";
  cells[move].textContent = "O";
  cells[move].classList.add("taken");

  if (checkWinner()) {
    messageEl.textContent = "Player O wins!";
    isGameOver = true;
  } else if (board.every(cell => cell !== null)) {
    messageEl.textContent = "It's a draw!";
    isGameOver = true;
  } else {
    currentPlayer = "X";
    messageEl.textContent = "Player X's turn";
  }
}

function getRandomMove() {
  const availableMoves = board.map((_, i) => i).filter(i => board[i] === null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getWinningMove() {
  return getStrategicMove("O");
}

function getBlockingMove() {
  return getStrategicMove("X");
}

function getStrategicMove(player) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  return null;
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === currentPlayer)
  );
}

document.getElementById("reset-button").addEventListener("click", initBoard);

initBoard();
