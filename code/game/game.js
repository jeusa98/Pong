
let startNewGameButton;
let colorPlayerOne;
let colorPlayerTwo;
let colorBall;

function setColors() {
  colorPlayerOne = color(255, 77, 210);   //pink
  colorPlayerTwo = color(102, 255, 102);  //green
  colorBall = color(240);
}

function calcPaddlePointX() {
  rectHeight = calculateRotatedVector(yMinPoint, yMaxPoint, rotAngle);
  let helpPos = mappaMap.latLngToPixel(paddleGeoCoor.lat, paddleGeoCoor.lng);
  let transfPos = calculateRotatedVector(yMinPoint, helpPos, rotAngle);

  if(transfPos.y < 0) {
    paddlePointX = fieldWidth;
  }
  else if(transfPos.y > rectHeight.y) {
    paddlePointX = 0;
  }
  else {
    paddlePointX = fieldWidth - map(transfPos.y, 0, rectHeight.y, 0, fieldWidth);
  }

  if(paddlePointX < paddleWidthStatic/2) {
    paddlePointX = paddleWidthStatic/2;
  }
  else if(paddlePointX > fieldWidth - paddleWidthStatic/2) {
    paddlePointX = fieldWidth - paddleWidthStatic/2;
  }
}

function drawPaddle() {
  push();
  translate(originPoint.x, originPoint.y);
    rectMode(CENTER);
    fill(colorPlayerOne);
    noStroke();
    rect(paddlePointX, -movingLineWidth/2, paddleWidthStatic, paddleHeightStatic);
  pop();

  //fill('black');
  //ellipse(originPoint.x, originPoint.y, 5, 5);
}

function drawOtherPaddle() {
  let otherX = fieldWidth - otherPlayerXCoor;
  push();
    translate(originPoint.x, originPoint.y);
    rectMode(CENTER);
    fill(colorPlayerTwo);
    noStroke();
    if(otherPlayerXCoor <= -1) {
      otherX = fieldWidth/2;
    }
    rect(otherX, -fieldWidth + movingLineWidth/2, paddleWidthStatic, paddleHeightStatic);
  pop();
}

function drawPlayerInfo() {
  rectMode(CORNER);
  fill(240);
  noStroke();
  rect(0, windowHeight - 50, windowWidth, 50);
  rect(0, 0, windowWidth, 50);

  rectMode(CENTER);
  fill(20);
  textSize(23);
  textAlign(CENTER, CENTER);
  text(playerName, 80, windowHeight - 25, 200, 50);
  text(otherPlayerName, 80, 25, 200, 50);

  let pointsTextP1 = "Points: " + playerPoints;
  let pointsTextP2 = "Points: " + otherPlayerPoints;
  text(pointsTextP1, windowWidth - 130, windowHeight - 25);
  text(pointsTextP2, windowWidth - 130 + 20, 25);

}

function showWaitingForOther() {
  background(240);
  rectMode(CENTER);
  fill(20);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Waiting for the", windowWidth/2, windowHeight/2 - 25);
  text("other player", windowWidth/2, windowHeight/2 + 25);
}

function showLostScreen() {
  background(240);
  rectMode(CENTER);
  fill(20);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("You lost", windowWidth/2, windowHeight/2);
}

function showWonScreen() {
  background(240);
  rectMode(CENTER);
  fill(20);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("You won!", windowWidth/2, windowHeight/2);
}

function setStartNewGameButton() {
  startNewGameButton = createButton("Start new game");
  startNewGameButton.size(startNewGameButton.size().width + 10, startNewGameButton.size().height + 10);
  startNewGameButton.position(windowWidth/2 - startNewGameButton.size().width/2, windowHeight/2 + 50);
  startNewGameButton.style('background-color', color(20));
  startNewGameButton.style('color', color(240));
  startNewGameButton.mousePressed(startNewGame);
  startNewGameButton.hide();
}

function startNewGame() {
  console.log(playerID, roomID);
  removeThisRoom();
  removeThisPlayer();
  window.location.href = "../menus/index.html";
}

let xVelocity;  //in pixels/second
let yVelocity;
let ballDiameter = 15;
let firstRound = true;
let xBallDraw;
let yBallDraw;

function setBallStart() {
  ballXCoor = fieldWidth/2;
  ballYCoor = -fieldWidth/2;
  updateThisRoomAttribute("ballXCoordinate", ballXCoor);
  updateThisRoomAttribute("ballYCoordinate", ballYCoor);
  xVelocity = 20 * 3;
  yVelocity = -10 * 3;
}

function drawBall() {
  if(firstRound) {
    setFirstRound();
  }

  if(playerNo == 1) {
    let fps = frameRate();
    let xVelPerFrame = xVelocity / fps;
    let yVelPerFrame = yVelocity / fps;

    ballXCoor += xVelPerFrame;
    ballYCoor += yVelPerFrame;
    xBallDraw = ballXCoor;
    yBallDraw = ballYCoor;

    testCollision();

  } else if(playerNo == 2) {
    xBallDraw = fieldWidth - ballXCoor;
    yBallDraw = -fieldWidth - ballYCoor;
  }

  fill(colorBall);
  push();
    translate(originPoint.x, originPoint.y);
    circle(xBallDraw, yBallDraw, ballDiameter);
  pop();
}

