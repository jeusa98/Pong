//Das Canvas-Objekt für p5.js
let canvas;

let timeBetween = 0;

let gameStarted = false;
let gameEnded = false;

let mapImageLoaded = false;
let helperMapImageLoaded = false;
let staticMapLoadingTime = 0;

let playerNo = 0;

//Wird ein mal zu Beginn von p5.js aufgerufen.
function preload() {
  panda = loadImage('panda.jpg');
}

//Wird ein mal zu Beginn von p5.js aufgerufen.
function setup() {
  initializeDatabase();
  canvas = createCanvas(windowWidth, windowHeight);
  getCurrentPosition(setupMap);
  yLineIsSet = false;

  //Buttons und Slider
  setSlider();
  setButtons();
  setColors();
  getCurrentPosition(setCurPos);
  drawPosition();

  //Datenkrams
  retrievePlayerID();
  retrieveRoomID();
  playerNo = retrievePlayerNumber();
  fetchThisPlayer();
  fetchThisRoom();
}

//Wird in einer Schleife von p5.js aufgerufen.
function draw() {
  doPositionAndData();
  clear();
  //mousePosition();

  if(!gameStarted) {  //setup screen
    if(typeof mappaMap !== 'undefined') {
      playHereButton.show();
    }
    if(typeof yMinPointStart !== 'undefined') {
      slider.show();
      startGameButton.show();
      drawLinePaddle();
      //playerMoves(curPos);
    }
    drawPosition();

  } else {  //ingame screen
    if(!helperMapImageLoaded) {
      makeHelperMap();
    }
    if(mapImageLoaded && staticMapLoadingTime > 500) {
      if(!ready) {
      updateThisPlayerAttribute("ready", true);
      }
      if(otherPlayerReady && !gameEnded) {
      //if(true) {
        background(255);
        image(mapImage, 0, 0);

        if(typeof helperMappaMap !== 'undefined' && typeof staticMappaMap !== 'undefined') {
          setFieldParameters();
          updateStartingPoint();
          setYLineMinMax();

          //playerMoves(curPos);
          //calcPaddlePointX();

          testMovePaddles();

          drawField();
          drawPlayerInfo();
          checkGameWon();

          updateThisPlayerAttribute("xCoordinate", paddlePointX);
        }
      } else {
        showWaitingForOther();
      }
    } else {
      makeStaticMap();
      staticMapLoadingTime += deltaTime;
      showWaitingForOther();
    }
  }

}

//Methode zum Testen: Überträgt beim Klicken auf die Karte die Geo-Koordinaten
//der Maus an das Paddle.
function mousePosition() {
  if(mouseIsPressed) {
    const position = mappaMap.pixelToLatLng(mouseX, mouseY);
    setPaddleGeoCoor(position.lat, position.lng);
  }
}


//Wird ausgeführt, wenn die Karte sich ändert (Verschieben, Zoomen, Drehen).
//Innerhalb dieser Methode werden all die Methoden aufgerufen, die die neuen
//Bildschirm-Koordinaten bestimmen und die Methoden, die die Objekte zeichen.
function drawLinePaddle() {
  updateStartingPoint();
  setYLineMinMax();
  drawYLine();
  //drawPaddleOnPosition();
  setRotAngle(slider.value());
}

let doGetData = true;
let timestampTimeBetween = 0;

function doPositionAndData() {
  if(!gameEnded) {
    if(timeBetween >= 40) {
      getCurrentPosition(setCurPos);
      if(otherPlayerReady) {
        updateBallPosition();
      }
      timeBetween = 0;
      doGetData = true;
    } else {
      timeBetween += deltaTime;
    }

    if(timeBetween >= 20 && doGetData) {
      fetchOtherPlayer();
      if(playerNo == 2) {
        fetchThisRoom();
        fetchThisPlayersPoints();
      } else if(playerNo == 1) {
        fetchThisRoomWithoutBall();
      }
      doGetData = false;
    }

    if(timestampTimeBetween >= 1000) {
      updateThisPlayerAttribute("timestamp", Date.now());
      removeInactivePlayers();
      timestampTimeBetween = 0;
    } else {
      timestampTimeBetween += deltaTime;
    }
  }
}
