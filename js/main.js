import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getButtonReplayElement,
  getUlElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));

// console.log(getCellElementList());
// console.log(getCurrentTurnElement());
// console.log(getCellElementAtIdx(4));
// console.log(getGameStatusElement());
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isEndGame = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newStatus) {
  if (!newStatus) return;

  const gameStatus = getGameStatusElement();
  if (gameStatus) gameStatus.textContent = newStatus;
}

function showReplayButton() {
  const replayButton = getButtonReplayElement();
  if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
  const replayButton = getButtonReplayElement();
  if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPositions) {
  for (let position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add(CELL_VALUE.WIN);
  }
}

function handleCellClick(cellElement, index) {
  const isClicked =
    cellElement.classList.contains(TURN.CROSS) ||
    cellElement.classList.contains(TURN.CIRCLE);
  if (isClicked || isEndGame) return;

  // set selected cell
  cellElement.classList.add(currentTurn);

  // update cellValues
  cellValues[index] =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  // toggle turn
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      isEndGame = true;
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      updateGameStatus(game.status);
      showReplayButton();
      isEndGame = true;
      highlightWinCells(game.winPositions);
      break;
    }
    default:
  }
}

function initCellElementList() {
  const liElementList = getCellElementList();

  if (liElementList) {
    liElementList.forEach(
      (cellElement, index) => (cellElement.dataset.idx = index)
    );
  }

  const ulElement = getUlElement();
  if (!ulElement) return;
  ulElement.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;

    const index = parseInt(e.target.dataset.idx);
    handleCellClick(e.target, index);
  });
}

function resetGame() {
  // reset temp global vars
  isEndGame = false;
  currentTurn = TURN.CROSS;
  cellValues = cellValues.map(() => "");
  // reset dom elements

  // reset game status
  const gameStatus = getGameStatusElement();
  if (gameStatus) gameStatus.textContent = GAME_STATUS.PLAYING;

  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(TURN.CROSS);
  }

  // reset game board
  const cellElementList = getCellElementList();
  for (let cell of cellElementList) {
    cell.classList.remove(TURN.CROSS, TURN.CIRCLE, CELL_VALUE.WIN);
  }

  // hide replay button
  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getButtonReplayElement();

  if (replayButton) replayButton.addEventListener("click", resetGame);
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  initCellElementList();
  initReplayButton();
})();
