
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
    fill('green');
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
    fill('yellow');
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
  text("Points: 0", windowWidth - 130, windowHeight - 25);
  text("Points: 0", windowWidth - 130 + 20, 25);
}

function drawWaitingForOther() {
  background(240);
  rectMode(CENTER);
  fill(20);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Waiting for the", windowWidth/2, windowHeight/2 - 25);
  text("other player", windowWidth/2, windowHeight/2 + 25);
}

let xVelocity;  //in pixels/second
let yVelocity;
let ballDiameter = 15;
let firstRound = true;
let goalState = false;

let readyButton;

function setBallStart() {
  ballXCoor = fieldWidth/2;
  ballYCoor = -fieldWidth/3;
  xVelocity = 40;
  yVelocity = -40;

  updateBallPosition();
  paddlePointX = fieldWidth/2;
}

function updateBallPosition() {
  if(playerNo == 1) {
    updateThisRoomAttribute("ballXCoordinate", ballXCoor);
    updateThisRoomAttribute("ballYCoordinate", ballYCoor);
  }
}

function drawBall() {
  setReadyButton();

  if(playerNo == 1 && !goalState && playerReadyNextRound && otherPlayerReadyNextRound) {
    if(firstRound) {
      setBallStart();
      firstRound = false;
    }
    let fps = frameRate();
    let xVelPerFrame = xVelocity / fps;
    let yVelPerFrame = yVelocity / fps;

    fill('red');
    push();
      translate(originPoint.x, originPoint.y);
      circle(ballXCoor, ballYCoor, ballDiameter);
      ballXCoor += xVelPerFrame;
      ballYCoor += yVelPerFrame;
    pop();
    updateBallPosition();

  } else if(playerNo == 2 && !goalState && playerReadyNextRound && otherPlayerReadyNextRound) {
    let ballXCoor2 = fieldWidth - ballXCoor;
    let ballYCoor2 = -fieldWidth - ballYCoor;

    fill('red');
    push();
      translate(originPoint.x, originPoint.y);
      circle(ballXCoor2, ballYCoor2, ballDiameter);
    pop();
  }

  testCollision();
  testGoal();
}

let timeAfterGoalState = 0;

function testGoal() {
  let message = "empty";
  if(ballInOtherGoal) {
    goalState = true;
  }

  if(goalState) {
    xVelocity = 0;
    yVelocity = 0;

    playerReadyNextRound = false;
    updateThisPlayerAttribute("readyNextRound", playerReadyNextRound);

    if(ballInPlayerGoal) { //Punkt für Gegner
      message = "Fail";
      timeAfterGoalState += deltaTime;

      if(timeAfterGoalState >= 2000) {
      readyButton.show();
      }

    } else if(ballInOtherGoal) { //Punkt für diesen Spieler
      message = "Goal!";
      playerPoints += 1;
      updateThisPlayerAttribute("points", playerPoints);

      //timeAfterGoalState += deltaTime;
      if(timeAfterGoalState >= 2000) {
        readyButton.show();
      }
    }

    rectMode(CENTER);
    fill(20);
    rect(windowWidth/2, windowHeight/2, windowWidth, 100);
    fill(240);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(message, windowWidth/2, windowHeight/2);
  }
}

function setReadyButton() {
  readyButton = createButton("Ready?");
  readyButton.style('background-color', color(240));
  readyButton.style('color', color(20));
  rectMode(CENTER);
  readyButton.position(windowWidth/2, windowHeight/2 - 120);
  readyButton.mousePressed(playerReadyPressed);
}

function playerReadyPressed() {
  goalState = false;

  playerReadyNextRound = true;
  updateThisPlayerAttribute("readyNextRound", playerReadyNextRound);

  ballInPlayerGoal = false;
  updateThisPlayerAttribute("ballInPlayerGoal", ballInPlayerGoal);

  readyButton.hide();
  timeAfterGoalState = 0;
}

function testCollision() {
  let xCoor = ballXCoor;
  let yCoor = ballYCoor;

  if(playerNo == 2) {
    xCoor = fieldWidth -ballXCoor;
    yCoor = -fieldWidth -ballYCoor;
  }

  if(xCoor - ballDiameter/2 <= 0 ||                //linke Wand
     xCoor + ballDiameter/2 >= fieldWidth ) {  //rechte Wand
    xVelocity *= -1;
  }

  //Paddle Collision
  if(yCoor + ballDiameter/2 >= -movingLineWidth/2 - paddleHeightStatic/2 &&
     paddlePointX - paddleWidthStatic/2 <= xCoor && xCoor <= paddlePointX + paddleWidthStatic/2){
    yVelocity *= -1;
  } else if(//yCoor - ballDiameter/2 <= -fieldWidth + movingLineWidth/2 ||  //Gegnertor
     yCoor + ballDiameter/2 >= -movingLineWidth/2) {               //eigenes Tor
    goalState = true;
    ballInPlayerGoal = true;
    updateThisPlayerAttribute("ballInGoal", ballInPlayerGoal);
    }

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
