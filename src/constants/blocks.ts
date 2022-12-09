import { COLOR } from './colors';

interface BLOCK {
  color: COLOR;
  pattern: (1 | 0)[][];
}

export const blocks: BLOCK[] = [
  {
    color: "cyan",
    pattern: [[1, 1, 1, 1]]
  },
  {
    color: "blue",
    pattern: [[1, 0, 0], [1, 1, 1]]
  },
  {
    color: "orange",
    pattern: [[0, 0, 1], [1, 1, 1]]
  },
  {
    color: "yellow",
    pattern: [[1, 1], [1, 1]]
  },
  {
    color: "green",
    pattern: [[0, 1, 1], [1, 1, 0]]
  },
  {
    color: "purple",
    pattern: [[0, 1, 0], [1, 1, 1]]
  },
  {
    color: "red",
    pattern: [[1, 1, 0], [0, 1, 1]]
  }
];
