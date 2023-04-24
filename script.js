const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const buttons = document.querySelector('.buttons');
const buttonL = document.querySelector('.left');
const buttonR = document.querySelector('.right');

//checking if mobile:
const isMobile = window.matchMedia('(max-width:600px)').matches;
console.log(isMobile);

if (isMobile) {
  ctx.canvas.height = '500px';
  ctx.canvas.width = '400px';
  canvas.setAttribute('height', '500px');
  canvas.setAttribute('width', '400px');
  buttons.style.display = 'flex';
}

let score = 0;

let myName = ['VITOR BUTKUS', 'artist, webdeveloper', 'vitorbutkus@gmail.com'];

// const brickColumns = 1;
const brickRows = myName.length;

//Create ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: isMobile ? 7 : 10,
  speed: isMobile ? 1 : 2, //2
  dx: isMobile ? 1 : 2, //2
  dy: isMobile ? -1 : -2, //-2
};

//Create paddle properties
const paddle = {
  x: isMobile ? canvas.width / 2 - 25 : canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: isMobile ? 50 : 80,
  h: isMobile ? 8 : 10,
  speed: isMobile ? 2 : 8,
  dx: 0,
};

//Create brick properties
const brickInfo = {
  w: isMobile ? 14 : 25,
  h: 20,
  padding: isMobile ? 3 : 5,
  paddingX: isMobile ? 0 : 3,
  paddingY: isMobile ? 12 : 25,
  offsetX: isMobile
    ? canvas.width / 2 -
      (myName[2].length * 10) / 2 -
      ((myName[2].length - 1) * 5) / 2
    : canvas.width / 2 -
      (myName[2].length * 30) / 2 -
      ((myName[2].length - 1) * 5) / 2, //position of the first brick on canvas
  offsetY: 60, //position of the first brick on canvas
  visible: true,
};

//Create bricks
const bricks = [];
let brickColumns;
for (let i = 0; i < brickRows; i++) {
  bricks[i] = [];
  brickColumns = myName[i].length;
  for (j = 0; j < brickColumns; j++) {
    const x = j * (brickInfo.w + brickInfo.paddingX) + brickInfo.offsetX;
    const y = i * (brickInfo.h + brickInfo.paddingY) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); //draw circle
  ctx.fillStyle = '#888888';
  ctx.fill();
  ctx.closePath();
}

//Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#888888';
  ctx.fill();
  ctx.closePath();
}

//Draw score on canvas
function drawScore() {
  ctx.font = '20px Tomorrow';
  ctx.fillText(`Score:   ${score}`, canvas.width - 100, 30);
}

//Draw bricks on canvas

function drawBricks() {
  bricks.forEach((column, i) => {
    column.forEach((brick, j) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);

      ctx.fillStyle = brick.visible ? 'transparent' : 'transparent';
      ctx.fill();
      ctx.fillStyle = brick.visible ? '#000000' : 'transparent';
      ctx.font = isMobile ? '15px sans-serif' : '20px sans-serif';
      ctx.fillText(myName[i][j], brick.x + 5, brick.y + 16);
      ctx.closePath();
    });
  });

  bricks.forEach((column, i) => {
    column.forEach((brick, j) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);

      ctx.fillStyle = brick.visible ? 'transparent' : 'transparent';
      ctx.fill();
      ctx.fillStyle = brick.visible ? 'transparent' : '#d1d1d1';
      ctx.font = isMobile ? '15px sans-serif' : '20px sans-serif';
      ctx.fillText(myName[i][j], brick.x + 5, brick.y + 16);
      ctx.closePath();
    });
  });
}

//Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; //turn around direction of the movement
  }

  //Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1; //turn around direction of the movement
  }

  //Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x + ball.size > brick.x && //left brick side check
          ball.x + ball.size < brick.x + brick.w && //right brick side check
          ball.y + ball.size > brick.y && //top brick side check
          ball.y - ball.size < brick.y + brick.h //bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  //Hit bottom wall: lose
  if (ball.y + ball.size > canvas.height) {
    const loseScreen = document.querySelector('.lose');
    // loseScreen.classList.remove('hidden');
    setTimeout(() => {
      loseScreen.classList.add('hidden');
    }, 300);
    showAllBricks();
    score = 0;
    // ball.speed = 4;
  }
}

//Increase score
function increaseScore() {
  score++;

  //Win
  if (score === brickColumns * brickRows) {
    const winScreen = document.querySelector('.win');
    // winScreen.classList.remove('hidden');
    setTimeout(() => {
      winScreen.classList.add('hidden');
    }, 300);
    showAllBricks();
    score = 0;
    // ball.speed += 2;
  }
  //   if (score % (brickColumns * brickRows) === 0) {
  //     showAllBricks();
  //   }
}

//Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

//Draw everything
function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  // drawScore();
  drawBricks();
}

//Update canvas, drawing and animation
function update() {
  movePaddle();
  moveBall();

  //Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

//Keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

//Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

//Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//Buttons event handlers
if (isMobile) {
}
buttonL.addEventListener('pointerenter', (e) => {
  e.preventDefault();
  paddle.dx = -paddle.speed;
});
buttonL.addEventListener('pointerup', () => {
  paddle.dx = 0;
});
buttonR.addEventListener('pointerenter', (e) => {
  e.preventDefault();
  paddle.dx = paddle.speed;
});
buttonR.addEventListener('pointerup', () => {
  paddle.dx = 0;
});

//Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
