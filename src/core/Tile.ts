import { COLOR } from '../constants/colors';

export class Tile {
  y: number;
  x: number;
  color: COLOR;
  elem: HTMLDivElement;
  generation: number;

  constructor(y: number, x: number, elem: HTMLDivElement) {
    this.y = y;
    this.x = x;
    this.color = null;
    this.elem = elem;
    this.generation = -1;
  }

  changeColor(color: COLOR) {
    this.color = color;
    const className = this.elem.className;
    let classList = className.split(" ");
    classList = classList.filter((e: string) => !e.includes("bg"));
    if (color)
      classList.push(`bg-${color}-500`);
    else
      classList.push("bg-neutral-800");

    this.elem.className = classList.join(" ");
  }
}