function testCollision() {
  if((xBallDraw - ballDiameter/2 <= 0 && xVelocity < 0) ||                //linke Wand
     (xBallDraw + ballDiameter/2 >= fieldWidth && xVelocity > 0)) {  //rechte Wand
    xVelocity *= -1;
  }

  //Kollision mit eigenem Paddle
  if(yBallDraw + ballDiameter/2 >= -movingLineWidth/2 - paddleHeightStatic/2) {
    if(paddlePointX - paddleWidthStatic/2 <= xBallDraw && xBallDraw <= paddlePointX + paddleWidthStatic/2 && yBallDraw < -movingLineWidth/2 - paddleHeightStatic/2 && yVelocity > 0) { //obere Seite des Paddles
      yVelocity *= -1;
      colorBall = colorPlayerOne;
    } else if (xBallDraw - ballDiameter/2 <= paddlePointX + paddleWidthStatic/2 && xBallDraw > paddlePointX && xVelocity < 0) { //rechte Seite des Paddles
      xVelocity *= -1;
      colorBall = colorPlayerOne;
    } else if (paddlePointX - paddleWidthStatic/2 <= xBallDraw + ballDiameter/2 && xBallDraw < paddlePointX && xVelocity > 0) { //linke Seite des Paddles
      xVelocity *= -1;
      colorBall = colorPlayerOne;
    }
  }

  let otherXDraw = fieldWidth - otherPlayerXCoor;

  //Kollision mit Paddle des Gegners
  if(yBallDraw - ballDiameter/2 <= -fieldWidth + movingLineWidth/2 + paddleHeightStatic/2) {
      if(otherXDraw - paddleWidthStatic/2 <= xBallDraw && xBallDraw <= otherXDraw + paddleWidthStatic/2 && yBallDraw > -fieldWidth + movingLineWidth/2 - paddleHeightStatic/2 && yVelocity < 0) {
       yVelocity *= -1;
       colorBall = colorPlayerTwo;
     } else if (xBallDraw - ballDiameter/2 <= otherXDraw + paddleWidthStatic/2 && xBallDraw > otherXDraw && xVelocity < 0) { //rechte Seite des Paddles
        xVelocity *= -1;
        colorBall = colorPlayerTwo;
      } else if (otherXDraw - paddleWidthStatic/2 <= xBallDraw + ballDiameter/2 && xBallDraw < otherXDraw && xVelocity > 0) { //linke Seite des Paddles
        xVelocity *= -1;
        colorBall = colorPlayerTwo;
      }
   }

   if(yBallDraw - ballDiameter/2 <= - fieldWidth && yVelocity < 0) {  //Wand oben, Punkt für Player one
     ++playerPoints;
     updateThisPlayerAttribute("points", playerPoints);
     yVelocity *= -1;
   }
   if(yBallDraw + ballDiameter/2 >= 0 && yVelocity > 0) { //Wand unten, Punkt für Player two
     ++otherPlayerPoints;
     updateOtherPlayerAttribute("points", otherPlayerPoints);
     yVelocity *= -1;
   }
}

function checkGameWon() {
  if(playerPoints >= 2) {
    showWonScreen();
    startNewGameButton.show();
    gameEnded = true;
  } else if(otherPlayerPoints >= 2) {
    showLostScreen();
    startNewGameButton.show();
    gameEnded = true;
  }
}

function updateBallPosition() {
  if(playerNo == 1) {
    updateThisRoomAttribute("ballXCoordinate", ballXCoor);
    updateThisRoomAttribute("ballYCoordinate", ballYCoor);
  }
}

function setFirstRound() {
  setBallStart();
  firstRound = false;
}

let i = 0;
function testMovePaddles() {
  if(i == 0) {
    paddlePointX = fieldWidth/2;
    ++i;
  }
  if(keyIsDown(LEFT_ARROW)) {
    paddlePointX -= 4;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    paddlePointX += 4;
  }

  if(paddlePointX < paddleWidthStatic/2) {
    paddlePointX = paddleWidthStatic/2;
  }
  else if(paddlePointX > fieldWidth - paddleWidthStatic/2) {
    paddlePointX = fieldWidth - paddleWidthStatic/2;
  }

  /*
  if(keyIsDown(65)) {
    otherPlayerXCoor += 4;
  }
  if(keyIsDown(68)) {
    otherPlayerXCoor -= 4;
  }

  if(otherPlayerXCoor < paddleWidthStatic/2) {
    otherPlayerXCoor = paddleWidthStatic/2;
  }
  else if(otherPlayerXCoor > fieldWidth - paddleWidthStatic/2) {
    otherPlayerXCoor = fieldWidth - paddleWidthStatic/2;
  } */
}
