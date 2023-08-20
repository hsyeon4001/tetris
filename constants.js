const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
};
const LINES_PER_LEVEL = 5;
const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
const SHAPES = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [4, 4, 0],
    [4, 4, 0],
  ],
  [
    [0, 0, 0],
    [0, 5, 5],
    [5, 5, 0],
  ],
  [
    [0, 0, 0],
    [6, 6, 6],
    [0, 6, 0],
  ],
  [
    [0, 0, 0],
    [7, 7, 0],
    [0, 7, 7],
  ],
];

const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 430,
  5: 350,
};

Object.freeze(KEY);
Object.freeze(POINTS);
Object.freeze(LEVEL);

export { COLS, ROWS, BLOCK_SIZE, KEY, COLORS, SHAPES, POINTS, LINES_PER_LEVEL, LEVEL };
