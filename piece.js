import { SHAPES, COLORS } from './constants.js';

class Piece {
  x;
  y;
  color;
  shape;
  ctx;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    const typeId = this.randomizeTetrominoType(COLORS.length);
    this.color = COLORS[typeId];
    this.shape = SHAPES[typeId];

    this.x = 3;
    this.y = 0;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect((this.x || 0) + x, (this.y || 0) + y, 1, 1);
        }
      });
    });
  }

  //   drawNext() {
  //     this.next.fillStyle = this.color;
  //     this.shape.forEach((row, y) => {
  //       row.forEach((value, x) => {
  //         if (value > 0) {
  //           this.next.fillRect(x, y, 1, 1);
  //         }
  //       });
  //     });
  //   }

  move(p) {
    this.x = p.x;
    this.y = p.y;
  }

  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes);
  }
}

export default Piece;
