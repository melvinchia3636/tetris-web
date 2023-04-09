import { Tile } from "./Tile";
import { BOARD_WIDTH, gameBoard, BOARD_HEIGHT } from "../main";
import { blocks } from "../constants/blocks";
import { COLOR } from "../constants/colors";

export class Current {
  type: number;
  color: COLOR;
  tiles: (Tile | null)[][];
  generation: number;

  constructor(type: number, generation: number) {
    this.type = type;
    this.color = null;
    this.tiles = [];
    this.generation = generation;
  }

  generate() {
    const block = blocks[this.type];
    this.color = block.color;

    const center = Math.floor((BOARD_WIDTH - block.pattern[0].length) / 2);

    for (let y = 0; y < block.pattern.length; y++) {
      for (let x = center; x < center + block.pattern[0].length; x++) {
        if (
          block.pattern[y][x - center] === 1 &&
          gameBoard[y][x].color !== null
        ) {
          return false;
        }
      }
    }

    for (let y = 0; y < block.pattern.length; y++) {
      this.tiles.push([]);
      for (let x = center; x < center + block.pattern[0].length; x++) {
        if (block.pattern[y][x - center] === 1) {
          this.tiles[y].push(gameBoard[y][x]);
          gameBoard[y][x].changeColor(this.color);
          gameBoard[y][x].generation = this.generation;
        } else {
          this.tiles[y].push(null);
        }
      }
    }
    return true;
  }

  isPlaced() {
    for (let tiles of this.tiles) {
      for (let tile of tiles.filter((t) => t !== null) as Tile[]) {
        if (tile.y === BOARD_HEIGHT - 1) {
          return true;
        }

        if (
          ![this.generation, -1].includes(
            gameBoard[tile.y + 1][tile.x].generation
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updatePosition(coords: ([number, number] | null)[][]) {
    for (let y of coords) {
      this.tiles.push([]);
      for (let x of y) {
        if (x) {
          const tile = gameBoard[x[0]][x[1]];
          tile.changeColor(this.color);
          tile.generation = this.generation;
          this.tiles[this.tiles.length - 1].push(tile);
        } else {
          this.tiles[this.tiles.length - 1].push(null);
        }
      }
    }
  }

  rotate() {
    for (let yTiles of this.tiles) {
      const tile = yTiles[0];
      if (tile) {
        if (tile.x == 0) {
          return;
        }
        if (gameBoard[tile.y][tile.x - 1].color !== null) {
          return;
        }
      }
    }

    const ANGLE = (90 * Math.PI) / 180;
    const cos = Math.cos(ANGLE);
    const sin = Math.sin(ANGLE);

    const newCoords: [number, number][] = [];

    for (let yTiles of this.tiles) {
      for (let xTile of yTiles) {
        if (xTile) newCoords.push([xTile.y, xTile.x]);
      }
    }

    const xMin = Math.min(
      ...(this.tiles
        .map((tile) => tile[0]?.x)
        .filter((tile) => tile !== undefined) as number[])
    );
    const yMin = Math.min(
      ...(this.tiles[0]
        .map((tile) => tile?.y)
        .filter((tile) => tile !== undefined) as number[])
    );
    const cx = Math.floor(xMin + this.tiles[0].length / 2);
    const cy = Math.floor(yMin + this.tiles.length / 2);

    for (let _n in newCoords) {
      const n = parseInt(_n);
      const temp = Math.round(
        (newCoords[n][1] - cx) * cos - (newCoords[n][0] - cy) * sin + cx
      );
      newCoords[n][0] = Math.round(
        (newCoords[n][1] - cx) * sin + (newCoords[n][0] - cy) * cos + cy
      );
      newCoords[n][1] = temp;
    }

    const newCoords2: { [key: number]: [number, number][] } = {};

    for (let n of newCoords) {
      if (newCoords2[n[0]] !== undefined) {
        newCoords2[n[0]].push(n);
      } else {
        newCoords2[n[0]] = [n];
      }
    }

    let newCoords3: [number, number][][] = Object.values(newCoords2).map(
      (coords) => coords.sort()
    );
    newCoords3 = newCoords3.sort();

    for (let coords of newCoords3) {
      for (let coord of coords) {
        if (coord[1] < 0 || coord[1] > BOARD_WIDTH - 1) return;
        if (coord[0] < 0 || coord[0] > BOARD_HEIGHT - 1) return;
        if (
          coord[0] > 0 &&
          ![-1, this.generation].includes(
            gameBoard[coord[0]][coord[1]].generation
          )
        )
          return;
      }
    }

    const Xs = newCoords3.flat().map((coord) => coord[1]);
    const minX = Math.min(...Xs);
    const maxX = Math.max(...Xs);
    const newCoords4: ([number, number] | null)[][] = [];

    for (let coords of newCoords3) {
      newCoords4.push([]);
      for (let i = minX; i <= maxX; i++) {
        if (coords.some((coord) => coord[1] === i))
          newCoords4[newCoords4.length - 1].push([coords[0][0], i]);
        else newCoords4[newCoords4.length - 1].push(null);
      }
    }

    for (let tiles of this.tiles) {
      for (let tile of tiles) {
        if (tile) {
          tile.changeColor(null);
          tile.generation = -1;
        }
      }
    }

    this.tiles = [];

    this.updatePosition(newCoords4);
  }

  moveLeft() {
    for (let yTiles of this.tiles) {
      const tile = yTiles[0];
      if (tile) {
        if (tile.x == 0) {
          return;
        }
        if (
          ![this.generation, -1].includes(
            gameBoard[tile.y][tile.x - 1].generation
          )
        ) {
          return;
        }
      }
    }

    const newCoords: ([number, number] | null)[][] = [];

    for (let yTiles of this.tiles) {
      newCoords.push([]);
      for (let xTile of yTiles) {
        if (xTile) {
          xTile.changeColor(null);
          xTile.generation = -1;
          newCoords[newCoords.length - 1].push([xTile.y, xTile.x - 1]);
        } else {
          newCoords[newCoords.length - 1].push(null);
        }
      }
    }

    this.tiles = [];

    this.updatePosition(newCoords);
  }

  moveRight() {
    for (let yTiles of this.tiles) {
      const tile = yTiles[yTiles.length - 1];
      if (tile) {
        if (tile.x == BOARD_WIDTH - 1) {
          return;
        }
        if (
          ![this.generation, -1].includes(
            gameBoard[tile.y][tile.x + 1].generation
          )
        ) {
          return;
        }
      }
    }

    const newCoords: ([number, number] | null)[][] = [];

    for (let yTiles of this.tiles) {
      newCoords.push([]);
      for (let xTile of yTiles) {
        if (xTile) {
          xTile.changeColor(null);
          xTile.generation = -1;
          newCoords[newCoords.length - 1].push([xTile.y, xTile.x + 1]);
        } else {
          newCoords[newCoords.length - 1].push(null);
        }
      }
    }

    this.tiles = [];

    this.updatePosition(newCoords);
  }

  hardDrop() {
    while (!this.isPlaced()) this.softDrop();
  }

  softDrop() {
    const newCoords: ([number, number] | null)[][] = [];

    if (this.isPlaced()) return;

    for (let yTiles of this.tiles) {
      newCoords.push([]);
      for (let xTile of yTiles) {
        if (xTile) {
          xTile.changeColor(null);
          xTile.generation = -1;
          newCoords[newCoords.length - 1].push([xTile.y + 1, xTile.x]);
        } else {
          newCoords[newCoords.length - 1].push(null);
        }
      }
    }

    this.tiles = [];

    this.updatePosition(newCoords);
  }
}
