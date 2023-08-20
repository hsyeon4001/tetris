import Board from './board.js';
import Piece from './piece.js';
import { COLS, ROWS, BLOCK_SIZE, KEY, POINTS, LEVEL } from './constants.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const playButton = document.querySelector('.play-button');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');
const star = document.querySelector('.right-column div div');

let requestId = null;
let piece = null;
let nextPiece = null;
let time = null;
let accountValues = { score: 0, lines: 0, level: 0 };
let count = 0;

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctxNext.canvas.width = 4 * BLOCK_SIZE;
ctxNext.canvas.height = 4 * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

playButton.addEventListener('click', play);

let board = new Board(ctx, ctxNext);

function play() {
  account.level = 0;
  account.score = 0;
  account.lines = 0;

  board.reset();
  time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawPiece();
  document.addEventListener('keydown', handleKey);
}

function drawPiece() {
  //   piece = new Piece(ctx);
  //   board.piece = piece;
  if (board.next) {
    piece = board.next;
    piece.ctx = ctx;
    piece.x = 3;
  } else {
    piece = new Piece(ctx);
  }
  board.piece = piece;
  piece.draw();
  board.drawNext();

  animate();
}

function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    let dropResult = board.drop();
    if (!dropResult) {
      cancelAnimationFrame(requestId);
      board.freeze();
      board.clearLines(account, time);

      if (piece.y === 0) {
        gameOver();
        return;
      }

      drawPiece();
    }
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

document.addEventListener('keydown', handleKey);

function handleKey(e) {
  if (board.moves[e.keyCode]) {
    e.preventDefault();

    let p = board.moves[e.keyCode](board.piece);
    if (e.keyCode === KEY.SPACE) {
      while (board.valid(p)) {
        board.piece.move(p);
        p = board.moves[KEY.DOWN](board.piece);
      }
      account.score += POINTS.HARD_DROP;

      cancelAnimationFrame(requestId);
      board.freeze();
      board.clearLines(account, time);

      drawPiece();
    } else {
      if (board.valid(p)) {
        account.score += POINTS.SOFT_DROP;
        board.piece.move(p);
      } else if (!board.insideWalls(p.x) || !board.insideWalls(p.x + p.shape.length)) {
      } else {
        cancelAnimationFrame(requestId);
        board.freeze();
        board.clearLines(account, time);
        drawPiece();
      }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();
  }
}

document.body.addEventListener('click', change);

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;

    updateAccount(key, value);

    if (accountValues.level >= 6) {
      clear();
      return false;
    }
    return true;
  },
});

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);

  document.removeEventListener('keydown', handleKey);
}

function clear() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(0.25, 3, 9.5, 2.4);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('CLEAR!', 0.75, 4);
  ctx.fillText('DID YOU FIND IT?', 0.75, 5);
  document.removeEventListener('keydown', handleKey);
}

function change(e) {
  if (e.target === star) count++;
  else count--;

  switch (count) {
    case 0:
      star.style.color = '#000';
      break;
    case 1:
      star.style.color = '#5D0000';
      break;
    case 2:
      star.style.color = '#930000';
      break;
    case 3:
      star.style.color = '#FF0000';
      break;
    case 4:
      star.classList.add('isVisible');
      count = 0;
      show();
  }
}

function show() {
  let dog = `<img class="dog" src="./dog.jpeg" />`;
  star.parentElement.insertAdjacentHTML('beforeend', dog);
  star.parentElement.lastElementChild.addEventListener('click', (e) => {
    e.target.remove();
    star.classList.remove('isVisible');
    star.style.color = '#000';
  });
}
