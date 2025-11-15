const statusDisplay = document.querySelector(".game--status");

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `🏆 Player ${currentPlayer} has won!`;
const drawMessage = () => `🤝 It's a draw!`;
const currentPlayerTurn = () => `🤩 ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
  for (const [a, b, c] of winningConditions) {
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      statusDisplay.innerHTML = winningMessage();
      gameActive = false;

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });

      return true;
    }
  }

  if (!gameState.includes("")) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return true;
  }

  return false;
}

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) return;

  handleCellPlayed(clickedCell, clickedCellIndex);
  if (handleResultValidation()) return;

  handlePlayerChange();

  if (currentPlayer === "O" && gameActive) {
    setTimeout(() => {
      const emptyCells = gameState
        .map((val, idx) => (val === "" ? idx : null))
        .filter((idx) => idx !== null);
      const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const cell = document.querySelector(
        `.cell[data-cell-index="${randomIndex}"]`
      );
      handleCellPlayed(cell, randomIndex);
      if (!handleResultValidation()) handlePlayerChange();
    }, 500);
  }
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);
