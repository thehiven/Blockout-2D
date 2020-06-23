document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  let score = 0;
  const scoreText = document.getElementById("score");
  
  const ball = {
    radius: 20,
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: -2,
    dy: -2
  };
  
  const field = {
    rowCount: 3,
    columnCount: 9,
    brickWidth: 75,
    brickHeight: 25,
    brickSpacing: 10,
    offsetTop: 25,
    offesetLeft: 20,
    bricks: []
  };
  
  const player = {
    width: 100,
    height: 25,
    x: canvas.width / 2,
    y: canvas.height
  };
  player.x -= player.width / 2;
  player.y -= player.height;

  function brick(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.draw = true;
  }
  
  function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = "#00ff00";
    context.fill();
    context.closePath();
  }

  function ballCollision() {
    // player collision
    if (ball.y + ball.radius >= player.y && ball.x > player.x && ball.x < player.x + player.width) ball.dy = -ball.dy;
      
    //top border collision
    if (ball.y < ball.radius) ball.dy = -ball.dy;

    //left and right border collision
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.dx = -ball.dx;

    //field collision
    for (let i = 0; i < field.rowCount; i++) {
      for (let j = 0; j < field.columnCount; j++) {
        const brick = field.bricks[i][j];
        if (brick.draw && ball.x > brick.x && ball.x < brick.x + field.brickWidth && 
            ball.y > brick.y && ball.y < brick.y + field.brickHeight) {
              ball.dy = -ball.dy;
              brick.draw = false;
              score += 1;
              scoreText.textContent = score;

              if (score == field.rowCount * field.columnCount) {
                alert("You WIN!");
                document.location.reload();
              }
            }
      }
    }
  }
  
  function drawPlayer() {
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height);
    context.fillStyle = "#0000ff";
    context.fill();
    context.closePath();
  }

  function movePlayer(event) {
    if (event.key == "ArrowRight") player.x += 10;
    if (event.key == "ArrowLeft") player.x -= 10;
  }
  
  function setupField() {
    for (let i = 0; i < field.rowCount; i++) {
      field.bricks[i] = [];
      for (let j = 0; j < field.columnCount; j++) {
        field.bricks[i][j] = new brick();
      }
    }
  }

  function drawField() {
    for (let i = 0; i < field.rowCount; i++) {
      for (let j = 0; j < field.columnCount; j++) {
        if (field.bricks[i][j].draw) {
          field.bricks[i][j].x = j * (field.brickWidth + field.brickSpacing) + field.offesetLeft;
          field.bricks[i][j].y = i * (field.brickHeight + field.brickSpacing) + field.offsetTop;

          context.beginPath();
          context.rect(field.bricks[i][j].x, field.bricks[i][j].y, field.brickWidth, field.brickHeight);
          context.fillStyle = "#ff0000";
          context.fill();
          context.closePath();
        }
      }
    }
  }
  
  function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 2;
    ball.dy = -2;
  
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height;

    for (let i = 0; i < field.rowCount; i++) {
      for (let j = 0; j < field.columnCount; j++) {
        field.bricks[i][j].draw = true;
      }
    }

    score = 0;
    scoreText.textContent = score;
  }
  
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPlayer();
    drawField();

    // player borders
    if (player.x < 0) player.x = 0
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    ballCollision();
  
    // game over condition
    if (ball.y > canvas.height) reset();
  
    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);
  }

  // setup game
  setupField();
  document.addEventListener("keydown", movePlayer);
  
  // start game
  draw();
});