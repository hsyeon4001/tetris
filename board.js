import { KEY, COLS, ROWS, BLOCK_SIZE, COLORS, POINTS, LINES_PER_LEVEL, LEVEL, CLEAR_LEVEL } from './constants.js';
import Piece from './piece.js';

class Board {
  grid;
  ctx;
  ctxNext;
  next;
  moves = {
    [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p) => this.rotate(p),
  };

  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
  }

  reset() {
    this.grid = this.getEmptyBoard();
    this.drawBoard();
  }

  getEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        // if (!this.insideWalls(x)) debugger;
        return this.isEmpty(value) || (this.insideWalls(x) && this.aboveFloor(y) && !this.detectCrash(x, y));
      });
    });
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drawNext() {
    this.next = new Piece(this.ctxNext);
    this.next.x = 0;
    this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
    this.next.draw();
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.piece.ctx.fillStyle = COLORS[value - 1];
          this.piece.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  // 병합될 때 한번만 호출되어야 함
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  isEmpty(value) {
    // 블럭이 그려진 위치인가?
    return value === 0;
  }
  insideWalls(x) {
    // 이동하는 공간이 벽인가
    return x >= 0 && x < COLS;
  }
  aboveFloor(y) {
    // 이동하는 공간이 바닥인가
    return y >= 0 && y < ROWS;
  }

  detectCrash(x, y) {
    return this.grid[y][x] !== 0;
  }

  rotate(p) {
    let clone = JSON.parse(JSON.stringify(p));

    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }

    p.shape.forEach((row) => row.reverse());

    return clone;
  }

  drop() {
    let p = this.moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
      return true;
    } else {
      return false;
    }
  }

  clearLines(account, time) {
    let lines = 0;
    this.grid.forEach((row, y) => {
      if (row.every((value) => value > 0)) {
        lines++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      account.score += this.getLineClearPoints(lines, account.level);
      account.lines += lines;

      if (account.lines >= LINES_PER_LEVEL) {
        account.level++;
        if (account.level >= CLEAR_LEVEL) return;
        account.lines -= LINES_PER_LEVEL;
        time.level = LEVEL[account.level];
      }
    }
  }

  getLineClearPoints(lines, level) {
    let points =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (level + 1) * points;
  }
}

export default Board;
