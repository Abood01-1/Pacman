var pacman = document.getElementById("pacman");
var restart = document.getElementById("game-over");
var restartBTN = document.querySelector("#game-over button");
var body = document.querySelector("body");
var snake = document.getElementById("snake");
var bestScoreSpan = document.getElementById("best-score");
const snakeSegments = [];
var left = 0;
var topp = 0;
let x;
let y;
var step = 20; // Adjust the step size as needed
var direction = "right"; // Initial direction
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreSpan.innerHTML = localStorage.getItem("bestScore");

restartBTN.addEventListener("click", () => {
  location.reload();
});

function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      pacman.className = "";
      pacman.classList.add("top");
      break;
    case "ArrowDown":
      direction = "down";
      pacman.className = "";
      pacman.classList.add("down");
      break;
    case "ArrowLeft":
      direction = "left";
      pacman.className = "";
      pacman.classList.add("left");
      break;
    case "ArrowRight":
      direction = "right";
      pacman.className = "";
      pacman.classList.add("right");
      break;
  }
}

function move() {
  switch (direction) {
    case "up":
      topp -= step;
      break;
    case "down":
      topp += step;
      break;
    case "left":
      left -= step;

      break;
    case "right":
      left += step;
      break;
    default:
      return;
      break;
  }

  if (
    document.body.clientWidth - 40 <= left ||
    left < 0 ||
    document.body.clientHeight - 40 <= topp ||
    topp < 0
  ) {
    gameOver(true);
  }

  pacman.style.top = topp + "px";
  pacman.style.left = left + "px";
  pacmanMovement();
  moveSnake();
  if (snakeTouchPacman()) {
    gameOver(true);
  }
}

function gameOver(cases) {
  if (cases) {
    restart.style.display = "grid";
    clearInterval(interval);
  }
}

var interval = setInterval(move, 100);

document.addEventListener("keydown", handleKeyDown);

function createPoint() {
  x = Math.floor(Math.random() * (document.body.clientWidth - 50));
  y = Math.floor(Math.random() * (document.body.clientHeight - 100));
  console.log(x, y);
  if (y < 10) {
    y += 20;
  }
  if (x < 10) {
    y += 20;
  }
  let span = document.createElement("div");
  span.id = "point";
  span.style.left = x + "px";
  span.style.top = y + "px";
  body.appendChild(span);
}

function pacmanMovement() {
  //get the current position of the pacman

  const pacmanRect = pacman.getBoundingClientRect();
  const pacmanX = Math.floor(pacmanRect.left + pacmanRect.width / 2);
  const pacmanY = Math.floor(pacmanRect.top + pacmanRect.height / 2);
  // get the current position of the point
  var point = document.getElementById("point");
  const pointX = +point.style.left.slice(0, -2);
  const pointY = +point.style.top.slice(0, -2);
  if (
    Math.abs(pacmanX - pointX) < pacmanRect.width / 2 &&
    Math.abs(pacmanY - pointY) < pacmanRect.height / 2
  ) {
    point.remove();
    createPoint();
    updateScore();
  }
}
var interval2;

function updateScore() {
  score++;
  document.getElementById("score").innerHTML = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreSpan.innerHTML = score;
    localStorage.setItem("bestScore", bestScore);
  }
  if (score % 5 === 0) {
    step += 5;
  }

  createSnakeSegment();
}

function moveSnake() {
  const pacmanRect = pacman.getBoundingClientRect();
  const snakeHead = snakeSegments[0];
  const snakeHeadRect = snakeHead.getBoundingClientRect();
  const dx = pacmanRect.left - snakeHeadRect.left;
  const dy = pacmanRect.top - snakeHeadRect.top;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = 15;
  const vx = (dx / distance) * speed;
  const vy = (dy / distance) * speed;
  snakeHead.style.left = snakeHeadRect.left + vx + "px";
  snakeHead.style.top = snakeHeadRect.top + vy + "px";

  for (let i = snakeSegments.length - 1; i > 0; i--) {
    const prevSnake = snakeSegments[i - 1];
    const segment = snakeSegments[i];
    const prevSegmentRect = prevSnake.getBoundingClientRect();
    segment.style.left = prevSegmentRect.left + "px";
    segment.style.top = prevSegmentRect.top + "px";
  }
}
function createSnakeSegment() {
  let segment = document.createElement("span");
  segment.className = `segments${score}`;
  segment.style.left = score * 5 - "px";
  snake.append(segment);
  snakeSegments.push(segment);
}

function snakeTouchPacman() {
  const snakeHeadRect = snakeSegments[0].getBoundingClientRect();
  const pacmanRect = pacman.getBoundingClientRect();

  return (
    snakeHeadRect.left < pacmanRect.right &&
    snakeHeadRect.right > pacmanRect.left &&
    snakeHeadRect.top < pacmanRect.bottom &&
    snakeHeadRect.bottom > pacmanRect.top
  );
}

createPoint();
