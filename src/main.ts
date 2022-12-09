import './style.css';

import { Current } from './core/Current';
import { Tile } from './core/Tile';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export let gameBoard: Tile[][] = [];
export let gameStarted = false;
let generation = 0;
let current: Current = new Current(generation);

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
}

function init() {
  document.getElementById("app")!.innerHTML = `
    <div id="#game" class="grid grid-cols-10">
      ${Array(BOARD_WIDTH * BOARD_HEIGHT).fill(0).map((_, i) => `<div data-row="${Math.floor(i / 10)}" data-col="${i % 10}" class="w-8 h-8 bg-neutral-800"></div>`).join("")}
    </div>
  `;

  gameBoard = Array(BOARD_HEIGHT).fill(0).map((_, y) => Array(BOARD_WIDTH).fill(0).map((_, x) => new Tile(y, x, document.querySelector(`div[data-row="${y}"][data-col="${x}"]`)!)));
  gameStarted = true;

  generation = 0;
  current = new Current(generation);
  current.generate();
  generation++;
  document.addEventListener("keydown", checkKeyMove);
}

function gameLoop() {
  if (gameStarted) {
    if (!current.isPlaced()) current.softDrop();
    else {
      current = new Current(generation);
      current.generate();
      generation++;
    }
  }
  setTimeout(() => {
    requestAnimationFrame(gameLoop);
  }, 500);
}

init();
requestAnimationFrame(gameLoop);