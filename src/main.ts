import './style.css';

import { Current } from './core/Current';
import { Tile } from './core/Tile';
import { blocks } from './constants/blocks';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

const genNumber = () => Math.floor(Math.random() * 7)

export let gameBoard: Tile[][] = [];
export let gameStarted = false;
let generation = 0;
let blockType: [number, number] = [genNumber(), genNumber()];
let current: Current;

function checkKeyMove(event: KeyboardEvent) {
  if (event.key === "a") {
    current.moveLeft();
  }
  if (event.key === "d") {
    current.moveRight();
  }
  if (event.key === "w") {
    current.rotate();
  }
  if (event.key === " ") {
    current.hardDrop();
  }
}

function init() {
  document.getElementById("app")!.innerHTML = `
    <div id="game" class="grid grid-cols-10">
      ${Array(BOARD_WIDTH * BOARD_HEIGHT).fill(0).map((_, i) => `<div data-row="${Math.floor(i / 10)}" data-col="${i % 10}" class="w-8 h-8 bg-neutral-800"></div>`).join("")}
    </div>
    <div class="border-2 border-white w-36">
      <div class="bg-white w-full p-2 uppercase font-semibold">
        next tile
      </div>
      <div id="next" class="w-full p-4 grid">
      </div>
    </div>
  `;

  gameBoard = Array(BOARD_HEIGHT).fill(0).map((_, y) => Array(BOARD_WIDTH).fill(0).map((_, x) => new Tile(y, x, document.querySelector(`div[data-row="${y}"][data-col="${x}"]`)!)));
  gameStarted = true;

  current = new Current(blockType[0], generation);
  drawNextTile();
  current.generate();
  generation++;
  document.addEventListener("keydown", checkKeyMove);
}

function clearLine(row: number) {
  for (let tile of gameBoard[row]) {
    tile.generation = -1;
    tile.changeColor(null);
  }
}

function moveDown(row: number) {
  for (let y = row - 1; y >= 0; y--) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      gameBoard[y + 1][x].generation = gameBoard[y][x].generation;
      gameBoard[y + 1][x].changeColor(gameBoard[y][x].color)
    }
  }
}

function checkLineClear() {
  while (gameBoard.some(row => row.every(tile => tile.generation !== -1))) {
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (gameBoard[y].every(tile => tile.generation !== -1)) {
        clearLine(y);
        moveDown(y);
      }
    }
  }
}

function drawNextTile() {
  const container: HTMLDivElement = document.getElementById("next")! as HTMLDivElement;
  const nextBlock = blocks[blockType[1]];
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${nextBlock.pattern[0].length}, minmax(0, 1fr))`;

  for (let y = 0; y < nextBlock.pattern.length; y++) {
    for (let x = 0; x < nextBlock.pattern[0].length; x++) {
      container.innerHTML += `<div class="w-full h-full aspect-square ${nextBlock.pattern[y][x] !== 0 && `bg-${nextBlock.color}-500`}"></div>`
    } 
  }
}

function gameLoop() {
  if (gameStarted) {
    if (!current.isPlaced()) current.softDrop();
    else {
      checkLineClear();
      blockType[0] = blockType[1];
      blockType[1] = genNumber();
      current = new Current(blockType[0], generation);
      current.generate();
      generation++;
      drawNextTile();
    }
  }

  setTimeout(() => {
    requestAnimationFrame(gameLoop);
  }, 500);
}

init();
requestAnimationFrame(gameLoop);