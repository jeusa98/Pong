
//Das Canvas-Objekt für p5.js
let canvas;

let timeBetweenGPS = 0;

let curPos;

//Wird ein mal zu Beginn von p5.js aufgerufen.
//Wird ein mal zu Beginn von p5.js aufgerufen.
function preload() {
  panda = loadImage('panda.jpg');
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  yLineIsSet = false;

  //Buttons und Slider
  setSlider();
  setButtons();
  getCurrentPosition(setupMap);
  getCurrentPosition(curPos);
  pandaBg();
  drawPosition();
}

//Wird in einer Schleife von p5.js aufgerufen.
function draw() {
  clear();
  /*
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setCurPos, geoError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 6000
    });
  }
  */
  if(timeBetweenGPS >= 50) {
    getCurrentPosition(setCurPos);
    timeBetweenGPS = 0;
  } else {
    timeBetweenGPS += deltaTime;
  }

  if(yLineIsSet) {
    drawLinePaddle();
    playerMoves(curPos);
  }
  drawPosition();
  //mousePosition();
}

//Methode zum Testen: Überträgt beim Klicken auf die Karte die Geo-Koordinaten
//der Maus an das Paddle.
function mousePosition() {
  if(mouseIsPressed) {
    //const position = mappaMap.pixelToLatLng(mouseX, mouseY);
    //setPaddleGeoCoor(position.lat, position.lng);
    return false;
  }
}


//Wird ausgeführt, wenn die Karte sich ändert (Verschieben, Zoomen, Drehen).
//Innerhalb dieser Methode werden all die Methoden aufgerufen, die die neuen
//Bildschirm-Koordinaten bestimmen und die Methoden, die die Objekte zeichen.
function drawLinePaddle() {
  updateStartingPoint();
  setYLineMinMax();
  drawYLine();
  drawPaddleOnPosition();
  setRotAngle(slider.value());
}

function setCurPos(position) {
  console.log(position.latitude);
  curPos = {
    lat: position.latitude,
    lng: position.longitude
  };
}

function drawPosition() {
  if(typeof curPos !== 'undefined' && typeof mappaMap !== 'undefined') {
    let pos = mappaMap.latLngToPixel(curPos.lat, curPos.lng);
    console.log(pos);
    fill(color('magenta'));
    ellipse(pos.x, pos.y, 15, 15);
    console.log("Draw Position");
  }
  //else {console.log("Position undefined")};
}

function geoError(error) {
  console.log("Geolocation Error: ", error);
}
